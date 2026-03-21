---
title: "Idea Brief: Billing & Invoicing"
---

# Idea Brief: Billing & Invoicing

**Epic Code**: SR4
**Created**: 2026-03-19
**Status**: Draft
**Owner**: Will Whitelaw

---

## The Problem

Billing and invoicing is the highest-volume activity in the supplier portal. Today, the bill creation, review, and payment workflow is embedded in the Laravel monolith with session-based access. This creates several compounding problems:

1. **Suppliers cannot submit bills from mobile devices** — the current Inertia/Vue form requires a desktop browser with a Laravel session, which excludes field workers and sole traders who primarily use phones or tablets.
2. **Bill rejections are opaque** — when a bill is rejected (most commonly for "service type not in budget"), the supplier receives a generic notification with no clear guidance on what to fix. This creates back-and-forth support tickets and delays payment.
3. **On-hold bills lack structured resolution** — bills placed on hold have no tracked reason, no write-off workflow, and no visibility for suppliers. They sit indefinitely in a limbo state that requires manual staff intervention to resolve.
4. **Bill processing is entirely manual** — every submitted bill is individually reviewed by a processor. There is no batch processing, no automated validation for straightforward bills, and no fast-track path for trusted suppliers.
5. **Invoice data entry is slow and error-prone** — suppliers manually key in line items from their own invoices. AI invoice reading has been scoped but not yet integrated, meaning duplicate data entry remains the norm.
6. **No API boundary** — because bills are managed through Inertia controllers, there is no clean API for the standalone React frontend or future mobile app to consume.

These issues compound: slow submission leads to delayed payment, unclear rejections lead to resubmission cycles, and manual processing creates a bottleneck that scales linearly with supplier volume.

---

## The Solution

Rebuild billing and invoicing as an API-first feature set within the SR0 foundation, delivering five interconnected sub-features:

1. **Bill Creation & Submission** — A multi-step bill creation flow exposed via the v2 API. Suppliers create bills against recipient assessments, add line items with service type and budget linkage, and submit for review. The API supports both the React frontend and future mobile access. Real-time validation warns suppliers about budget mismatches before submission, reducing rejections at source.

2. **On-Hold Bills** — Structured reason tracking for bills placed on hold (missing documentation, budget query, recipient dispute, etc.). A clear write-off workflow with approval gates replaces the current ad-hoc process. Suppliers can see why their bill is on hold and what action is needed.

3. **Bill Processing Optimisation** — Batch processing for bill reviewers, automated validation rules that auto-approve straightforward bills (matching supplier, service type in budget, rate within tolerance), and bulk actions for common operations. Reduces per-bill processing time for the operations team.

4. **Express Pay** — A fast-track payment path for verified suppliers with a strong submission history. Bills from Express Pay suppliers that pass automated validation skip the manual review queue and proceed directly to approval. Reduces payment turnaround from weeks to days for qualifying suppliers.

5. **AI Invoice Processing** — Integration with AI document reading to auto-extract line items from uploaded invoices (PDF, image). Extracted data pre-populates the bill creation form for supplier review and confirmation, eliminating manual data entry for the majority of submissions.

---

## Why Now

- **SR0 API Foundation is landing** — the v2 API infrastructure and token-based auth make it possible to expose billing as a clean API for the first time
- **SR2 Profile & Org Management** provides the two-tier organisation model that billing must respect (bills scoped to supplier entities, not flat supplier records)
- **SR3 Supplier Pricing** establishes the rate and service type framework that bill validation depends on
- **Billing is the highest-impact supplier feature** — it directly affects cash flow for suppliers. Every day of unnecessary delay erodes trust and supplier retention
- **5 existing Linear projects** ([SBS], [OHB], [OPT], [EXP], [AIV3]) are already in various stages — consolidating them under SR4 creates a coherent delivery roadmap
- **AI Invoice V3 collaboration with SMEs** was scoped in March 2026 — the timing aligns with this epic

---

## RACI

| Role | Person | Responsibility |
|------|--------|----------------|
| Accountable | Will Whitelaw | Epic owner, spec approval |
| Consulted | Khoa Duong | Bill processing workflows, validation rules |
| Consulted | Rudy Chartier | Technical architecture, API design |
| Consulted | Lachlan Dennis | AI invoice processing, integration scope |
| Consulted | Zoe Judd | Operations, on-hold/write-off workflows |
| Responsible | Dev team | Implementation |
| Informed | Supplier-facing team | Changes to submission and payment flows |

---

## Success

- Suppliers can create and submit bills from any device (mobile or desktop) via the API
- Bill rejection rate drops by at least 30% due to pre-submission validation
- On-hold bills have tracked reasons and a clear resolution path visible to suppliers
- Average bill processing time for operations staff decreases by at least 40% through batch processing and automated validation
- Express Pay suppliers receive payment within 5 business days of submission
- AI invoice extraction pre-populates at least 80% of line item fields for uploaded invoices

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | XL (Extra Large) |
| **Days** | 80-110 |
| **Cost Range** | ~$240k-$330k |
| **Confidence** | Low-Medium |

**Key Drivers**: Largest epic in the initiative with 5 sub-features, event-sourced bill domain with complex aggregate roots, AI integration dependency, MYOB accounting integration, budget validation logic, batch processing infrastructure, Express Pay eligibility engine

**Assumptions**: SR0 API foundation complete, SR2 two-tier org model in place, SR3 pricing/rate framework available, existing bill domain event sourcing patterns maintained, AI invoice reading API available from vendor

---

## Dependencies

| Dependency | Why |
|------------|-----|
| SR0 — API Foundation & Two-Tier Auth | v2 API infrastructure, token-based auth, supplier context scoping |
| SR2 — Profile & Org Management | Bills scoped to supplier entities within organisations |
| SR3 — Supplier Pricing | Rate validation, service type matching, budget linkage |

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR4-Billing-Invoicing/spec)
- Related: [SBS — Supplier Bill Submission](https://linear.app/trilogycare) (Design)
- Related: [OHB — On Hold Bills](https://linear.app/trilogycare)
- Related: [OPT — Optimising Bill Processing](https://linear.app/trilogycare)
- Related: [EXP — Express Pay](https://linear.app/trilogycare)
- Related: [AIV3 — AI Invoice V3](https://linear.app/trilogycare)
