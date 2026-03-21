---
title: AI Invoice V3
description: AI-assisted invoice line item classification system
navigation:
  order: 80
---

# AI Invoice V3

AI-assisted invoice line item classification system that suggests service categories during bill processing, reducing errors at the source.

## Problem

Invoice line items are being misclassified into incorrect service categories, causing:
- Funding stream errors (wrong SERG selection)
- Client contribution calculation errors
- Monthly reclassification burden on Merit, Romy, and finance team
- On-hold bill bottlenecks

**"Romy and I are the AI"** — humans doing what AI should do.

## Solution

Multi-signal AI classification with human-in-the-loop confirmation:

1. **AI Classification Engine** — Keyword matching, supplier verification, rate disambiguation, budget validation
2. **Visual Breadcrumb Hierarchy** — `[Icon] Tier 1 → Tier 2 → Tier 3` with confidence scores
3. **Scoped Service Selection** — Default to AI-suggested category, explicit step-back to change
4. **Multi-Service Detection** — Flag combined services for splitting
5. **Travel/Transport Logic** — Smart handling of transport line items

## Success Metrics

| Metric | Target |
|--------|--------|
| AI classification accuracy | 80% |
| Classification time reduction | 60% |
| Manual workload reduction | 50% |

## Documents

| Document | Description |
|----------|-------------|
| [IDEA-BRIEF.md](./IDEA-BRIEF.md) | Epic overview, problem statement, stakeholders |
| [spec.md](./spec.md) | Feature specification with 7 user stories |
| [plan.md](./plan.md) | Technical implementation plan |
| [design.md](./design.md) | UI/UX design decisions |

## Status

**In Progress** — Merged from AI Invoice Classification (AIC). Approved for implementation.

## Key Stakeholders

- **Responsible**: Will Whitelaw (PO), Khoa Duong (Tech Lead), Dave Henry (BA)
- **Consulted**: Erin (Supplier Services), Romy (Classification SME), Zoe (QA), Merit (Finance)
- **Informed**: Philippines billing team, Care Partners
