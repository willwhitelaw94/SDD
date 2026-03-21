---
title: "Idea Brief: Priority One — Paid Supplier Boost Program"
---

# Idea Brief: Priority One — Paid Supplier Boost Program

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Problem Statement (What)

- **15,000 service providers compete equally for referrals** — care coordinators see suppliers in a flat list with no quality signal, making it hard to identify reliable providers quickly
- **High-performing suppliers have no way to differentiate themselves** — they sit alongside inactive or low-quality suppliers, reducing their referral volume despite strong track records
- **No monetisation layer on the supplier network** — the platform generates costs (onboarding, compliance, support) from all 15,000 suppliers but has no mechanism for premium suppliers to invest in their own growth while funding platform improvements
- **Care coordinators waste time evaluating unverified suppliers** — without a trust signal, coordinators must manually assess each provider, slowing down care package assembly
- **Supplier retention is passive** — there is no engagement flywheel. Suppliers register, complete onboarding, and then wait for referrals with no proactive growth tools

**Current State**: Suppliers register via SR1, manage profiles via SR2, submit pricing via SR3, and handle billing via SR4. All suppliers receive equal placement in coordinator search results. There is no paid tier, no boosted listing, and no structured referral program. The Priority One concept exists as landing page content in the supplier portal frontend (`/priority-one`) but has no backend implementation.

---

## Possible Solution (How)

A paid subscription program ("Priority One") that boosts paying suppliers to the front of the coordinator supply list, adds a verified badge, and provides premium benefits.

- **Subscription tiers**: Standard (free, current), Priority One ($99/mo), Priority One Pro ($249/mo), Enterprise ($499/mo)
- **Listing boost**: Priority One subscribers appear at the top of coordinator search results, ordered by tier then by existing relevance ranking within tier
- **Verified badge**: A visible "Priority One" badge on supplier profiles and in search results, providing a trust signal to coordinators
- **Express payments**: Shorter payment cycles (14 days for P1, 7 days for Pro/Enterprise vs. 30 days standard)
- **Dedicated support**: Pro and Enterprise tiers receive a named account manager
- **Referral program**: Existing suppliers can refer new suppliers; successful referrals earn tier credits (e.g., 3 referrals = 1 month free upgrade)
- **Self-service subscription management**: Suppliers can upgrade, downgrade, and manage billing from their portal dashboard

```
// Before (Current Process)
1. Supplier completes onboarding
2. Appears in coordinator search with equal ranking to all others
3. Waits passively for referrals
4. No visibility into competitive position
5. No investment channel to grow referral volume

// After (Priority One)
1. Supplier completes onboarding
2. Sees Priority One upsell on dashboard with clear ROI
3. Subscribes to Priority One tier via self-service
4. Immediately boosted in coordinator search results
5. Badge appears on profile → coordinators trust and select faster
6. Express payments + dedicated support improve operations
7. Refers other suppliers → earns tier credits
```

---

## Benefits (Why)

**Supplier Experience**:
- Clear path to grow their business — pay for visibility, get measurable results (referral count before/after)
- Express payments improve cash flow — significant for small aged care businesses
- Dedicated support reduces friction for Pro/Enterprise suppliers
- Referral program creates community-driven growth

**Operational Efficiency**:
- Higher-quality supplier pool surfaces naturally — suppliers willing to pay are typically more committed and reliable
- Named account managers for Pro/Enterprise reduce general support load (proactive vs reactive)
- Referral program scales supplier acquisition without additional marketing spend

**Business Value**:
- New revenue stream: at 5% conversion (750 of 15,000 suppliers), $99/mo average = ~$890k ARR
- At 2% conversion (conservative), ~$356k ARR — significant against platform operating costs
- Reduces coordinator time-to-match by surfacing verified, committed suppliers first
- Referral program lowers customer acquisition cost for new supplier onboarding

**ROI**: Development cost estimated $80k-$120k. At conservative 2% conversion, payback within 4-6 months. Revenue scales linearly with supplier base growth.

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Will Whitelaw |
| **A** | Khoa Duong |
| **C** | Sophie Pickett, Rudy Chartier |
| **I** | Zoe Judd |

---

## Assumptions & Dependencies, Risks

**Assumptions**:
- Suppliers will pay for boosted placement if they can see measurable referral uplift (hypothesis: 2-5% conversion within 6 months of launch)
- Care coordinators will trust the Priority One badge as a quality signal, not an advertising artefact
- Stripe is the payment provider (consistent with existing Trilogy Care billing infrastructure)
- The coordinator search/matching system can be extended with a tier-based ranking modifier without major rearchitecture
- Monthly subscription (not annual-only) is the right billing model for supplier cash flow patterns

**Dependencies**:
- **SR0 (API Foundation)**: Token-based auth and two-tier role model must be in place
- **SR1 (Registration & Onboarding)**: Supplier registration flow must be complete — upsell happens post-onboarding
- **SR2 (Profile & Org Management)**: Supplier profile and dashboard must exist as the surface for subscription management and badge display
- **Coordinator search system**: The existing coordinator-facing supplier search must be modifiable to accept a tier-based ranking boost (owned by tc-portal, not supplier-portal)
- **Stripe integration**: Payment processing, subscription management, webhook handling
- **SR4 (Billing & Invoicing)**: Express payment terms must be configurable per supplier entity based on tier

**Risks**:
- Coordinators may perceive boosted suppliers as "paying to play" rather than genuinely better (MEDIUM) → Mitigation: Badge says "Priority One Verified", not "Sponsored". Boost is a ranking modifier, not exclusive placement. Standard suppliers still appear.
- Low conversion rate makes the feature unprofitable (MEDIUM) → Mitigation: Launch with a 3-month free trial for the first 100 suppliers to build social proof and case studies. Measure referral uplift before scaling.
- Subscription churn if referral uplift is not perceived (MEDIUM) → Mitigation: Dashboard shows "referrals this month" vs. historical average, making ROI visible. Monthly billing allows easy exit.
- Competitive response from platforms like Mable (LOW) → Mitigation: Priority One is integrated into the care coordination workflow, not a standalone marketplace. The value is in the coordinator relationship, not the listing.

---

## Estimated Effort

**4-5 sprints / 8-10 weeks**, approximately

- **Sprint 1**: Data model + Stripe integration + subscription management API
- **Sprint 2**: Supplier dashboard subscription UI (upgrade/downgrade/cancel) + payment screens
- **Sprint 3**: Coordinator search ranking boost + badge display + express payment term configuration
- **Sprint 4**: Referral program (refer form, tracking, tier credit calculation)
- **Sprint 5**: Analytics dashboard (referral uplift, conversion metrics) + staff admin tools

---

## Proceed to PRD?

**YES** — New revenue stream with clear ROI model. Frontend prototype already exists (`/priority-one` in supplier-portal). Supplier base of 15,000 provides sufficient scale for a subscription model. Coordinator feedback indicates demand for quality signals in supplier search.

---

## Decision

- [ ] **Approved** - Proceed to PRD
- [ ] **Needs More Information** - [What's needed?]
- [ ] **Declined** - [Reason]

**Approval Date**: --

---

## Next Steps

**If Approved**:
1. [ ] Run `/trilogy-idea-handover` -- Gate 0 (create epic in Linear)
2. [ ] Run `/speckit-specify` -- Create detailed PRD
3. [ ] Run `/trilogy-clarify business` -- Refine business outcomes and success metrics
4. [ ] Run `/trilogy-research` -- Gather context from Teams, Fireflies, and codebase
5. [ ] Validate coordinator perception of "Priority One" badge via user research
6. [ ] Confirm Stripe integration approach with finance team

---

**Notes**: Frontend prototype for Priority One marketing pages already exists in the supplier-portal repository (`src/components/priority-one/`, `/priority-one` route). This covers the landing page, features, pricing display, and CTA sections. The backend subscription management, payment processing, and search ranking boost are entirely new work. The referral form UI (`/priority-one/refer`) also exists as a prototype.
