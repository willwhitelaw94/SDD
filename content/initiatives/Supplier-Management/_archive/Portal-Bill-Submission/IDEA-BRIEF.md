---
title: "Idea Brief: Portal Bill Submission (PBS)"
description: "Supplier Management > Portal Bill Submission"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: PBS (TP-4295) | **Created**: 2026-02-03 | **Updated**: 2026-02-03

---

## Problem Statement (What)

Suppliers currently submit invoices via email, fax, or other manual channels, creating significant data entry burden and processing delays.

**Pain Points:**
- **Manual data entry overhead** — Philippines team (50 people) processes ~100 bills/day, manually entering invoice data from PDFs/emails
- **No validation at source** — Errors discovered late in processing (wrong client, missing info, invalid amounts)
- **Document handling complexity** — Attachments need to be manually linked to bills
- **Processing delays** — Email → manual entry → review creates multi-day lag
- **Supplier frustration** — No visibility into submission status or payment timeline
- **Duplicate submissions** — No easy way for suppliers to know if invoice was received

**Current State**:
- Invoices arrive via email (various formats)
- Philippines team manually creates bills from documents
- AI extraction helps but still requires manual review
- Suppliers call/email to check status
- ~60% of suppliers now contracted in portal but can't submit invoices there

**From BRP (Jan 2026)**:
> "50 people in Philippines processing ~100 bills/day — AI can improve efficiency"
> "60% of suppliers now contracted with rates in portal"

---

## Possible Solution (How)

Build a self-service invoice submission portal within the Supplier Portal, allowing contracted suppliers to submit invoices directly with pre-validation and real-time status tracking.

### Core Capabilities

1. **Invoice Upload & Entry** — Suppliers can:
   - Upload invoice document (PDF, image)
   - AI extracts line items automatically
   - Review/edit extracted data before submission
   - Add multiple line items manually if needed

2. **Pre-Submission Validation** — System checks:
   - Client exists and is active
   - Services match supplier's verified services
   - Rates within acceptable range
   - Required fields complete
   - No duplicate invoice number

3. **Client/Package Matching** — Smart matching:
   - Search by client name, package ID
   - Show only clients supplier has serviced before
   - Display active budget/services for context
   - Warn if client has no approved budget for service

4. **Submission Status Tracking** — Suppliers see:
   - Submitted → Under Review → Approved → Paid
   - Rejection reasons if applicable
   - Expected payment date
   - History of all submissions

5. **Integration with Bill Processing** — Submitted invoices:
   - Flow directly into Bill Edit queue
   - Pre-populated with supplier/client data
   - AI classification applied automatically
   - Reduced manual entry for Philippines team

### Before/After

```
// Before (Current)
1. Supplier emails invoice PDF
2. Philippines team downloads attachment
3. Manual bill creation in portal
4. AI extracts data (still needs review)
5. Supplier calls to check status
6. Multi-day processing lag

// After (With PBS)
1. Supplier logs into portal
2. Uploads invoice, AI extracts data
3. Reviews and submits
4. Bill created instantly in queue
5. Real-time status updates
6. Same-day processing possible
```

---

## Benefits (Why)

**Supplier Experience:**
- Self-service submission (no email/phone)
- Real-time status visibility
- Faster processing and payment
- Reduced errors through validation

**Operational Efficiency:**
- Eliminates manual data entry from documents
- Pre-validated submissions = fewer errors
- Reduced email handling overhead
- Philippines team focuses on review, not entry

**Business Value:**
- **Processing time** — 50% reduction in invoice-to-payment time
- **Manual entry** — 70% reduction in data entry effort
- **Error rate** — 60% reduction in submission-related errors
- **Supplier satisfaction** — Improved NPS for invoice handling
- **Scalability** — Handle volume growth without adding staff

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | TBD (PO), Khoa Duong (Tech Lead) |
| **A** | Marko Rukovina |
| **C** | Erin (Supplier Services), Merit (Finance), Philippines billing team |
| **I** | Suppliers, Care Partners |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Suppliers will adopt self-service submission (vs. email habit)
- Existing Supplier Portal authentication is sufficient
- AI extraction accuracy is acceptable for pre-population
- Supplier verified services data is accurate for validation

**Dependencies:**
- **Supplier Portal V2 (SPO)** — Supplier authentication and dashboard
- **Supplier Verified Services (SVF)** — Service validation lookup
- **AI Invoice Extraction** — Existing AI for document parsing
- **Client/Package API** — Lookup for client matching

**Risks:**

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low supplier adoption | HIGH | MEDIUM | Incentivize (faster payment), training, gradual rollout |
| AI extraction errors | MEDIUM | MEDIUM | Allow manual entry, require supplier review before submit |
| Integration complexity with Bill Edit | MEDIUM | LOW | Design as "pre-created bill" that enters same queue |
| Duplicate submission detection | LOW | MEDIUM | Invoice number + date + amount uniqueness check |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Supplier adoption | 50% of contracted suppliers | Submissions via portal / total invoices |
| Invoice-to-payment time | -50% | Average days from submission to payment |
| Manual data entry | -70% | Bills requiring manual entry |
| Submission errors | -60% | Rejections due to missing/invalid data |
| Supplier satisfaction | +15 NPS | Survey for invoice handling |
| Processing throughput | +30% | Bills processed per day per person |

---

## Estimated Effort

**M (Medium) — 3-4 sprints**

| Phase | Sprint | Scope |
|-------|--------|-------|
| **Phase 1: Core** | 1-2 | Upload UI, AI extraction, basic submission flow, Bill Edit integration |
| **Phase 2: Polish** | 3-4 | Status tracking, validation rules, notifications, supplier dashboard |

### Phase 1 Breakdown
- **Sprint 1**: Supplier Portal invoice upload page, AI extraction integration, line item editor
- **Sprint 2**: Client/package matching, validation rules, submit action, Bill Edit queue integration

### Phase 2 Breakdown
- **Sprint 3**: Status tracking UI, supplier submission history, rejection handling
- **Sprint 4**: Notifications (email/portal), analytics dashboard, duplicate detection

---

## Decision

- [ ] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. [ ] Assign Product Owner
2. [ ] Stakeholder review with Supplier Services (Erin)
3. [ ] Technical feasibility with Khoa (AI extraction reuse)
4. [ ] Design mockups for submission flow
5. [ ] Create feature specification

---

## Related Documents

- [index.md](./index.md) — Epic overview
- [context/CONTEXT.md](./context/CONTEXT.md) — Session log and decisions

---

## Related Epics

- **SPO - Supplier Portal 2** (TP-2294) — Supplier authentication and dashboard
- **SVF - Supplier Verify** (TP-2478) — Verified services for validation
- **IV2 - Invoices V2** (TP-1864) — Invoice processing improvements
- **AIV3 - AI Invoice V3** (TP-2323) — AI classification (applied after submission)
