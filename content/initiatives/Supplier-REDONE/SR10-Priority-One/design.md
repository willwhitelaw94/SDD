---
title: "Design: Priority One — Paid Supplier Boost Program"
---

**Status:** Draft
**Designer:** Bruce (AI)
**Feature Spec:** [SR10 spec.md](/initiatives/supplier-redone/sr10-priority-one/spec)
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Overview

Priority One is a self-service subscription program integrated into the supplier portal. The core design challenge is guiding suppliers from awareness (upsell card on dashboard) through conversion (plan comparison → Stripe Checkout) to retention (ROI visibility, referral program). The design must feel premium without alienating Standard-tier suppliers, and the coordinator-facing badge must convey trust, not advertising.

---

## Design Resources

_Frontend prototypes exist in the supplier-portal repository:_
- `/priority-one` — Marketing landing page with hero, features, pricing, CTA
- `/priority-one/refer` — Referral submission form with reward tiers
- `src/components/priority-one/` — Hero, Features, Pricing, CTA, Refer components
- `src/components/shadcn-studio/blocks/pricing-component-20/` — Detailed pricing comparison block with feature table

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary Users** | Supplier Administrator (subscribe), Care Coordinator (see badge) | Two distinct surfaces |
| **Device Priority** | Desktop-primary, mobile-functional | Financial decisions typically made on desktop |
| **Usage Pattern** | One-time conversion → periodic dashboard check | Subscribe once, check ROI monthly |
| **Information Density** | Marketing clarity (conversion), then data-rich (dashboard) | Different density at different stages of the journey |

---

## Layout & Structure

### Information Architecture

```
Supplier View:
  Dashboard
    └── Priority One Upsell Card (Standard tier)
    └── Subscription Status Card (Paid tier)
          ├── Current tier + badge
          ├── Next billing date
          └── [Manage Subscription]

  /priority-one (Marketing Page)
    ├── Hero (value proposition)
    ├── Features (6 benefits)
    ├── Pricing (tier comparison table)
    └── CTA (conversion)

  /priority-one/refer (Referral Form)
    ├── Reward tiers (Bronze/Silver/Gold)
    └── Referral submission form

  Profile > Subscription (Management)
    ├── Current plan details
    ├── Upgrade/Downgrade options
    ├── Payment method (→ Stripe Portal)
    ├── Billing history
    └── Referral credits

Coordinator View:
  Search Results
    └── [Priority One Badge] next to supplier name
  Supplier Profile
    └── [Priority One Badge] in profile header
```

---

## Wireframes

### 1. Dashboard Upsell Card (Standard Tier Supplier)

```
┌─────────────────────────────────────────────────┐
│  ⭐ Become a Priority One Supplier               │
│                                                   │
│  Get boosted to the front of the supply list.    │
│  More referrals. Faster payments. From $99/mo.   │
│                                                   │
│  [Learn More]  [Upgrade Now]                      │
└─────────────────────────────────────────────────┘
```

**Notes:**
- Appears on the supplier dashboard below the main stats cards
- Dismissible (with 30-day re-show)
- "Learn More" → `/priority-one` marketing page
- "Upgrade Now" → `/priority-one#pricing` pricing section

### 2. Dashboard Subscription Card (Paid Tier Supplier)

```
┌─────────────────────────────────────────────────┐
│  Priority One Pro                   [Pro Badge]  │
│                                                   │
│  Referrals this month: 14  (+23% vs avg)         │
│  Next billing: 19 Apr 2026 — $249.00             │
│  Referral credits: 1 month free earned           │
│                                                   │
│  [View ROI Dashboard]  [Manage Subscription]     │
└─────────────────────────────────────────────────┘
```

**Notes:**
- Replaces the upsell card once subscribed
- "+23% vs avg" compares current month referrals to 6-month pre-subscription average
- "Manage Subscription" → Profile > Subscription page

### 3. Coordinator Search Results (Badge Display)

```
┌─────────────────────────────────────────────────────────────┐
│  Search: Allied Health, Gold Coast                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Acme Allied Health  [Priority One ✓]     ★ 4.8         │
│     Gold Coast, Tweed  |  Allied Health, Physio             │
│     12 active clients  |  Verified Dec 2025                  │
│                                                              │
│  2. Beta Care Services  [Priority One ✓]     ★ 4.5         │
│     Gold Coast         |  Allied Health                      │
│     8 active clients   |  Verified Jan 2026                  │
│                                                              │
│  3. Gamma Health                              ★ 4.7         │
│     Gold Coast, Tweed  |  Allied Health, OT                 │
│     15 active clients  |  Verified Nov 2025                  │
│                                                              │
│  4. Delta Wellness                            ★ 4.2         │
│     Gold Coast         |  Allied Health                      │
│     5 active clients   |  Verified Feb 2026                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Notes:**
- Priority One suppliers ranked first (AC 2.1)
- Badge is inline with the supplier name — small, understated, blue
- Standard suppliers still visible below — no exclusion (AC 2.4)
- Badge variant by tier: blue (P1), purple (Pro), gold (Enterprise)

### 4. Subscription Management Page

```
┌─────────────────────────────────────────────────────────────┐
│  Subscription                                                │
│                                                              │
│  ┌─ Current Plan ──────────────────────────────────────┐    │
│  │                                                      │    │
│  │  Priority One Pro           [Pro Badge]              │    │
│  │  $249.00 / month                                     │    │
│  │  Next billing: 19 Apr 2026                           │    │
│  │  Payment: Visa •••• 4242                             │    │
│  │                                                      │    │
│  │  [Change Plan]  [Update Payment]  [Cancel]           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Referral Credits ──────────────────────────────────┐    │
│  │                                                      │    │
│  │  3 successful referrals → Silver tier reward         │    │
│  │  Credit: Priority placement for 3 months (active)    │    │
│  │  Next credit at 6 referrals → Gold (permanent P1)    │    │
│  │                                                      │    │
│  │  [Refer a Supplier]                                  │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─ Billing History ───────────────────────────────────┐    │
│  │                                                      │    │
│  │  19 Mar 2026  Priority One Pro  $249.00  [Receipt]   │    │
│  │  19 Feb 2026  Priority One Pro  $249.00  [Receipt]   │    │
│  │  19 Jan 2026  Priority One      $ 99.00  [Receipt]   │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Notes:**
- "Change Plan" opens a plan comparison dialog (upgrade/downgrade)
- "Update Payment" → Stripe Customer Portal (opens in new tab)
- "Cancel" → confirmation dialog with end-of-period messaging
- Billing history pulls from Stripe invoices
- Referral credits section shows progress toward next reward tier

---

## Component Inventory

### Existing Components (shadcn/ui + supplier-portal)

| Component | Usage |
|-----------|-------|
| Card | Upsell card, subscription card, referral credit card |
| Badge | Tier badge (blue/purple/gold), reward tier labels |
| Button | Upgrade, manage, cancel, refer CTAs |
| Separator | Section dividers |
| Table | Billing history, plan comparison |
| Dialog | Plan change confirmation, cancellation confirmation |
| Input, Label, Textarea | Referral form fields |
| MotionPreset | Marketing page animations |

### New Components Needed

- **TierBadge** — Tier-specific badge: blue (P1), purple (Pro), gold (Enterprise). Used in search results, profile, dashboard card, subscription page. Common component.
- **UpsellCard** — Dashboard upsell card for Standard tier suppliers. Dismissible with 30-day re-show. Bespoke (single use case).
- **SubscriptionCard** — Dashboard subscription status card for paid tier suppliers. Shows referral count, next billing, tier credit. Bespoke.
- **PlanComparisonDialog** — Dialog showing tier comparison for upgrade/downgrade. Bespoke.

---

## States

### Loading States

| Context | Treatment |
|---------|-----------|
| Subscription status | Skeleton card on dashboard |
| Plan comparison | Skeleton table |
| Stripe Checkout redirect | Button spinner + "Redirecting to payment..." |
| Billing history | Skeleton rows |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No billing history | "Your billing history will appear here after your first payment." | None |
| No referral credits | "Refer a supplier to start earning Priority One credits." | [Refer a Supplier] |
| No referral activity (ROI dashboard) | "Your referral metrics will appear here after your first month as a subscriber." | None |

---

## Responsive Behavior

### Desktop (1024px+)
- Full marketing page with side-by-side pricing cards
- Dashboard cards at full width
- Subscription management with all sections visible

### Tablet (768-1023px)
- Pricing cards stack to 2x2 grid
- Dashboard cards full width
- Subscription management stacks vertically

### Mobile (320-767px)
- Pricing cards stack to single column
- Upsell card simplified (shorter copy)
- Subscription management single column

---

## Visual Design

### Badge Design

| Tier | Background | Text | Border |
|------|-----------|------|--------|
| Priority One | `bg-blue-50` | `text-blue-700` | `border-blue-200` |
| Priority One Pro | `bg-violet-50` | `text-violet-700` | `border-violet-200` |
| Enterprise | `bg-amber-50` | `text-amber-700` | `border-amber-200` |

### Marketing Page

Uses existing Priority One design language:
- Gradient text: `bg-gradient-to-r from-primary via-violet-500 to-accent bg-clip-text text-transparent`
- MotionPreset fade/blur animations
- Card-based feature grid
- ShimmerButton for primary CTA

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| WCAG Level | AA |
| Badge | `aria-label="Priority One Verified supplier"` for screen readers |
| Upsell card dismiss | Keyboard accessible close button with `aria-label` |
| Plan comparison | Table with proper `th` scope for screen readers |
| Stripe Checkout | Stripe handles accessibility in their hosted page |

---

## Open Questions

- [ ] Should the upsell card appear on every dashboard visit, or only after a specific trigger (e.g., first referral received)?
- [ ] Should coordinator search results show the exact tier (P1/Pro/Enterprise) or just "Priority One" for all paid tiers?
- [ ] What is the referral uplift baseline measurement period? 3 months pre-subscription or 6 months?

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | [ ] Approved |
| Developer | | | [ ] Approved |
| Stakeholder | | | [ ] Approved |
