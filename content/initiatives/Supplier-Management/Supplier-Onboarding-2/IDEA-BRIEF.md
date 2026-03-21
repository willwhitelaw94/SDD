---
title: "Idea Brief: Supplier Portal 2 (SOP2)"
description: "Supplier Management > Supplier Onboarding 2"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: SOP2 (TP-2294) | **Created**: 2026-01-14

---

## Problem Statement (What)

Suppliers require enhanced self-service capabilities to manage complex pricing scenarios across multiple locations and service types.

**Pain Points:**
- Current manual processes create significant bottlenecks in supplier onboarding and pricing management
- Spreadsheet-based workflows introduce errors and delays
- No support for direct and indirect pricing models
- Complex multi-location, multi-service pricing scenarios are difficult to manage
- Pricing errors impact billing accuracy and create disputes

**Current State**: Manual pricing workflows, spreadsheet-based management, pricing errors, limited supplier self-service.

---

## Possible Solution (How)

Implement Supplier Portal 2 with enhanced capabilities for comprehensive pricing management:

- **Pricing Matrix Management**: Support for direct and indirect pricing by location, service type, and time-of-service
- **Streamlined Data Entry**: Bulk operations for managing complex pricing scenarios
- **Real-Time Validation**: Error handling to prevent pricing errors before submission
- **System Integration**: Seamless integration with bill matching and budget systems
- **Conditional Workflows**: Support for complex multi-location, multi-service pricing scenarios

```
// Before (Current)
1. Manual pricing workflows
2. Spreadsheet-based management
3. Pricing errors in billing
4. Limited self-service

// After (With SOP2)
1. Self-service pricing matrix
2. Bulk operations
3. Real-time validation
4. Integrated with billing systems
```

---

## Benefits (Why)

**User/Client Experience:**
- Suppliers can manage pricing through intuitive self-service portal
- Coordinators leverage accurate supplier pricing data for service procurement

**Operational Efficiency:**
- 50% reduction in supplier pricing management time through bulk operations
- 40-50% reduction in billing errors from incorrect pricing through real-time validation
- Substantial reduction in coordinator overhead for pricing updates

**Business Value:**
- Financial accuracy — consistent pricing application across all locations and services
- Scalability — supports organizational growth in supplier operations
- Efficiency — eliminates manual pricing workflows

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Zoe Judd (PO), Steven Boge (BA), Ed King (Des), Khoa Duong (Dev) |
| **A** | Erin Headley |
| **C** | Will Whitelaw |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Supplier pricing requirements are finalized prior to development
- EFTSure integration is available and stable for production use
- Database pricing logic has been validated and is ready for implementation
- Direct and indirect pricing models are clearly defined and documented

**Dependencies:**
- Multi-rate and multi-location pricing logic must be fully operational
- Miro Auth Flow must be implemented to enable conditional workflow logic
- ABN duplicate issue resolution must be completed

**Risks:**
- Complex pricing logic impacts bill matching accuracy (HIGH impact, MEDIUM probability) → Extensive testing and fallback procedures
- EFT integration delays (MEDIUM impact, LOW probability) → Manual verification fallback
- Duplicate ABN handling edge cases (MEDIUM impact, MEDIUM probability) → Data cleansing and validation rules
- High volume supplier updates during launch (MEDIUM impact, MEDIUM probability) → Scalability testing, phased rollout

---

## Success Metrics

- Supplier pricing management time reduced by 50%
- Billing errors from pricing reduced by 40-50%
- Coordinator pricing update overhead reduced by 60%
- Zero billing disputes from pricing inconsistencies

---

## Estimated Effort

**M (Medium) — 1-2 months**

- Sprint 1-2: Portal UI development, database implementation
- Sprint 3: Validation rule implementation, EFTSure integration
- Sprint 4: Testing of complex pricing scenarios, rollout

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Finalize direct/indirect pricing model definitions
2. Complete ABN duplicate resolution
3. `/speckit.specify` — Create detailed technical specification
