---
title: "AI Invoice V3 Epic - Context & Decisions"
---


## Epic Overview

**Epic**: TP-2323-AIV3 - AI Invoice V3
**Initiative**: Supplier Management
**Created**: 2025-12-23 (as AIC), Merged 2026-02-03

---

## Session Log

### Epic Merge - 2026-02-03

- **Decision**: Merged AI Invoice Classification (TP-3301-AIC) into AI Invoice V3 (TP-2323)
- **Rationale**: Consolidate related work under single epic; V3 was a placeholder, AIC had comprehensive spec
- **Files Migrated**: IDEA-BRIEF.md (rewritten), spec.md, plan.md, design.md, context/

### Epic Creation - 2025-12-23

- **Decision**: Created AI Invoice Classification epic (separate from TP-3300 Invoice Recode)
- **Rationale**: AI classification is a distinct feature from manual bulk recode; different scope, timeline, and stakeholders
- **Files Created**: idea.md, spec.md

#### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Classification Signals** | Keyword + Supplier + Rate + History + Budget | Multiple signals increase accuracy; rate matching disambiguates similar services |
| **UI Pattern** | Breadcrumb: Tier 1 → Tier 2 → Tier 3 | Visual hierarchy, icons, colors for quick scanning |
| **Service Selection** | Scoped to AI-suggested Tier 2 by default | Prevents wrong category selection; requires explicit step-back to change |
| **Step-back Flow** | Tier 2 → Tier 1 → ALL | Progressive disclosure; contribution category warning on change |
| **Multi-service** | Detect & recommend split | Philippines team can split manually; future auto-split |
| **Travel Logic** | Under $10 = travel component, not standalone | Merge with related service; distinguish direct/indirect/accompanied |
| **Unplanned Services** | Promoted prominently (not nested) | People choosing wrong budgets; AI pre-fills suggestions |
| **Accuracy Target** | 80% | Better than current manual; human-in-the-loop confirmation |
| **Supplier Coverage** | Target 90% verified by January | Currently ~50%; casual team to call suppliers |

#### Classification Engine Signals

1. **Keyword matching** - Exclusive keywords (definitive) + Possible keywords (probable)
2. **Supplier verified services** - Narrow options based on supplier registration
3. **Supplier rate matching** - Unit rates disambiguate (physio $140 vs OT $500)
4. **Historical patterns** - Cleaned data Nov 1 - Dec 13
5. **Client budget/services** - Approved services in TC + Services Australia

#### Phased Rollout

| Phase | Timeline | Scope |
|-------|----------|-------|
| Phase 1 | January-February | Core AI classification, breadcrumb UI, scoped selection, multi-service detection |
| Phase 2 | February-March | Top 200 supplier refinements, retrospective batch classification, analytics |

#### Action Items

| Owner | Action |
|-------|--------|
| Dave & Erin | Finalize 15 Tier 2 categories with descriptions and keywords |
| Will | Share AI prompt template for supplier-specific support |
| Data team | Continue custom prompting rollout for top 200 suppliers |
| Erin | Establish casual team for verified services (target 90%) |
| Zoe/QA | Shift from audits to supplier invoicing coaching |
| Romy | Product classification (when available) |

---

## Key Terminology

| Term | Definition |
|------|------------|
| Tier 1 | ServiceCategory (8 categories: Daily Living, Personal Care, Allied Health, etc.) |
| Tier 2 | ServiceType (15 specific services, e.g., Physiotherapy, Occupational Therapy) |
| Tier 3 | ServiceItem (specific line items within each service type) |
| Co-contribution Category | Determines client contribution percentage; linked to ServiceType |
| SERG | Services Australia service group selection (affects funding source) |
| Exclusive Keywords | Definitive match for a category (e.g., "Personal Care") |
| Possible Keywords | Probable match for a category (e.g., "Bathroom") |
| Supplier Verified Services | Services registered by supplier in portal (~50% coverage, target 90%) |

---

## BRP Context (January 2026)

Key quotes from BRP discussion:

> "AI invoice classification is what Merit has to do every month... with Romy and co. Romy and I are the AI."

> "We need to make sure our team doesn't need to do this massive reclassification"

> "How do we ensure that by the time the Philippines looks at it, they get the categories right in the first place?"

> "The same logic for applying that to paying bills also applies to budgets. So just like the bill payers don't know what to code the service to, neither do the care partners know what to put in the budget"

---

## Related Epics

- **TP-3300-REC** (Invoice Recode Tool) - Manual bulk recode functionality; complements AI classification
- **TP-3301-AIC** (AI Invoice Classification) - **SUPERSEDED** by this epic

---

## Spec Clarification - 2025-12-23

- **Questions Asked**: 3
- **Questions Answered**: 3
- **Key Clarifications**:
  - Q: When should AI classification process line items?
    A: On invoice upload (background job) - classification happens off-platform with PHP failsafe service locally
  - Q: What happens if dependencies unavailable during classification?
    A: Skip AI entirely - fall back to manual classification. All dependencies are local to DB.
  - Q: How should AI classification data be stored?
    A: Extend existing `ai_extraction` JSON column on BillItem
- **Sections Updated**: Functional Requirements (FR-008a, FR-008b), Key Entities
- **Outstanding Issues**: None

---

## Open Questions

(None currently - all clarified)

---

## Related Files

- [../IDEA-BRIEF.md](../IDEA-BRIEF.md) - Epic idea brief
- [../spec.md](../spec.md) - Feature specification
- [../plan.md](../plan.md) - Technical implementation plan
- [../design.md](../design.md) - UI/UX design spec
