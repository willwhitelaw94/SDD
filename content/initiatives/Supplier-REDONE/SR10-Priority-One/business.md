---
title: "Business Alignment: Priority One — Paid Supplier Boost Program"
---

# Business Alignment: Priority One — Paid Supplier Boost Program

**Status:** Draft
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Business Objectives

| Objective | How SR10 Supports It |
|-----------|----------------------|
| **Generate new revenue from supplier network** | Monthly subscription fees from 15,000-supplier base. Conservative 2% conversion = ~$356k ARR. Optimistic 5% = ~$890k ARR. |
| **Improve coordinator efficiency** | Priority One badge provides trust signal, reducing time-to-match. Tier boost surfaces committed suppliers first. |
| **Increase supplier engagement and retention** | Subscription creates investment → engagement flywheel. ROI dashboard makes value visible. Referral program drives organic growth. |
| **Scale supplier acquisition** | Referral program turns existing suppliers into a distribution channel. Each referral is pre-qualified by an active supplier. |
| **Improve cash flow for suppliers** | Express payment terms (7-14 days vs 30 days) improve supplier cash flow, making the platform more attractive vs competitors. |

---

## Success Metrics

| Metric | Current State | Target (6 months) | Measurement Method |
|--------|---------------|--------------------|--------------------|
| Priority One subscribers | 0 | 300-750 (2-5% of 15,000) | Stripe subscription count |
| Monthly recurring revenue | $0 | $35k-$90k | Stripe MRR dashboard |
| Referral uplift for subscribers | Baseline TBD | +20% vs pre-subscription | Referral count comparison |
| Coordinator CTR on Priority One suppliers | N/A | 15%+ higher than Standard | Search analytics |
| Subscription churn rate | N/A | <10% monthly | Stripe churn metrics |
| Referral program referrals submitted | 0 | 50+ per month | Referral submission count |
| Supplier acquisition via referral | 0 | 10+ verified per month | Referred suppliers reaching VERIFIED status |

---

## Revenue Model

### Tier Pricing

| Tier | Monthly Price | Annual Value | Target Segment |
|------|--------------|--------------|----------------|
| Standard | $0 | $0 | All 15,000 suppliers (baseline) |
| Priority One | $99 | $1,188 | Small/medium suppliers wanting more visibility |
| Priority One Pro | $249 | $2,988 | Growing suppliers wanting maximum referrals + support |
| Enterprise | $499 | $5,988 | Multi-entity organisations with complex needs |

### Revenue Projections (Conservative → Optimistic)

| Scenario | Conversion | Avg. Revenue/Sub | MRR | ARR |
|----------|-----------|------------------|-----|-----|
| Conservative (2%) | 300 subs | $119/mo (weighted avg.) | $35.7k | $428k |
| Moderate (3.5%) | 525 subs | $139/mo | $73k | $876k |
| Optimistic (5%) | 750 subs | $149/mo | $112k | $1.34M |

Weighted average accounts for tier distribution: ~60% Priority One, ~25% Pro, ~15% Enterprise (estimated).

### Cost Structure

| Item | Estimate | Notes |
|------|----------|-------|
| Development cost | $80k-$120k | 8-10 weeks, 2-3 developers |
| Stripe fees | 2.9% + $0.30/transaction | Standard Stripe pricing |
| Account managers (Pro/Enterprise) | $0 initially | Existing support team absorbs; hire at 200+ Pro/Enterprise subs |
| Marketing launch | $5k-$10k | Email campaigns, in-app upsell, case studies |

### Payback Period

- **Conservative**: $428k ARR - ($120k dev + $10k marketing) = $298k net. Payback in ~4 months.
- **Moderate**: $876k ARR - $130k = $746k net. Payback in ~2 months.

---

## Competitive Analysis

| Platform | Paid Tier | Pricing | Key Difference |
|----------|-----------|---------|----------------|
| Mable | No paid boost | N/A | Marketplace model, no care coordinator relationship |
| Hireup | No supplier tier | N/A | Consumer-direct, no B2B supplier network |
| Five Good Friends | No supplier tier | N/A | Smaller network, consumer-focused |
| **Trilogy Care (Priority One)** | **Yes** | **$99-$499/mo** | **Integrated into coordinator workflow, not a standalone marketplace. Value is in the relationship, not the listing.** |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low conversion rate (<1%) | Medium | High | Launch with 3-month free trial for first 100 suppliers. Build case studies. Measure and iterate pricing. |
| Coordinator distrust of "paid placement" | Medium | Medium | Badge says "Priority One Verified", not "Sponsored". Standard suppliers still visible. Measure coordinator sentiment via US-010. |
| High churn (>15% monthly) | Medium | Medium | ROI dashboard (US-007) makes value visible. Monthly billing allows easy re-entry. Win-back campaigns at 30/60/90 days post-cancellation. |
| Referral program gaming (fake referrals) | Low | Low | Credit only on VERIFIED status. Rate limit submissions. Staff review flagged patterns. |
| Stripe integration complexity | Low | Medium | Stripe Checkout + Customer Portal = standard integration. Use Stripe webhooks for state management. |

---

## Stakeholder Impact

| Stakeholder | Impact | Sentiment |
|-------------|--------|-----------|
| **Suppliers (Priority One)** | Boosted placement, faster payments, dedicated support | Positive — clear value proposition |
| **Suppliers (Standard)** | Ranked lower in search results when Priority One suppliers are present | Neutral → Slightly negative — mitigated by Standard suppliers still appearing and referral program offering a path to upgrade |
| **Care Coordinators** | Trust signal in search results, faster identification of quality suppliers | Positive — reduces time-to-match |
| **Finance Team** | New revenue stream, Stripe integration, express payment term management | Positive — needs coordination on payment term configuration |
| **Support Team** | Dedicated support for Pro/Enterprise, subscription queries | Neutral — initially absorbed, may need hiring at scale |

---

## If Not Done

- Platform remains cost-only for supplier management with no revenue offset
- High-performing suppliers have no differentiation path → potential churn to competitor platforms
- Coordinator search quality does not improve → continued manual assessment overhead
- Organic supplier acquisition remains marketing-driven with no referral flywheel

---

## If Done Badly

- Coordinators perceive Priority One as "pay-to-play" → erodes platform trust
- Poorly implemented Stripe integration → billing errors, double charges, subscription state mismatches
- Overpromising referral uplift → churn when ROI doesn't materialise
- Referral program gaming → fake referrals consuming credits without real supplier acquisition
