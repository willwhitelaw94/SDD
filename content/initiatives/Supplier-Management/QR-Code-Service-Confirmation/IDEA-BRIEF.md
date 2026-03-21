---
title: "Idea Brief: QR Code Service Confirmation (QRW)"
description: "Supplier Management > QR Code Service Confirmation"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: QRW (TP-1906) | **Created**: 2026-01-14

---

## Problem Statement (What)

Trilogy Care lacks a reliable, auditable method to confirm that scheduled services have actually been delivered to clients.

**Pain Points:**
- Confirmation relies heavily on supplier invoices and manual checks, which are inconsistent and leave gaps in assurance
- Clients may lose trust when services go unverified
- Services may be billed without verified delivery
- Trilogy Care faces compliance risks under Support at Home program and Aged Care Rules
- No clear evidence trail for regulatory audits

**Current State**: Inconsistent confirmation processes, manual verification, compliance gaps, no auditable proof of service delivery.

---

## Possible Solution (How)

Implement a lightweight, QR-based Visit Confirmation module:

- **QR Code System**: Each recipient gets a client-specific QR code (printed on care plan and optionally fridge magnet)
- **Mobile Check-In**: Worker scans QR on arrival and departure to open a mobile page unique to that recipient
- **Service Recording**: Worker enters details (name, supplier ID), selects booking ID, confirms attendance, and submits
- **Validation**: System validates recipient ↔ booking linkage and time window, stores auditable record

```
// Before (Current)
1. Manual confirmation via invoices
2. Inconsistent verification
3. No evidence trail
4. Compliance gaps

// After (With QRW)
1. QR-based visit confirmation
2. Auditable records
3. Clear evidence trail
4. SAH compliance ready
```

**Additional Capabilities:**
- Photo evidence of service delivery
- Geolocation of service provider
- Provider questionnaire (general and service-specific wellbeing)
- Voice case notes (multi-language)
- AI review of notes to extract important information

---

## Benefits (Why)

**User/Client Experience:**
- Low friction for workforce: No login; ~10–20 seconds per check-in
- Clear evidence of care delivery for clients and families

**Operational Efficiency:**
- Operational certainty: Verifiable "I was there" signals tied to bookings
- Reduced disputes & leakage: Fewer timesheet/admin disputes; lower risk of over-claiming
- Faster claiming: Clean data for finance and compliance
- Fewer admin hours: Save coordinator/payroll time weekly

**Business Value:**
- Compliance — meets SAH and Aged Care Rules requirements for verified service records
- Leakage reduction — estimated $28k–$58k annual savings (1–2% reduction in questionable claims)
- Data quality — clear evidence trail (who, where/when, which booking)

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Romy Blacklaw (PO), Steven Boge (BA), Bruce Blyth (Des), Tim Maier (Dev) |
| **A** | Patrick Hawker |
| **C** | Erin Headley |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Workers have smartphones with cameras and intermittent data
- Booking system exposes recipient-scoped bookings and stable IDs
- Care plan generation pipeline can embed QR and short URL
- Worker names can be entered free text (no SSO for MVP)

**Dependencies:**
- Recipient & booking data (API/DB access)
- Short URL/slug service for non-PII QR links
- PDF generation for care plans; vendor/print for magnets
- Basic reporting/eventing for finance/compliance

**Risks:**
- Spoofing (no auth) (HIGH impact, MEDIUM probability) → Scoping, time-window validation, roster cross-check, device/IP rate-limits, optional PIN/GPS, QR rotation
- Wrong booking selection (MEDIUM impact, MEDIUM probability) → Filter by recipient + near-timeframe; highlight "today/now"; allow search; flag out-of-window
- Privacy concerns (MEDIUM impact, LOW probability) → No PII in QR; hash IP; explicit GPS consent; retention policy
- Connectivity gaps (MEDIUM impact, MEDIUM probability) → Fast-loading short form; queued submit/retry; fallback short URL

---

## Success Metrics

- Visit confirmation adoption rate >90% within 3 months
- Questionable claims reduced by 1–2%
- Coordinator/payroll admin time saved by 20%
- Zero compliance findings related to service verification

---

## Estimated Effort

**S (Small) — 2-4 weeks**

- Week 1: Discovery & design
- Week 2: Development (backend endpoints, validations, audit store)
- Week 3: Development (mobile web page, QR generator)
- Week 4: Testing, print collateral preparation, rollout

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Finalize QR code generation and care plan integration approach
2. Define booking system API requirements
3. `/speckit.specify` — Create detailed technical specification
