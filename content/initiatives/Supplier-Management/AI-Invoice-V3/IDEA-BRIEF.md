---
title: "Idea Brief: AI Invoice V3 (AIV3)"
description: "Supplier Management > AI Invoice V3"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: AIV3 (TP-2323) | **Created**: 2026-01-14 | **Updated**: 2026-02-03

---

## Problem Statement (What)

Invoice line items are being misclassified into incorrect service categories, creating a cascade of downstream errors and requiring extensive manual rework by the finance team every month.

**Pain Points:**
- **Funding stream errors** — Wrong SERG selection (Tier 1) leads to incorrect funding source allocation
- **Client contribution calculation errors** — Wrong co-contribution category affects what clients pay
- **Inconsistent manual coding** — Offshore (Philippines) and onshore teams apply categories inconsistently
- **Monthly reclassification burden** — Merit, Romy, and finance team spend significant time manually reclassifying invoices before each claim
- **On-hold bill bottleneck** — Misclassified invoices get stuck in on-hold status, creating payment delays
- **Care partner budget confusion** — Same classification problem affects budget creation ("who knows what diversion or therapy is")

**Current State**:
- Manual classification with no AI assistance
- ~50% supplier verified services coverage
- High error rate requiring monthly batch reclassification
- Philippines team processing 100 bills/day × 50 people with inconsistent category selection
- "Romy and I are the AI" — humans doing what AI should do

**From BRP (Jan 2026)**:
> "AI invoice classification is what Merit has to do every month... with Romy and co."
> "We need to make sure our team doesn't need to do this massive reclassification"
> "How do we ensure that by the time the Philippines looks at it, they get the categories right in the first place?"

---

## Possible Solution (How)

Build an AI-assisted invoice classification system that suggests categories during bill processing, reducing errors at the source rather than fixing them after the fact.

### Core Capabilities

1. **AI Classification Engine** — Multi-signal classification using:
   - Keyword matching against 15 Tier 2 category rubric (exclusive + possible keywords)
   - Supplier verified services lookup (~50% → target 90% coverage)
   - Rate disambiguation (physio $140/hr vs OT $500/hr)
   - Client budget/approved services validation
   - Historical pattern matching (Nov 1 - Dec 13 cleaned data)

2. **Visual Breadcrumb Hierarchy** — `[Icon] Tier 1 → Tier 2 → Tier 3` with:
   - Confidence scoring (green ≥80%, yellow 60-79%, orange <60%)
   - Category-specific icons and colors
   - Expandable reasoning panel showing why AI suggested this category

3. **Scoped Service Selection** — When AI suggests "Physiotherapy":
   - Default picker shows only Physiotherapy items
   - "Step back to Tier 1" shows all Allied Health options
   - "Step back to ALL" shows full catalog
   - Warning when changing contribution category

4. **Multi-Service Detection** — Flags "Personal care and cleaning - 3hrs":
   - Detects multiple service keywords with different contribution categories
   - Recommends split or "Pay as-is, notify supplier"
   - Reduces contribution calculation errors

5. **Promoted Unplanned Services** — When no budget match:
   - Prominent "Create Unplanned Service" button (not nested)
   - AI pre-fills suggested Tier 2 category
   - Prevents forcing items into wrong budgets

6. **Travel/Transport Logic** — Smart handling of transport items:
   - Under $10 flagged as travel component (merge with related service)
   - Distinguish: Direct transport, Indirect (Uber/cab), Accompanied activities
   - Shopping trip with client = Everyday Living, not transport

### Before/After

```
// Before (Current)
1. Philippines team classifies manually
2. Inconsistent category selection
3. Monthly batch reclassification by finance
4. Merit + Romy "are the AI"
5. On-hold bills due to misclassification

// After (With AIV3)
1. AI suggests category with 80%+ accuracy
2. Human confirms or overrides (human-in-the-loop)
3. Classification correct at source
4. Finance team freed for higher-value work
5. Reduced on-hold bills, faster payments
```

---

## Benefits (Why)

**User/Client Experience:**
- Faster invoice processing → faster payments to suppliers
- Reduced billing errors → fewer disputes and corrections
- Correct client contributions → accurate statements

**Operational Efficiency:**
- Reduces monthly reclassification effort (Merit, Romy, finance)
- Cuts Philippines team classification time by 60% (from ~2 min to ~45 sec per item)
- Enables on-hold bills to function properly (requires correct classification)
- Reduces support incidents related to billing errors

**Business Value:**
- **Accuracy** — 80% AI classification accuracy (vs current manual)
- **Efficiency** — 50% reduction in manual classification workload
- **Speed** — 30% faster invoice processing time
- **Quality** — 70% reduction in classification-related errors
- **Foundation** — Enables future automation (auto-submit claims, etc.)

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw (PO), Khoa Duong (Tech Lead), Dave Henry (BA) |
| **A** | Marko Rukovina |
| **C** | Erin (Supplier Services), Romy (Classification SME), Zoe (QA), Merit (Finance) |
| **I** | Philippines billing team, Care Partners |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Sufficient labeled invoice data exists from Nov 1 - Dec 13 cleanup
- 15 Tier 2 categories with exclusive/possible keywords can be defined (Dave & Erin)
- Invoice formats are relatively standardized across top suppliers
- Human-in-the-loop confirmation is acceptable (no auto-apply)

**Dependencies:**
- **Classification rubric** — Dave & Erin to finalize 15 Tier 2 categories with keywords (Week 1)
- **Supplier verified services** — Target 90% coverage (currently ~50%); Erin's casual team calling suppliers
- **Historical cleaned data** — Nov 1 - Dec 13 data available for pattern matching
- **Off-platform AI API** — External classification service with PHP failsafe backup

**Risks:**

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Model accuracy insufficient (<80%) | HIGH | MEDIUM | Hybrid approach with human validation; staged rollout with monitoring |
| Supplier verified services coverage stalls (<90%) | MEDIUM | MEDIUM | Prioritize top 200 suppliers; use rate matching as fallback |
| Philippines team resistance to new workflow | MEDIUM | LOW | Training, change management, demonstrate time savings |
| Multi-service detection false positives | LOW | MEDIUM | Tune keyword triggers; add "dismiss" option |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| AI classification accuracy | 80% | Suggestions accepted without override |
| AI acceptance rate | 70% | Confirmed / total suggestions |
| Classification time | 45 seconds | Page load to confirm (avg) |
| Manual classification workload | -50% | Compared to Dec baseline |
| Invoice processing time | -30% | End-to-end processing |
| Classification-related errors | -70% | QA audit |
| Multi-service detection | 90% | Detected / actual (QA audit) |
| Travel misclassification | -80% | Compared to Nov baseline |
| Supplier verified services | 90% | Verified / total suppliers |

---

## Estimated Effort

**L (Large) — 6 sprints**

| Phase | Sprint | Scope |
|-------|--------|-------|
| **Phase 1: Core** | 1-4 | Backend classification engine, API, frontend components, Bill Edit integration |
| **Phase 2: Refinement** | 5-6 | Top 200 supplier-specific rules, batch reclassification tool, analytics |

### Phase 1 Breakdown (January-February)
- **Sprint 1**: DTOs, classification rubric service, keyword matching, confidence calculator
- **Sprint 2**: Full classification action (supplier, rate, budget matching), multi-service detection
- **Sprint 3**: API endpoints, controllers, frontend breadcrumb + reasoning panel
- **Sprint 4**: Scoped service picker, warnings (multi-service, travel, unplanned), Bill Edit integration

### Phase 2 Breakdown (February-March)
- **Sprint 5**: Top 200 supplier customizations, retrospective batch classification export/import
- **Sprint 6**: Analytics dashboard, confidence calibration, feedback loop implementation

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

**Note**: Merges previous AI Invoice Classification (AIC) epic. Original created 2025-12-23.

---

## Next Steps (If Approved)

1. ✅ Merge AI Invoice Classification into AI Invoice V3 (this document)
2. [ ] Finalize 15 Tier 2 categories with keywords — **Dave & Erin**
3. [ ] Confirm supplier verified services coverage plan — **Erin**
4. [ ] Technical kickoff with Khoa and team
5. [ ] Design review with Bruce/Beth (mockups exist)
6. [ ] Begin Sprint 1 implementation

---

## Related Documents

- [spec.md](./spec.md) — Feature specification (7 user stories, 35 functional requirements)
- [plan.md](./plan.md) — Technical implementation plan
- [design.md](./design.md) — UI/UX design decisions
- [context/CONTEXT.md](./context/CONTEXT.md) — Session log and decisions

---

## Supersedes

This epic supersedes and merges:
- **AI Invoice Classification (AIC)** — TP-3301-AIC (original spec work)
- **AI Invoice V3 placeholder** — TP-2323 (original ticket)
