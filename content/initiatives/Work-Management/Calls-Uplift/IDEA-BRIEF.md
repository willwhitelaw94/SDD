---
title: "Calls Uplift: Idea Brief"
description: Work Management > Calls Uplift
navigation:
  order: 1
icon: i-heroicons-light-bulb
---

**Epic Code**: CALLS-UPLIFT
**Created**: 2026-01-14
**Updated**: 2026-02-05

## Problem Statement (What)

**66% of care coordinator calls are untagged** - not linked to packages - resulting in significant revenue loss from unattributed care management time.

### Current State

- 250+ coordinators make daily calls via Aircall
- Only **34% of calls** are properly linked to packages
- Linking requires **manual entry** of TC customer numbers into Aircall comments
- No in-app call context or work management integration
- Call duration not automatically captured as care management activity

### Impact

| Problem                 | Business Impact                                        |
| ----------------------- | ------------------------------------------------------ |
| Untagged calls          | Revenue loss - care management time unattributed       |
| Manual tagging friction | Coordinators skip tagging due to workflow interruption |
| Disconnected tools      | Context switching between Aircall extension and Portal |
| No activity capture     | 15 min/month care management minimums harder to track  |

## Possible Solution (How)

### Call Bridge UI

An in-app interface providing coordinators with context during calls:

1. **Call notification banner** - Shows when coordinator is on a call
2. **Package context panel** - Auto-matched package details (via Trilogy Graph)
3. **Manual link button** - Quick search and link if no auto-match
4. **Activity log checkbox** - "Log as care management activity"
5. **Quick note field** - Add call summary

### Auto-Matching via Trilogy Graph

- Trilogy Graph provides centralized phone number data
- Graph matches calls to packages using phone relationships
- Portal queries Graph for call-package associations
- Eliminates need for manual TC number entry

### Technical Approach

- Phone matching logic moves to Trilogy Graph (not Portal webhook processing)
- Portal focuses on **UI/UX** for call bridge experience
- Activity capture integrated with existing care management module
- Leverage existing `HasPhoneNumber` trait and E.164 normalization

## Benefits (Why)

| Benefit                          | Metric/Outcome                               |
| -------------------------------- | -------------------------------------------- |
| **Increased revenue capture**    | Target: 66% → 95%+ call attribution          |
| **Reduced coordinator friction** | No manual TC number entry required           |
| **Better activity tracking**     | Automatic care management time logging       |
| **Improved data quality**        | More accurate call-to-package relationships  |
| **Work management integration**  | Calls in context with tasks, notes, timeline |

## Owner (Who)

**Product Owner:** Beth P
**Pod:** Duck, Duck Go (Care Coordination)
**Tech Lead:** Matt (Work Management)

## Other Stakeholders (Accountable / Consulted / Informed)

| Role              | Person    | RACI        |
| ----------------- | --------- | ----------- |
| Product           | Beth P    | Accountable |
| Engineering       | Matt      | Responsible |
| Graph Team        | TBD       | Consulted   |
| Care Coordinators | End users | Informed    |
| Operations        | TBD       | Consulted   |

## Assumptions & Dependencies, Risks

### Assumptions

- Trilogy Graph will provide call-to-package phone matching API
- Aircall webhook integration remains stable
- Coordinators will adopt new UI if it reduces friction
- Call recording compliance requirements unchanged (7-year retention)

### Dependencies

- **Trilogy Graph** - Phone number matching and call-package relationships
- **Work Management epic** - Integration with tasks, notes, timeline
- **Care Management Activities** - Activity capture integration
- **Aircall** - Continued webhook support for call events

### Risks

| Risk                               | Mitigation                               |
| ---------------------------------- | ---------------------------------------- |
| Graph API delays                   | Build UI with manual linking as fallback |
| Multiple package matches per phone | Design disambiguation UI                 |
| Coordinator adoption               | User testing, gradual rollout            |
| Performance impact                 | Optimize Graph queries, caching          |

## Estimated Effort

| Component            | Estimate              |
| -------------------- | --------------------- |
| Call Bridge UI (MVP) | Medium                |
| Graph integration    | Depends on Graph team |
| Activity capture     | Small                 |
| Testing & rollout    | Medium                |

**Total:** Medium-Large (dependent on Graph timeline)

## Proceed to PRD?

Yes - pending Graph team alignment on API contract.

---

## Related Documents

- [Research Document](context/raw_context/RESEARCH-2026-02-05)
- [Domain Doc: Telephony](/context/domains/calls)
- [Care Management Activities](/initiatives/Work-Management/CM-Activities/)
