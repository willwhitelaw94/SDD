---
title: "Consumer Mobile - Overview"
description: "Consumer mobile app architecture and multi-phase delivery strategy"
navigation:
  title: Overview
---

> Building a mobile-first experience for recipients and their care circles

---

## Mobile Release Themes

| Release  | Theme             | Focus                                                    |
|----------|-------------------|----------------------------------------------------------|
| **MOB1** | "See & Sign"      | View financial info, manage care circle, sign agreements |
| **MOB2** | "Plan & Act"      | Book services, edit goals, request changes               |
| **MOB3** | "Discover & Grow" | Marketplace, AI assistance, proactive care               |

---

## Architecture Walkthrough

**Video**: [Beth's Loom Walkthrough](https://www.loom.com/share/8e218a1e98f74ad7b0251b5952f789e0)

Beth walks through the recipient mobile app architecture showing what the client can achieve in each main tab.

---

## App Architecture

The mobile app is organised into **5 main tabs**:

| Tab          | Purpose                                           |
|--------------|---------------------------------------------------|
| **Home**     | Dashboard with status, actions, and quick links   |
| **Services** | Planned services, booking, and suppliers          |
| **Finances** | Budget, bills, transactions, statements           |
| **Profile**  | Personal info, care goals, needs, assessments     |
| **Account**  | Settings, agreements, support, package management |

---

## Tab Breakdown

### 1. Home

**Question answered**: "What is happening across my Home Care Package? How can I quickly see the most up-to-date status, key information, and any actions I can/need to take?"

| Feature                 | Description                          | Phase |
|-------------------------|--------------------------------------|-------|
| Actions (notifications) | Pending approvals, alerts, reminders | MOB1  |
| Quick links             | Fast access to common actions        | MOB1  |
| Graphs: Recent spend    | Spending summary                     | MOB1  |
| Graphs: Quarterly spend | Budget trajectory                    | MOB2  |
| Graphs: Missed care     | Services not delivered               | MOB2  |
| Graphs: Needs resolved  | Care plan progress                   | MOB2  |
| Promotions/Referrals    | Marketing content                    | MOB2+ |

---

### 2. Services

**Question answered**: "What services have been planned, and how can I book them?"

| Feature                          | Description              | Phase |
|----------------------------------|--------------------------|-------|
| Planned services (shopping list) | View service plan        | MOB1  |
| Service history                  | Past services delivered  | MOB1  |
| Supplier info                    | Contact details, ratings | MOB1  |
| Find services                    | Search marketplace       | MOB2  |
| Book services                    | Request/schedule         | MOB2  |
| Calendar                         | Service calendar view    | MOB2  |
| Quotes and approvals             | Quote requests           | MOB2  |

---

### 3. Finances

**Question answered**: "How much money have I got, what has been charged already and what do I owe?"

| Feature                    | Description                | Phase |
|----------------------------|----------------------------|-------|
| Package funds              | Current balance, available | MOB1  |
| Bills/Invoices             | List with transactions     | MOB1  |
| Paid/claimed statuses      | Payment tracking           | MOB1  |
| Monthly statements         | View/download              | MOB1  |
| Co-contributions and rates | Fee information            | MOB1  |
| Request funding            | Funding requests           | MOB2  |

---

### 4. Profile

**Question answered**: "What does Trilogy know about me and my care goals/needs?"

| Feature              | Description           | Phase |
|----------------------|-----------------------|-------|
| Personal information | Demographics          | MOB1  |
| Clinical information | Health summary (view) | MOB1  |
| My care goals        | View goals            | MOB1  |
| My care needs        | View needs            | MOB1  |
| Care Circle          | Family/carer contacts | MOB1  |
| Edit care goals      | Update goals          | MOB2  |
| Assessments/reports  | View assessments      | MOB2  |
| Incidents            | Incident history      | MOB2  |

---

### 5. Account

**Question answered**: "Where can I manage my app settings, access my agreements, get support, and make changes to my package or account?"

| Feature             | Description           | Phase |
|---------------------|-----------------------|-------|
| Agreements and fees | View/sign HCA         | MOB1  |
| Support             | Help/contact options  | MOB1  |
| Login/security      | Password, biometrics  | MOB1  |
| Swap packages       | Switch active package | MOB2  |
| Terminate/delete    | Package cancellation  | MOB2  |

---

## Phase Split Summary

### MOB1 (First Release)

**Theme**: "See my finances, manage my people, sign my agreement"

| Tab          | Features Included                                                           |
|--------------|-----------------------------------------------------------------------------|
| **Home**     | Notifications, quick links, recent spend graph                              |
| **Services** | View planned services, service history, supplier info                       |
| **Finances** | Balance, bills, transactions, statements, contributions                     |
| **Profile**  | Personal info, care goals (view), care needs (view), care circle management |
| **Account**  | HCA signing, support, login/security                                        |

**Estimated Endpoints**: ~39 (see [API Endpoints](./Consumer-Mobile-V1/context/API-ENDPOINTS))

**Implementation Details**: [MOB1 Design Document](./Consumer-Mobile-V1/DESIGN)

---

### MOB2 (Second Release)

**Theme**: "Plan & Act"

Take action on your care—book services, update goals, manage your package.

| Tab          | Features Added                                                |
|--------------|---------------------------------------------------------------|
| **Home**     | Quarterly spend, missed care, needs resolved graphs           |
| **Services** | Find services, book services, calendar, quotes & approvals    |
| **Finances** | Request funding, submit invoices                              |
| **Profile**  | Edit care goals, edit care needs, view assessments, incidents |
| **Account**  | Swap packages, terminate package                              |

**Key Capabilities**:
- Book and schedule services
- Create and edit care goals
- Create and edit care needs
- Request funding increases
- Submit invoices on behalf of suppliers
- Manage multi-package scenarios

---

### MOB3 (Third Release)

**Theme**: "Discover & Grow"

Discover new services, get AI-powered assistance, and take control of your care journey.

| Tab          | Features Added                                   |
|--------------|--------------------------------------------------|
| **Home**     | Promotions, referral program, AI insights        |
| **Services** | Moonmart marketplace, AI service recommendations |
| **Finances** | Spending predictions, budget optimisation tips   |
| **Profile**  | AI care plan suggestions, health integrations    |
| **Account**  | Family sharing, advanced preferences             |

**Key Capabilities**:
- Moonmart consumer marketplace
- AI conversational interface (voice/chat)
- Proactive care recommendations
- Health device integrations
- Referral and rewards program
- Advanced family/care circle sharing

---

## Intercom-First Action Pattern

### The Pattern

Early releases are primarily **read-only** with actions handled via **Intercom shortcuts**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (MOB1)                        │
├─────────────────────────────────────────────────────────────┤
│  READ: View finances, services, profile, care circle        │
│  READ: See notifications, statements, documents             │
├─────────────────────────────────────────────────────────────┤
│  ACTION: Tap "Request Help" → Intercom with pre-filled data │
│  ACTION: Tap "Query Invoice" → Intercom ticket              │
│  ACTION: Tap "Request Change" → Intercom ticket             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Intercom (Ticketing)                     │
├─────────────────────────────────────────────────────────────┤
│  Authenticated user context (who raised it)                 │
│  Pre-filled ticket title via shortcut                       │
│  Existing workflow management out-of-the-box                │
│  Manual operations team processes behind the scenes         │
└─────────────────────────────────────────────────────────────┘
```

### Why This Approach

| Benefit                 | Description                                  |
|-------------------------|----------------------------------------------|
| **No backend workflow** | Intercom handles routing, assignment, SLAs   |
| **Quick to ship**       | Read-only app + Intercom shortcuts           |
| **User context**        | Tickets show who raised them (authenticated) |
| **Streamlined UX**      | One-tap actions with pre-filled data         |
| **Audit trail**         | All requests tracked in Intercom             |

### Shortcut Examples

| Action                 | Pre-filled Title           | Context Passed             |
|------------------------|----------------------------|----------------------------|
| Query Invoice          | "Invoice Query: INV-{id}"  | Invoice ID, amount, date   |
| Request Service Change | "Service Change Request"   | Package ID, service type   |
| Report Issue           | "Issue Report: {category}" | Package ID, category       |
| Request Callback       | "Callback Request"         | Package ID, preferred time |
| Dispute Charge         | "Charge Dispute: INV-{id}" | Invoice ID, line item      |

### Evolution Across Phases

| Phase    | Evolution                                                        |
|----------|------------------------------------------------------------------|
| **MOB1** | Intercom shortcuts for all actions                               |
| **MOB2** | Hybrid: Some actions in-app (goals, needs), complex via Intercom |
| **MOB3** | Full in-app workflows: Invoice reversals, service booking, etc.  |

---

## Technical Stack

| Technology      | Choice                          | Rationale                                     |
|-----------------|---------------------------------|-----------------------------------------------|
| **Framework**   | React Native (Expo)             | Native feel, single codebase, offline support |
| **State**       | React Query + Context           | Server state caching, optimistic updates      |
| **Styling**     | NativeWind (Tailwind for RN)    | Consistent with tc-theme design system        |
| **Auth**        | Laravel Sanctum                 | Token-based, existing backend integration     |
| **Storage**     | Expo SecureStore + AsyncStorage | Credentials secure, preferences local         |
| **Testing**     | Jest + React Native Testing Lib | Unit + integration test coverage              |
| **CI/CD**       | EAS Build + GitHub Actions      | Expo's native build service                   |
| **Push Notify** | Expo Push Notifications         | Cross-platform push messaging                 |

---

## API Versioning

All mobile endpoints use versioned API contracts:

```
/api/v1/recipient/...
```

Versioning allows breaking changes in future releases without disrupting existing mobile app versions.

---

## Related Documents

- [Idea Brief](./Consumer-Mobile-V1/IDEA-BRIEF) — Business context and goals
- [MOB1 Design](./Consumer-Mobile-V1/DESIGN) — Phase 1 implementation details
- [API Endpoints](./Consumer-Mobile-V1/context/API-ENDPOINTS) — Full endpoint specification
- [Mobile Experience Domain](/context/domains/mobile) — Overall mobile strategy

---

## Naming Convention

| Context                | Term                      |
|------------------------|---------------------------|
| **Linear Initiative**  | Consumer Experience       |
| **TC Docs Initiative** | Consumer Mobile           |
| **Phase Names**        | MOB1, MOB2, MOB3          |
| **Internal shorthand** | Mobile One, Mobile Two    |

---

## Status

**Current Phase**: MOB1 (Q2 2026)

**Leads**:
- Discovery: Will Whitelaw
- Design: Beth Poultney
- Development: Vishal Asai
