---
title: "Feature Spec: Priority One — Paid Supplier Boost Program"
---

# Feature Spec: Priority One — Paid Supplier Boost Program

**Status:** Draft
**Epic:** SR10
**Created:** 2026-03-19
**Last Updated:** 2026-03-19
**Idea Brief:** [idea-brief.md](/initiatives/supplier-redone/sr10-priority-one/idea-brief)

---

## Summary

Priority One is a paid subscription program that boosts suppliers to the top of care coordinator search results. Suppliers pay a monthly fee ($99–$499) for tiered benefits: boosted listing placement, a verified badge, express payment terms, dedicated support, and marketing tools. The system includes Stripe-based subscription management, a referral program for organic growth, and staff admin tools for managing tiers and overrides.

---

## User Stories

### P1 — Core (Must Have)

**US-001: Supplier can view and subscribe to a Priority One tier**
> As a supplier administrator, I want to see the Priority One plans and subscribe to a tier, so that my organisation gets boosted placement in coordinator searches.

Acceptance Criteria:
- AC 1.1: Supplier dashboard shows a "Priority One" upsell card when on the Standard (free) tier
- AC 1.2: Clicking "Upgrade" navigates to a plan comparison page showing all tiers (Standard, Priority One, Pro, Enterprise)
- AC 1.3: Each tier shows price, features, and a clear CTA button
- AC 1.4: Selecting a paid tier redirects to Stripe Checkout for payment
- AC 1.5: On successful payment, the supplier's tier is updated immediately and the badge appears within 60 seconds
- AC 1.6: The subscription is scoped to the **organisation level** (all supplier entities under the ABN receive the tier benefits)

**US-002: Supplier's listing is boosted in coordinator search results**
> As a Priority One subscriber, I want my services to appear before Standard suppliers in coordinator search results, so that I receive more referrals.

Acceptance Criteria:
- AC 2.1: Coordinator search results are ordered by: tier rank (Enterprise > Pro > Priority One > Standard), then by existing relevance score within the same tier
- AC 2.2: The boost applies to all supplier entities under the subscribing organisation
- AC 2.3: A "Priority One" badge is displayed next to the supplier name in search results
- AC 2.4: Standard suppliers still appear in search results — they are not hidden, only ranked lower
- AC 2.5: The ranking change takes effect within 60 seconds of subscription activation

**US-003: Supplier can manage their subscription (upgrade, downgrade, cancel)**
> As a supplier administrator, I want to manage my Priority One subscription from my portal dashboard, so that I can change plans or cancel without contacting support.

Acceptance Criteria:
- AC 3.1: A "Subscription" page under profile/settings shows the current tier, next billing date, and payment method
- AC 3.2: Supplier can upgrade to a higher tier — prorated billing via Stripe
- AC 3.3: Supplier can downgrade — takes effect at the end of the current billing period
- AC 3.4: Supplier can cancel — retains tier benefits until the end of the current billing period, then reverts to Standard
- AC 3.5: All subscription changes are logged in the audit trail
- AC 3.6: Only Organisation Administrators can manage subscriptions (not supplier-level roles)

**US-004: Priority One badge appears on supplier profile**
> As a care coordinator, I want to see a Priority One badge on supplier profiles, so that I can quickly identify verified premium suppliers.

Acceptance Criteria:
- AC 4.1: Badge displays on the supplier profile page header
- AC 4.2: Badge variant reflects tier: "Priority One" (blue), "Priority One Pro" (purple), "Enterprise" (gold)
- AC 4.3: Badge is visible to coordinators in search results and on the profile detail page
- AC 4.4: Badge is removed within 60 seconds of subscription cancellation/expiry

**US-005: Express payment terms are applied based on tier**
> As a Priority One subscriber, I want my invoices processed on shorter payment cycles, so that I get paid faster.

Acceptance Criteria:
- AC 5.1: Standard tier: 30-day payment terms (unchanged)
- AC 5.2: Priority One tier: 14-day payment terms
- AC 5.3: Pro and Enterprise tiers: 7-day payment terms
- AC 5.4: Payment term change takes effect on invoices submitted after the subscription is activated
- AC 5.5: Downgrade/cancellation reverts payment terms at the end of the billing period

### P2 — Important

**US-006: Supplier can refer another supplier to earn tier credits**
> As a supplier, I want to refer other suppliers to the Trilogy Care network, so that I can earn credits toward my Priority One subscription.

Acceptance Criteria:
- AC 6.1: A "Refer a Supplier" form is accessible from the supplier dashboard
- AC 6.2: Form captures: company name, service type, contact name, email, phone, referral reason
- AC 6.3: Referral is tracked with status: submitted → contacted → onboarded → credited
- AC 6.4: Credit is applied when the referred supplier completes onboarding (reaches VERIFIED status per SR1)
- AC 6.5: Credit tiers: 1-2 referrals = 1 month free listing upgrade, 3-5 = priority placement for 3 months, 6+ = permanent Priority One status
- AC 6.6: Referral credits are applied as Stripe coupon/credit, not manual adjustments

**US-007: Supplier dashboard shows referral activity and tier ROI**
> As a Priority One subscriber, I want to see how many referrals I've received since subscribing, so that I can measure the ROI of my subscription.

Acceptance Criteria:
- AC 7.1: Dashboard card shows "Referrals this month" with comparison to pre-subscription average
- AC 7.2: Shows referral trend (last 6 months chart)
- AC 7.3: Shows active referral credits earned from the referral program (US-006)
- AC 7.4: Shows subscription cost vs. estimated revenue from referrals (if billing data available from SR4)

**US-008: Staff can view and manage supplier subscriptions**
> As a TC staff member, I want to view and override supplier subscription tiers, so that I can handle special cases (comp subscriptions, disputes, trial extensions).

Acceptance Criteria:
- AC 8.1: Staff admin panel shows a list of all Priority One subscribers with tier, status, billing date, and referral count
- AC 8.2: Staff can manually assign a tier to a supplier (override) with a reason note
- AC 8.3: Staff can extend a trial period or apply a credit
- AC 8.4: Manual overrides are logged in the audit trail with the staff user and reason
- AC 8.5: Staff can filter by tier, status (active/cancelled/trial), and search by supplier name

### P3 — Nice to Have

**US-009: Free trial for new subscribers**
> As a new supplier, I want to try Priority One for free before committing, so that I can evaluate the benefits.

Acceptance Criteria:
- AC 9.1: First-time subscribers are offered a 1-month free trial of Priority One tier
- AC 9.2: Trial automatically converts to paid subscription unless cancelled before trial end
- AC 9.3: Stripe trial period configuration — no charge until trial ends
- AC 9.4: Trial is one-time per organisation (cannot re-trial after cancelling)

**US-010: Coordinator feedback on Priority One badge perception**
> As a product manager, I want to measure coordinator trust in the Priority One badge, so that we can refine the program positioning.

Acceptance Criteria:
- AC 10.1: Coordinator search results track click-through rate on Priority One vs Standard suppliers
- AC 10.2: A lightweight survey (1 question) appears after 10 referral assignments asking "Did the Priority One badge influence your selection?"
- AC 10.3: Results are available in a staff analytics dashboard

---

## Functional Requirements

| ID | Requirement | Priority | Story |
|----|-------------|----------|-------|
| FR-001 | Subscription tiers: Standard (free), Priority One ($99/mo), Pro ($249/mo), Enterprise ($499/mo) | P1 | US-001 |
| FR-002 | Subscription scoped to organisation level (all supplier entities under ABN) | P1 | US-001 |
| FR-003 | Stripe Checkout for payment, Stripe Customer Portal for management | P1 | US-001, US-003 |
| FR-004 | Coordinator search ranking includes tier-based boost modifier | P1 | US-002 |
| FR-005 | Tier badge displayed in search results and profile pages | P1 | US-004 |
| FR-006 | Express payment terms configurable per tier | P1 | US-005 |
| FR-007 | Subscription lifecycle: create, upgrade, downgrade, cancel, expire | P1 | US-003 |
| FR-008 | All subscription changes logged in audit trail | P1 | US-003 |
| FR-009 | Referral submission form with tracking status | P2 | US-006 |
| FR-010 | Referral credit calculation and Stripe coupon application | P2 | US-006 |
| FR-011 | ROI dashboard showing referral uplift metrics | P2 | US-007 |
| FR-012 | Staff admin panel for subscription management and overrides | P2 | US-008 |
| FR-013 | Free trial support via Stripe trial periods | P3 | US-009 |
| FR-014 | Coordinator click-through tracking on Priority One results | P3 | US-010 |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-001 | Tier badge and ranking boost must take effect within 60 seconds of subscription activation |
| NFR-002 | Stripe webhook processing must be idempotent and handle retries gracefully |
| NFR-003 | Subscription state must be eventually consistent — if Stripe and local state diverge, Stripe is the source of truth |
| NFR-004 | Payment page must use Stripe Checkout (PCI compliant) — no card data stored locally |
| NFR-005 | Subscription management UI must be accessible (WCAG AA) |
| NFR-006 | Referral form must rate-limit submissions (max 10 per day per organisation) to prevent abuse |

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Subscription conversion rate | 2-5% of active suppliers within 6 months | Stripe subscription count / active supplier count |
| Monthly recurring revenue | $35k-$90k within 6 months | Stripe MRR dashboard |
| Referral uplift for subscribers | 20%+ increase in referrals vs pre-subscription baseline | Referral count comparison (before/after) |
| Coordinator click-through on Priority One suppliers | 15%+ higher CTR than Standard suppliers | Search analytics |
| Subscription churn rate | <10% monthly | Stripe churn metrics |
| Referral program adoption | 10% of subscribers make at least 1 referral | Referral submission count / subscriber count |

---

## Clarifications

**CL-001: Should the subscription be at the organisation level or supplier entity level?**
- **Decision: Organisation level.** An ABN subscribes once, and all supplier entities underneath receive the tier benefits. This simplifies billing (one subscription per ABN) and aligns with the SR2 two-tier model where the organisation is the billing entity. If a supplier entity needs a different tier, this is handled as an Enterprise/custom arrangement.

**CL-002: How should the coordinator search boost work technically?**
- **Decision: Tier-based score modifier.** The existing coordinator search returns a relevance score. Priority One adds a tier-based multiplier: Standard = 1.0x, Priority One = 1.5x, Pro = 2.0x, Enterprise = 2.5x. This preserves relevance-based ordering within tiers while ensuring paid suppliers rank higher. The exact multipliers are configurable by staff.

**CL-003: Should downgrade be immediate or end-of-period?**
- **Decision: End-of-period.** The supplier retains current tier benefits until the end of the billing cycle. This is consistent with standard SaaS patterns and Stripe's subscription update behaviour. Upgrades are immediate with prorated billing.

**CL-004: Should referral credits be automatic or require staff approval?**
- **Decision: Automatic on VERIFIED status.** When a referred supplier reaches VERIFIED status (per SR1 onboarding flow), the referral credit is automatically applied as a Stripe coupon to the referring organisation's next invoice. No staff approval required for standard credits. Staff can override or adjust credits via the admin panel (US-008).
