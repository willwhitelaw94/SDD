---
title: "Implementation Plan: Priority One — Paid Supplier Boost Program"
---

# Implementation Plan: Priority One — Paid Supplier Boost Program

**Branch**: `sr10-priority-one` | **Date**: 2026-03-19 | **Spec**: [spec.md](/initiatives/supplier-redone/sr10-priority-one/spec)
**Design**: [design.md](/initiatives/supplier-redone/sr10-priority-one/design)
**Dependencies**: SR0 (API Foundation & Two-Tier Auth), SR1 (Registration & Onboarding), SR2 (Profile & Org Management), SR4 (Billing & Invoicing)

## Summary

Build a paid subscription program ("Priority One") that boosts suppliers in coordinator search results. Stripe handles billing; the backend manages subscription state, tier-based search ranking, express payment terms, and a referral program. The frontend provides self-service subscription management integrated into the supplier dashboard. Subscription is scoped to the organisation level (ABN). The coordinator-facing surface is a badge in search results and profiles.

**Architecture**: Laravel 12 PHP 8.4 API backend + React Next.js frontend (standalone, via SR0 API). Stripe for payment processing. MySQL database.

## Technical Context

**Language/Version**: PHP 8.4 (Laravel 12 backend), TypeScript (React Next.js frontend)
**Primary Dependencies**: Laravel 12, Sanctum (auth), Laravel Data (validation), Lorisleiva Actions, Stripe PHP SDK, Cashier (Laravel), Next.js, shadcn/ui
**Storage**: MySQL (new `organisation_subscriptions`, `referrals`, `referral_credits` tables)
**Testing**: Pest 3 (backend), Vitest + React Testing Library (frontend)
**External Services**: Stripe (Checkout, Customer Portal, Webhooks, Coupons)
**Performance Goals**: Badge display < 100ms, subscription activation < 60s, webhook processing < 5s
**Constraints**: No card data stored locally (PCI). Stripe is source of truth for subscription state. Organisation-level scoping (not supplier entity level).

## Constitution Check

*GATE: Gate 3 Architecture — see [03-architecture.md](/ways-of-working/gates/03-architecture)*

### 1. Technical Feasibility

| Check | Status | Notes |
|-------|--------|-------|
| Architecture approach clear | PASS | Stripe Checkout + webhooks → local subscription state → search ranking modifier |
| Existing patterns leveraged | PASS | Laravel Cashier for Stripe, AsAction pattern, existing Organisation model |
| No impossible requirements | PASS | All FRs buildable with current stack + Stripe |
| Performance considered | PASS | Badge served from cached subscription state, not real-time Stripe query |
| Security considered | PASS | No card data stored; Stripe Checkout is PCI compliant; webhook signature validation |

### 2. Data & Integration

| Check | Status | Notes |
|-------|--------|-------|
| Data model understood | PASS | Organisation-level subscription, referral tracking, credit ledger |
| API contracts clear | PASS | RESTful v2 endpoints defined below |
| Dependencies identified | PASS | SR0 (auth), SR1 (onboarding status for referral credit), SR2 (profile, dashboard), SR4 (payment terms) |
| Integration points mapped | PASS | Stripe Checkout, Customer Portal, Webhooks; coordinator search ranking |
| DTO persistence explicit | PASS | Laravel Data classes for all request/response payloads |

### 3. Implementation Approach

| Check | Status | Notes |
|-------|--------|-------|
| File changes identified | PASS | See Project Structure below |
| Risk areas noted | PASS | Stripe webhook reliability, subscription state consistency, coordinator perception |
| Testing approach defined | PASS | Pest feature tests + Stripe mock; Vitest for frontend |
| Rollback possible | PASS | Feature flag gated; Stripe subscriptions can be cancelled in bulk; ranking modifier is additive |

---

## Data Model

### New Table: `organisation_subscriptions`

```sql
CREATE TABLE organisation_subscriptions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  organisation_id BIGINT UNSIGNED NOT NULL
    COMMENT 'Organisation (ABN) that holds the subscription',
  tier VARCHAR(30) NOT NULL DEFAULT 'standard'
    COMMENT 'standard, priority_one, pro, enterprise',
  stripe_customer_id VARCHAR(255) NULL
    COMMENT 'Stripe Customer ID',
  stripe_subscription_id VARCHAR(255) NULL
    COMMENT 'Stripe Subscription ID',
  stripe_price_id VARCHAR(255) NULL
    COMMENT 'Stripe Price ID for current tier',
  status VARCHAR(30) NOT NULL DEFAULT 'active'
    COMMENT 'active, past_due, cancelled, trialing',
  trial_ends_at TIMESTAMP NULL
    COMMENT 'Trial end date (null if not trialing)',
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL
    COMMENT 'When cancellation was requested (retains benefits until period end)',
  override_by BIGINT UNSIGNED NULL
    COMMENT 'Staff user who manually overrode the tier (null for self-service)',
  override_reason TEXT NULL
    COMMENT 'Staff reason for manual tier override',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY org_subscription_unique (organisation_id),
  CONSTRAINT org_sub_org_foreign FOREIGN KEY (organisation_id)
    REFERENCES organisations(id),
  INDEX org_sub_tier_index (tier),
  INDEX org_sub_status_index (status)
);
```

### New Table: `referrals`

```sql
CREATE TABLE referrals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  referring_organisation_id BIGINT UNSIGNED NOT NULL
    COMMENT 'Organisation that made the referral',
  referred_by_user_id BIGINT UNSIGNED NOT NULL
    COMMENT 'User who submitted the referral form',
  company_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NULL,
  reason TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'submitted'
    COMMENT 'submitted, contacted, onboarded, credited, invalid',
  referred_organisation_id BIGINT UNSIGNED NULL
    COMMENT 'Linked organisation once the referral completes onboarding',
  credited_at TIMESTAMP NULL
    COMMENT 'When the referral credit was applied',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT referrals_org_foreign FOREIGN KEY (referring_organisation_id)
    REFERENCES organisations(id),
  CONSTRAINT referrals_referred_org_foreign FOREIGN KEY (referred_organisation_id)
    REFERENCES organisations(id),
  INDEX referrals_org_index (referring_organisation_id),
  INDEX referrals_status_index (status)
);
```

### New Table: `referral_credits`

```sql
CREATE TABLE referral_credits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  organisation_id BIGINT UNSIGNED NOT NULL,
  referral_id BIGINT UNSIGNED NOT NULL
    COMMENT 'The referral that triggered this credit',
  credit_type VARCHAR(50) NOT NULL
    COMMENT 'free_month, priority_placement_3mo, permanent_priority_one',
  stripe_coupon_id VARCHAR(255) NULL
    COMMENT 'Stripe Coupon ID if applied as billing credit',
  applied_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT ref_credits_org_foreign FOREIGN KEY (organisation_id)
    REFERENCES organisations(id),
  CONSTRAINT ref_credits_referral_foreign FOREIGN KEY (referral_id)
    REFERENCES referrals(id)
);
```

### Enum: `SubscriptionTierEnum`

```php
enum SubscriptionTierEnum: string
{
    case STANDARD = 'standard';
    case PRIORITY_ONE = 'priority_one';
    case PRO = 'pro';
    case ENTERPRISE = 'enterprise';

    public function searchBoostMultiplier(): float
    {
        return match ($this) {
            self::STANDARD => 1.0,
            self::PRIORITY_ONE => 1.5,
            self::PRO => 2.0,
            self::ENTERPRISE => 2.5,
        };
    }

    public function paymentTermDays(): int
    {
        return match ($this) {
            self::STANDARD => 30,
            self::PRIORITY_ONE => 14,
            self::PRO, self::ENTERPRISE => 7,
        };
    }
}
```

### Enum: `ReferralStatusEnum`

```php
enum ReferralStatusEnum: string
{
    case SUBMITTED = 'submitted';
    case CONTACTED = 'contacted';
    case ONBOARDED = 'onboarded';
    case CREDITED = 'credited';
    case INVALID = 'invalid';
}
```

---

## API Contracts (v2)

### Supplier-Facing Endpoints

#### GET `/api/v2/organisations/{organisation}/subscription`
Returns the current subscription state for the organisation.

#### POST `/api/v2/organisations/{organisation}/subscription/checkout`
Creates a Stripe Checkout Session for the selected tier. Returns the Checkout URL.

**Request**:
```json
{
  "tier": "priority_one",
  "success_url": "https://supplier.trilogycare.com.au/priority-one/success",
  "cancel_url": "https://supplier.trilogycare.com.au/priority-one"
}
```

#### POST `/api/v2/organisations/{organisation}/subscription/portal`
Creates a Stripe Customer Portal session for subscription management. Returns the Portal URL.

#### POST `/api/v2/organisations/{organisation}/subscription/change-tier`
Upgrades or downgrades the subscription tier.

**Request**:
```json
{
  "tier": "pro"
}
```

#### POST `/api/v2/organisations/{organisation}/subscription/cancel`
Cancels the subscription at the end of the current billing period.

#### GET `/api/v2/organisations/{organisation}/referrals`
Lists all referrals submitted by this organisation.

#### POST `/api/v2/organisations/{organisation}/referrals`
Submit a new referral.

**Request**:
```json
{
  "company_name": "Allied Health Solutions",
  "service_type": "Physiotherapy",
  "contact_name": "Jane Smith",
  "contact_email": "jane@company.com.au",
  "contact_phone": "0412345678",
  "reason": "Great provider, excellent client feedback."
}
```

#### GET `/api/v2/organisations/{organisation}/subscription/roi`
Returns referral uplift metrics for the ROI dashboard.

### Webhook Endpoint

#### POST `/api/v2/stripe/webhooks`
Handles Stripe webhook events:
- `checkout.session.completed` → activate subscription
- `customer.subscription.updated` → sync tier/status changes
- `customer.subscription.deleted` → revert to standard
- `invoice.payment_failed` → set status to past_due
- `invoice.paid` → confirm active status

### Staff-Facing Endpoints

#### GET `/api/v2/staff/subscriptions`
Paginated list of all subscriptions with filters (tier, status, search).

#### POST `/api/v2/staff/subscriptions/{organisation}/override`
Manually set a tier with reason.

**Request**:
```json
{
  "tier": "pro",
  "reason": "Comp subscription for launch partner."
}
```

#### GET `/api/v2/staff/referrals`
Paginated list of all referrals with filters and status management.

#### POST `/api/v2/staff/referrals/{referral}/update-status`
Update referral status (contacted, onboarded, credited, invalid).

---

## Project Structure

### Backend (Laravel — `tc-portal`)

```text
domain/Organisation/
├── Enums/
│   ├── SubscriptionTierEnum.php           # NEW
│   └── ReferralStatusEnum.php             # NEW
├── Models/
│   ├── Organisation.php                   # MODIFIED — add subscription relationship
│   ├── OrganisationSubscription.php       # NEW
│   ├── Referral.php                       # NEW
│   └── ReferralCredit.php                 # NEW
├── Factories/
│   ├── OrganisationSubscriptionFactory.php # NEW
│   ├── ReferralFactory.php                # NEW
│   └── ReferralCreditFactory.php          # NEW
├── Policies/
│   ├── OrganisationSubscriptionPolicy.php # NEW
│   └── ReferralPolicy.php                # NEW
├── Data/
│   ├── CreateCheckoutSessionData.php      # NEW
│   ├── ChangeTierData.php                 # NEW
│   ├── SubmitReferralData.php             # NEW
│   ├── OverrideSubscriptionData.php       # NEW
│   └── UpdateReferralStatusData.php       # NEW
├── Actions/
│   ├── CreateCheckoutSessionAction.php    # NEW
│   ├── ActivateSubscriptionAction.php     # NEW — from webhook
│   ├── ChangeTierAction.php               # NEW — upgrade/downgrade
│   ├── CancelSubscriptionAction.php       # NEW
│   ├── SyncStripeSubscriptionAction.php   # NEW — webhook handler
│   ├── SubmitReferralAction.php           # NEW
│   ├── ProcessReferralCreditAction.php    # NEW — on VERIFIED status
│   ├── OverrideSubscriptionAction.php     # NEW — staff manual
│   ├── CalculateReferralUpliftAction.php  # NEW — ROI metrics
│   └── ApplySearchBoostAction.php         # NEW — search ranking modifier
├── Listeners/
│   ├── SupplierVerifiedListener.php       # NEW — triggers referral credit check
│   └── StripeWebhookListener.php          # NEW — routes webhook events to actions
└── Notifications/
    ├── SubscriptionActivatedNotification.php   # NEW
    ├── SubscriptionCancelledNotification.php    # NEW
    ├── ReferralCreditEarnedNotification.php     # NEW
    └── PaymentFailedNotification.php            # NEW

app-modules/api/src/V2/
├── routes/
│   ├── subscription.php                    # NEW
│   └── referral.php                        # NEW
└── Http/Controllers/
    ├── Supplier/
    │   ├── SubscriptionController.php      # NEW
    │   ├── SubscriptionCheckoutController.php # NEW
    │   └── ReferralController.php          # NEW
    ├── Staff/
    │   ├── SubscriptionAdminController.php # NEW
    │   └── ReferralAdminController.php     # NEW
    └── Webhook/
        └── StripeWebhookController.php     # NEW

database/migrations/
├── xxxx_xx_xx_create_organisation_subscriptions_table.php  # NEW
├── xxxx_xx_xx_create_referrals_table.php                   # NEW
└── xxxx_xx_xx_create_referral_credits_table.php            # NEW
```

### Frontend (React Next.js — `supplier-portal`)

```text
src/
├── types/
│   └── subscription.ts                    # NEW — shared types
├── lib/
│   └── api/
│       ├── subscription.ts                # NEW — API client functions
│       └── referral.ts                    # NEW — API client functions
├── hooks/
│   ├── use-subscription.ts                # NEW — subscription state
│   └── use-referral-stats.ts              # NEW — referral metrics
├── components/
│   ├── common/
│   │   └── TierBadge.tsx                  # NEW — tier-specific badge (blue/purple/gold)
│   └── priority-one/
│       ├── UpsellCard.tsx                 # NEW — dashboard upsell for Standard tier
│       ├── SubscriptionCard.tsx           # NEW — dashboard status for paid tier
│       ├── PlanComparisonDialog.tsx        # NEW — upgrade/downgrade dialog
│       ├── SubscriptionManagement.tsx     # NEW — full subscription page
│       ├── BillingHistory.tsx             # NEW — invoice list from Stripe
│       ├── ReferralCredits.tsx            # NEW — credit progress display
│       ├── RoiDashboard.tsx               # NEW — referral uplift charts
│       ├── hero.tsx                        # EXISTING — marketing hero
│       ├── features.tsx                   # EXISTING — marketing features
│       ├── pricing.tsx                    # EXISTING — marketing pricing
│       ├── cta.tsx                        # EXISTING — marketing CTA
│       └── refer.tsx                      # EXISTING — referral form
└── app/
    ├── priority-one/
    │   ├── page.tsx                        # EXISTING — marketing page
    │   ├── refer/
    │   │   └── page.tsx                   # EXISTING — referral form page
    │   └── success/
    │       └── page.tsx                   # NEW — post-checkout success page
    └── (supplier)/
        └── subscription/
            └── page.tsx                   # NEW — subscription management page
```

---

## Key Implementation Details

### Search Ranking Boost (FR-004)

The coordinator search system applies a tier-based multiplier to the existing relevance score:

```
final_score = base_relevance_score * tier.searchBoostMultiplier()
```

This is implemented as a scope on the Supplier model query, applied in the coordinator search controller. The multiplier is read from the organisation's cached subscription tier (not a real-time Stripe query).

### Subscription State Caching

- Organisation subscription tier is cached in Redis with a 5-minute TTL
- Cache is invalidated on webhook events and manual overrides
- Badge display reads from cache, not database, for < 100ms response time
- If cache miss, falls back to database query and repopulates cache

### Stripe Integration Pattern

1. **Checkout**: Frontend calls API → API creates Stripe Checkout Session → returns URL → frontend redirects
2. **Activation**: Stripe sends `checkout.session.completed` webhook → API activates subscription → invalidates cache
3. **Management**: Frontend calls API → API creates Stripe Customer Portal session → returns URL → frontend redirects
4. **Sync**: All subscription state changes flow through webhooks. Local database is a read-optimised projection of Stripe state.

### Referral Credit Automation (CL-004)

When SR1 fires a `SupplierVerified` event:
1. `SupplierVerifiedListener` checks if the verified organisation was referred
2. If yes, updates referral status to `onboarded`
3. `ProcessReferralCreditAction` counts total credited referrals for the referring org
4. Applies the appropriate credit tier (1-2 = Bronze, 3-5 = Silver, 6+ = Gold)
5. Creates a Stripe coupon and applies to the next invoice

### Feature Flag

```php
class PriorityOne
{
    public function resolve(mixed $scope): bool
    {
        return false; // Off by default
    }
}
```

---

## Risk Areas

| Risk | Mitigation |
|------|------------|
| Stripe webhook delivery failure | Idempotent handlers, webhook retry (Stripe retries for 3 days), reconciliation job runs daily |
| Local state diverges from Stripe | Stripe is source of truth. Daily reconciliation job compares local state to Stripe API. Discrepancies alert staff. |
| Search boost perceived as unfair by Standard suppliers | Badge says "Verified", not "Sponsored". Standard suppliers still appear. Referral program offers upgrade path. |
| Subscription activation delay > 60s | Webhook processing is async. If webhook is delayed, a polling mechanism on the success page checks status every 5s for 2 minutes. |

---

## Testing Approach

### Backend (Pest)

| Test File | Coverage |
|-----------|----------|
| `SubscriptionCheckoutTest` | Checkout session creation, tier validation, Stripe mock |
| `SubscriptionWebhookTest` | All webhook events, idempotency, state transitions |
| `SubscriptionManagementTest` | Upgrade, downgrade, cancel, reactivate |
| `SearchBoostTest` | Ranking modifier applied correctly per tier |
| `ReferralSubmissionTest` | Form validation, rate limiting, duplicate detection |
| `ReferralCreditTest` | Credit calculation, Stripe coupon creation, tier thresholds |
| `SubscriptionAdminTest` | Staff override, tier assignment, audit logging |
| `ExpressPaymentTermsTest` | Payment term configuration per tier |

### Frontend (Vitest + React Testing Library)

| Area | Coverage |
|------|----------|
| `UpsellCard` | Render for Standard tier, dismiss behaviour |
| `SubscriptionCard` | Render for each tier, referral count display |
| `PlanComparisonDialog` | Tier selection, upgrade/downgrade CTAs |
| `SubscriptionManagement` | Full page rendering, Stripe redirect triggers |
| `RoiDashboard` | Metric display, empty state |

---

## Rollback Strategy

1. **Feature flag**: `PriorityOne` Pennant flag disables all subscription UI and search boost
2. **Stripe subscriptions**: Can be bulk-cancelled via Stripe dashboard with prorated refunds
3. **Search ranking**: Removing the tier multiplier reverts to base relevance scoring (no data migration needed)
4. **Database**: All new tables are additive — can be dropped without affecting existing functionality
5. **Frontend**: Marketing pages remain as static content; subscription management pages hidden behind feature flag
