---
title: "Idea Brief: Consumer Mobile V1 (MOB1)"
description: "Consumer Mobile > Consumer Mobile V1"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: MOB1 (TP-2488) | **Created**: 2025-12-17

---

## Problem Statement (What)

Recipients currently access their care package information through a web portal that is not optimized for mobile devices.

**Pain Points:**
- ~40% of users accessing on mobile have a suboptimal experience
- No push notifications for important updates (bills, budget changes)
- Mobile-unfriendly actions like signing Home Care Agreements
- Limited self-service capabilities on mobile devices

**Current State**: Web portal not mobile-optimized, no push notifications, poor mobile UX for key actions.

---

## Possible Solution (How)

Build a React Native mobile app for iOS and Android:

**Phase 1 (MOB1)**: Mostly read-only GET requests with high-impact POST actions
- View packages, budgets, bills, statements, goals, contacts, documents
- Update contacts (Care Circle)
- Sign Home Care Agreements (e-signature)
- Push notifications for key events
- Other POST actions routed through Intercom ticketing as interim solution

**Phase 2+**: Full CRUD capabilities
- Submit invoices
- Find services
- Create/edit goals and needs
- Lead registration

```
// Before (Current)
1. Web portal not mobile-optimized
2. No push notifications
3. Poor mobile UX
4. Limited self-service

// After (With MOB1)
1. Native mobile experience
2. Push notifications
3. Mobile-friendly actions
4. Seamless self-service
```

**Technical Approach:**
- **Framework**: React Native (Expo to React Native CLI migration)
- **Auth**: Laravel Sanctum (WorkOS for SSO later)
- **API**: Build `useApi()` typesafe abstraction package for recipient portal API
- **Push**: Firebase Cloud Messaging (FCM)
- **Ownership**: RN team owns both Web and App recipient portal

---

## Benefits (Why)

**User/Client Experience:**
- Native mobile experience for 40% of mobile users
- Push notifications drive action on bills, budgets

**Operational Efficiency:**
- Reduced support load through self-service for common actions (contacts, HCA)
- Code reuse — RN components shared between web and mobile

**Business Value:**
- Engagement — push notifications increase action rates
- Platform — foundation for additional client-facing apps (CareVicinity, estate planning)
- UX — significantly improved mobile experience

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Vishal M Asai (PO), Will Whitelaw (BA), Beth Poultney (Des), Oliver Mainey (Dev) |
| **A** | Will Whitelaw |
| **C** | Will Whitelaw |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Recipients have smartphones with iOS 14+ or Android 10+
- Existing Laravel actions/services can be wrapped in API endpoints
- FCM can be integrated without major infrastructure changes

**Dependencies:**
- Laravel Sanctum API authentication
- Portal API endpoints (many exist, some need building)
- FCM/Firebase setup for push notifications
- App Store / Play Store developer accounts

**Risks:**
- Home Care Agreement not wired to recipients (HIGH impact, HIGH probability) → Agreement model exists but only for Suppliers; needs new relationship, controller, e-sig capture, PDF generation
- Push notification infrastructure missing (MEDIUM impact, MEDIUM probability) → Need device token table, FCM service, push channel class
- Contributions endpoint needs work (MEDIUM impact, MEDIUM probability) → SAH contributions display incomplete

---

## Success Metrics

- Mobile app adoption rate >50% of mobile users within 3 months
- Push notification opt-in rate >70%
- Support ticket reduction for mobile-related issues by 30%
- HCA signing completion rate on mobile >80%

---

## Estimated Effort

**M (Medium) — 4-6 weeks**

- API Development: ~2-3 weeks for 39 endpoints (most wrap existing logic)
- Push Notifications: ~2-3 days
- Home Care Agreement: ~1 week (biggest unknown — new feature)
- RN App Development: Parallel with API work

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Spike on Home Care Agreement implementation
2. Set up FCM infrastructure
3. `/speckit.specify` — Create detailed technical specification

---

## Related Links

- **Confluence Space**: [TCCA - Trilogy Care Consumer Application](https://trilogycare.atlassian.net/wiki/spaces/TCCA)
- **Loom Walkthrough**: [API Planning Video](https://www.loom.com/share/ea37fdddbedc402b9aadd0c887e982bd)
- **Decision Docs**: Framework selection, component library, E2E testing in TCCA space
