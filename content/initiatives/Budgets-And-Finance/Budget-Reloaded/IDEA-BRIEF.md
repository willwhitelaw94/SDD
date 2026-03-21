---
title: "Idea Brief: Budget Reloaded (BUR)"
description: "Budgets And Finance > Budget Reloaded"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: BUR (TP-2501) | **Created**: 2026-01-14

---

## Problem Statement (What)

Care coordinators face multiple pain points when managing budgets, including supplier integration gaps, high cognitive load, and inconsistent UI patterns.

**Pain Points:**
- **Supplier Integration Gap**: Cannot list suppliers in budget pivot tables or attach them to bookings; rate cards exist in isolation without flexible workflows
- **High Cognitive Load**: Every budget requires selecting funding streams from scratch; no defaults exist, forcing repetitive selections
- **Unclear Coordination Settings**: Coordination loading and co-contribution categories are buried in UI
- **Inconsistent Funding Display**: Current UI lacks human-readable context ("last quarter for this funding", "6 week period")
- **Scattered UI Patterns**: "Add Plan" floats separately, action buttons lack unified placement

**Current State**: Slow budget creation, increased errors, frustrated coordinators repeating selections across hundreds of budgets.

---

## Possible Solution (How)

Comprehensive budget UI and workflow redesign:

- **Supplier & Rate Card Integration**: Enable supplier listing in budget pivot tables, support supplier attachment to bookings, decouple rate planning from supplier selection
- **Exception-Based Funding Defaults**: Establish default funding streams per service to eliminate repetitive selection
- **Prominent Coordination Display**: Show coordination loading in collapsed budget state, display "Coordinated by X for Y%" prominently
- **Human-Readable Funding Context**: Display funding period info ("last quarter", "6 weeks remaining"), improve spent vs forecast representation
- **Unified UI Patterns**: Move "Add Plan" into dropdown, create unified action tray, simplify package metadata display

```
// Before (Current)
1. Cannot attach suppliers to budgets
2. Repetitive funding stream selection
3. Hidden coordination settings
4. Scattered UI patterns

// After (With BUR)
1. Flexible supplier-rate card workflow
2. Default funding streams
3. Prominent coordination display
4. Unified action tray
```

---

## Benefits (Why)

**User/Client Experience:**
- Default funding streams eliminate 80% of repetitive selections
- Prominent coordination display increases stakeholder confidence

**Operational Efficiency:**
- Faster budget creation with unified UI patterns and collapsed states
- Flexible planning without blocking on supplier decisions

**Business Value:**
- Accuracy — supplier-rate card integration ensures correct rates
- Transparency — human-readable funding periods improve visibility
- Consistency — unified action tray creates predictable interaction model

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw (PO), Bruce Blyth (PO), Romy Blacklaw (PO), Will Whitelaw (BA), Bruce Blyth (Des), Khoa Duong (Dev) |
| **A** | Marko Rukovina |
| **C** | Marko Rukovina |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Services Australia funding streams are well-defined and stable enough to establish defaults
- Rate cards exist in current system and can be extended to support supplier attachment workflow
- Coordination loading percentages are stored and accessible for display
- Package metadata (created by, commencement date, last modified) is tracked in current system

**Dependencies:**
- Existing rate card infrastructure
- CMA Activity email notification pattern (for reuse)

**Risks:**
- Scope creep from multiple large initiatives (HIGH impact, MEDIUM probability) → Clear sub-epic boundaries and phased delivery
- Permission model changes impact existing workflows (MEDIUM impact, MEDIUM probability) → Careful migration planning

---

## Success Metrics

- Funding stream selection time reduced by 80%
- Budget creation time reduced by 50%
- Coordinator satisfaction score improved by 20%
- Zero errors from supplier-rate card mismatches

---

## Estimated Effort

**L (Large) — 4-8 weeks parallel work**

Sub-Epics:
- TP-2502 (Discovery): Data analysis + vendor workflow validation — 2-4 weeks
- TP-2503 (Design): UI patterns, modals, coordination display — 4-6 weeks
- TP-2504 (Development): Schema, API, supplier attachment — 4-8 weeks
- TP-2505 (QA): Testing strategy + user validation — 2-4 weeks
- TP-2506 (Release): Migration, deployment, rollout — 1-2 weeks

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Scope sub-epics independently with the team
2. Validate funding stream defaults with Services Australia rules
3. `/speckit.specify` — Create detailed technical specification
