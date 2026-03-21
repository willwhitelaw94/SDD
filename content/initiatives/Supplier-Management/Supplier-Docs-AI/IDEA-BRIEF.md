---
title: "Idea Brief: Supplier Docs AI (SDOC)"
description: "Supplier Management > Supplier Docs AI"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Created**: 2026-02-03
**Epic Code**: SDOC
**Initiative**: Supplier Management
**BRP Priority**: P2 — Supplier Management

---

## Problem Statement (What)

- Supplier documentation (ABN certificates, insurance policies, police checks, qualifications) requires manual verification
- Documents expire and compliance teams manually track renewal dates
- No automated extraction of key data (expiry dates, coverage amounts, ABN validation)
- Document uploads scattered across multiple supplier records without centralized view
- Compliance gaps discovered reactively rather than proactively

**Current State**: Manual document review, spreadsheet-based expiry tracking, reactive compliance management

---

## Possible Solution (How)

Introduce **AI-powered document processing** for supplier compliance documents:

- **Document Classification** — Automatically identify document type (insurance, ABN, police check, qualification)
- **Data Extraction** — Extract key fields: expiry dates, coverage amounts, ABN numbers, certificate details
- **Validation Engine** — Cross-check extracted data against external sources (ABN Lookup, insurance databases)
- **Expiry Monitoring** — Automated alerts for approaching document expirations
- **Compliance Dashboard** — Centralized view of supplier document status across portfolio

```
// Before (Current)
1. Supplier uploads document to portal
2. Admin manually opens and reviews document
3. Key dates entered into spreadsheet tracker
4. Monthly manual check for expirations
5. Reactive outreach when documents lapse

// After (With SDOC)
1. Supplier uploads document to portal
2. AI classifies document type automatically
3. Key fields extracted and validated
4. Expiry dates feed compliance dashboard
5. Proactive alerts 30/60/90 days before expiry
```

---

## Benefits (Why)

**User/Client Experience**:
- Faster supplier onboarding with automated document processing
- Reduced back-and-forth for document clarifications

**Operational Efficiency**:
- Eliminate manual document review time (estimated 2-3 hours/week)
- Proactive compliance management prevents service disruptions
- Centralized document status reduces audit preparation time

**Business Value**:
- Reduced compliance risk from lapsed documentation
- Foundation for automated supplier re-verification workflows
- Supports scaling supplier network without proportional admin increase

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw (PO), Khoa Duong (Dev) |
| **A** | Nick Lunn |
| **C** | Erin (Supplier Services), Romy (Compliance) |
| **I** | Supplier Management Team |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Existing AI extraction pipeline (from invoices) can be adapted for documents
- Standard document formats for majority of compliance documents
- ABN Lookup API available for validation

**Dependencies**:
- **AIV3** — AI Invoice V3 extraction engine (shared infrastructure)
- **SON** — Supplier Onboarding (document upload flow)

**Risks**:
- Document quality variability (LOW) → Mitigation: Manual fallback with confidence thresholds
- Non-standard document formats (MEDIUM) → Mitigation: Gradual rollout by document type
- ABN API rate limits (LOW) → Mitigation: Caching and batch validation

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Document classification accuracy | 90% |
| Data extraction accuracy | 85% |
| Manual review time reduction | 70% |
| Compliance gaps detected proactively | 95% |

---

## Estimated Effort

**S (Small)** — 2 sprints

- **Sprint 1**: Document classification + ABN extraction (leveraging existing AI pipeline)
- **Sprint 2**: Insurance/police check extraction + expiry dashboard

---

## Proceed to PRD?

**YES** — SDOC extends existing AI capabilities to supplier documents, reducing compliance risk and manual overhead. Natural extension of AI Invoice work.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information**
- [ ] **Declined**

**Approval Date**: ____

---

## Next Steps

**If Approved**:
1. [ ] Create PRD (spec.md)
2. [ ] Create RACI Matrix
3. [ ] Create Jira epic
4. [ ] Break down into user stories
