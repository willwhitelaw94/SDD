---
title: MOB1 - Implementation Plan
description: Consumer Mobile V1 implementation priorities and technical details
---

> Phase 1: See your finances, manage your people, sign your agreement

See [overall mobile architecture](../DESIGN) for the complete design vision across all phases.

---

## MOB1 Build Priorities

Based on existing code and effort required:

### Reimplement what exists

| Feature                                         | Completion notes                     | Estimate |
|-------------------------------------------------|--------------------------------------|----------|
| [Auth](./context/mob1-auth)                     | Almost Done                          | 3 days   |
| [Package details](./context/mob1-packages)      | Missing address/payment info         | 3 days   |
| [Care circle contacts](./context/mob1-contacts) | Mobile/Web/Backend close to complete | 2 days   |
| [Documents](./context/mob1-documents)           | Not started                          | 3 days   |
| [Bills](./context/mob1-bills)                   | Not started                          | Unknown  |
| [Statements](./context/mob1-statements)         | Not started                          | Unknown  |
| [Budgets](./context/mob1-budgets)               | Not Started                          | Unknown  |
| [Suppliers](./context/mob1-suppliers)           | Not started                          | Unknown  |

### New Features

| Feature                                                | Why                                      |
|--------------------------------------------------------|------------------------------------------|
| **[Contributions view](./context/mob1-statements)**    | Needs work on query                      |
| **[Notifications](./context/mob1-notifications)**      | Push infrastructure needed               |
| **Home dashboard graphs**                              | New aggregation queries                  |
| **[Home Care Agreement](./context/mob1-agreements)**   | Model exists but not wired to recipients |
| **[Push notifications](./context/mob1-notifications)** | FCM infrastructure needed                |
| [Transactions](./context/mob1-transactions)     | Not started                          | Unknown  |

---

## Risk: Home Care Agreement

The Agreement model exists but is only used for **Supplier agreements**. For recipients we need:

| Requirement                        | Status      |
|------------------------------------|-------------|
| `Package → Agreement` relationship | Not started |
| `RecipientAgreementController`     | Not started |
| Mobile-friendly e-signature        | Not started |
| Agreement PDF template             | Not started |
| Sign/decline workflow              | Not started |

**This is the biggest build effort for MOB1.**

---

## Related Documents

- [Overall Mobile Architecture](../DESIGN) — App structure and multi-phase strategy
- [API Endpoints](./context/API-ENDPOINTS) — Full endpoint specification
- [Idea Brief](./IDEA-BRIEF) — Business context and goals

---

## Status

**Target**: Q2 2026

**Leads**:

- Discovery: Will Whitelaw
- Design: Beth Poultney
- Development: Vishal Asai
