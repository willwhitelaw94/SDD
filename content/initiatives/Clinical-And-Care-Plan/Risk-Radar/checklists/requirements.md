---
title: "Requirements Checklist: Risk Radar"
---

# Requirements Checklist: Risk Radar

**Spec**: `spec.md` | **Reviewed**: 2026-02-14

---

## Content Quality

- [x] Written in business language (no technical jargon, APIs, database, component references)
- [x] Focused on user value and outcomes, not implementation details
- [x] Uses Trilogy Care terminology (Coordinator, Recipient, Package, Care Partner)
- [x] Active voice throughout
- [x] Concrete examples provided (e.g., "Prevalence 3 × Impact 4 = 12")
- [x] No implementation details (no React, Laravel, SQL references)

## Requirement Completeness

- [x] All user stories meet INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- [x] All acceptance scenarios use Given/When/Then format
- [x] No [NEEDS CLARIFICATION] markers remaining
- [x] All functional requirements are testable
- [x] Success criteria are measurable and technology-agnostic
- [x] Edge cases identified and addressed (7 edge cases documented)
- [x] Out of scope clearly defined (8 items listed for Phase 2/3)

## Functional Requirements Coverage

### Scoring Engine (FR-001 to FR-006)
- [x] FR-001: Separate scoring panel after risk save (decoupled from risk form)
- [x] FR-001a: Scoring accessible from Risk Radar sub-tab (Assess/Edit Score)
- [x] FR-001b: Scoring skippable with soft nudge banner
- [x] FR-002: P × I = score (1-25)
- [x] FR-002a: Domain scores derived only (no manual domain scoring)
- [x] FR-004: 4 zones defined with continuous thresholds for aggregates
- [x] FR-005: Simplified 3-zone view for care partners
- [x] FR-006: Legacy risks treated as "Not assessed"

### Domain Mapping (FR-007 to FR-010)
- [x] FR-007: 28 categories mapped to 5 domains
- [x] FR-008: Code-managed mappings (not admin-configurable)
- [x] FR-009: Max or Mean aggregation, togglable, default Max
- [x] FR-010: Partially-scored domain handling

### Visualisation (FR-011 to FR-015)
- [x] FR-011: Sub-tab architecture (Risk Radar + All Risks)
- [x] FR-011a: Radar (spider) chart rendering
- [x] FR-012: Bar chart alternative (togglable)
- [x] FR-013: Composite score badge in header
- [x] FR-014: Domain drill-down to individual risks / 5x5 matrix
- [x] FR-015: Traffic light colour system as primary visual language

### Risk Cards & List (FR-016 to FR-018)
- [x] FR-016: Risk cards grouped by domain
- [x] FR-017: P, I, score, zone displayed on each card
- [x] FR-018: Expandable/collapsible domain groups

### Composite Score (FR-019 to FR-021)
- [x] FR-019: Composite from domain scores (same Max/Mean method)
- [x] FR-020: Composite classified into 4 zones
- [x] FR-021: Composite displayed in risk profile header

### Contextual Help (FR-022 to FR-025)
- [x] FR-022: Tooltips on scoring inputs (P, I, score, zones)
- [x] FR-023: Tooltip on Max/Mean toggle
- [x] FR-024: Tooltip on composite badge
- [x] FR-025: Contextual help on radar/bar chart

### Audit & Permissions (FR-026 to FR-028)
- [x] FR-026: Score changes in audit trail
- [x] FR-027: manage-risk permission respected
- [x] FR-028: Feature flag per organisation

## Feature Readiness

- [x] Key entities defined (5 entities: Risk Domain, Category Mapping, Risk extended, Domain Score, Composite Score)
- [x] User stories prioritised (P1: US1-3, P2: US4-6, P3: US7)
- [x] Acceptance criteria verifiable without implementation knowledge
- [x] Success criteria measurable (8 criteria with specific metrics)
- [x] Clarifications documented (8 Q&A entries from spec lens session)
- [x] Cross-referenced against Australian aged care frameworks (ACQSC, ISO 31000)
- [x] Pilot/rollout strategy defined (feature flag + clinician trial)

## Standards Alignment

- [x] Scoring labels match ACQSC Toolkit 1 risk matrix (Rare/Unlikely/Possible/Likely/Almost Certain + Insignificant/Minor/Moderate/Major/Catastrophic)
- [x] "High impact and high prevalence" language aligns with Strengthened Aged Care Quality Standards (2025)
- [x] Traffic light colour system matches industry convention (green/yellow/orange/red)
- [x] Thresholds are more conservative than generic frameworks (appropriate for aged care)

---

**Result**: All checks pass. Spec is ready for next steps.

**Next Steps**:
- `/trilogy-clarify business` — Align on business objectives
- `/trilogy-spec-handover` — Gate 1 (Business Gate: transitions Backlog -> Start)
