---
title: "Idea Brief: Supplier Service Verification Features (SVF)"
description: "Supplier Management > Supplier Service Verification Features"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: SVF (TP-2478) | **Created**: 2026-01-14

---

## Problem Statement (What)

Under Support at Home reforms, suppliers must meet compliance requirements not only at the organisation level but also for each individual service type they deliver.

**Pain Points:**
- Portal currently tracks supplier verification only at the provider level, not service level
- Bills are submitted for unverified services, requiring manual holds and follow-up
- Compliance obligations for each service type aren't clearly communicated during onboarding
- Suppliers lack visibility over what they're verified for and what needs renewal
- Compliance officers spend time chasing documents, identifying expired credentials, and manually emailing suppliers

**Current State**: Provider-level verification only, manual compliance holds, no service-level visibility, high compliance officer workload.

---

## Possible Solution (How)

Introduce a unified compliance module in the portal that manages both Supplier-level and Service-level verification:

- **Service-Level Compliance**: Each service has its own compliance checklist derived from central Compliance Matrix; requirements displayed during onboarding
- **Supplier Self-Service**: Verified suppliers can add new services or update existing ones, receive reminders before document expiry, upload updated files
- **Bill-Triggered Workflow**: When a bill is placed on hold for unverified services, system automatically sends Update Service Request email
- **Compliance Oversight**: Officers can review documents, approve/reject submissions, view dashboard of unverified suppliers and services
- **Billing Visibility**: Staff can view supplier and service-level verification indicators on each invoice

```
// Before (Current)
1. Provider-level verification only
2. Manual compliance holds
3. No service-level visibility
4. High officer workload

// After (With SVF)
1. Service-level compliance tracking
2. Automated bill-triggered workflows
3. Supplier self-service portal
4. Compliance dashboard
```

---

## Benefits (Why)

**User/Client Experience:**
- Suppliers have clear visibility into compliance status and proactive reminders
- Self-service reduces supplier frustration with compliance processes

**Operational Efficiency:**
- 50% fewer manual compliance follow-ups
- Automated reminders and bill-triggered workflows reduce officer workload
- Clear audit trail for billing decisions

**Business Value:**
- Compliance Accuracy — 100% of Tier-3 services have defined checklists
- Billing Reliability — prevents payments for unverified services
- Supplier Transparency — 100% supplier access to compliance summary

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Zoe Judd (PO), Steven Boge (BA), Ed King (Des), Khoa Duong (Dev) |
| **A** | Erin Headley |
| **C** | Erin Headley |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Compliance Matrix remains the single source of truth for document requirements
- Automated reminders and emails rely on active notification infrastructure
- Supplier onboarding flow must integrate with compliance display logic

**Dependencies:**
- Compliance Matrix must be complete and maintained
- Notification infrastructure must be available
- Integration with supplier onboarding flow

**Risks:**
- Delays in Compliance Matrix updates may cause misalignment (MEDIUM impact, MEDIUM probability) → Version control and change management processes
- Supplier resistance to additional compliance requirements (MEDIUM impact, LOW probability) → Clear communication of benefits and SAH requirements
- Integration complexity with billing systems (MEDIUM impact, LOW probability) → Early integration testing

---

## Success Metrics

- 100% of Tier-3 services have defined compliance checklists
- 50% reduction in manual compliance follow-ups
- 100% supplier access to compliance summary
- Zero billing delays linked to compliance holds (for properly verified services)

---

## Estimated Effort

**M (Medium) — 2-3 sprints (4-6 weeks)**

- Sprint 1: Service-level compliance setup, Compliance Matrix integration
- Sprint 2: Reminder notifications, billing flag integration
- Sprint 3: Supplier self-service entry, compliance dashboard

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Complete Compliance Matrix for all service types
2. Define notification infrastructure requirements
3. `/speckit.specify` — Create detailed technical specification
