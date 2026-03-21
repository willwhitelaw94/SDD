---
title: "Intercom"
description: "Customer support and communication platform"
---

> In-app customer support chat with identity verification

---

## TL;DR

- **What**: In-app messenger widget for customer support with HMAC identity verification
- **Who**: All portal users (staff, recipients, suppliers, coordinators)
- **Key flow**: User loads portal → Intercom initializes → Identity hash generated → Support chat available
- **Watch out**: Feature-flagged via `INTERCOM_ENABLED`; falls back to HelpScout Beacon when disabled

---

## Integration Points

- In-app messenger widget with custom launcher
- HMAC-SHA256 identity verification for authenticated users
- Role-based user attributes (admin, recipient, representative, supplier, care_coordinator)
- Guest mode for unauthenticated visitors

---

## Technical Reference

### Backend Service

**File**: `app/Services/Intercom/IntercomService.php`

```php
// Methods
getHash(): ?string      // HMAC-SHA256 hash for identity verification
getAppId(): ?string     // Configured Intercom app ID
```

### Configuration

**File**: `config/services.php` (lines 48-52)

```php
'intercom' => [
    'enabled' => env('INTERCOM_ENABLED', false),
    'app_id' => env('VITE_INTERCOM_APP_ID'),
    'secret' => env('INTERCOM_SECRET'),
],
```

### Frontend Implementation

| Component | File | Purpose |
|-----------|------|---------|
| Composable | `resources/js/composables/useIntercom.ts` | Full Intercom SDK integration (246 lines) |
| Launcher | `resources/js/Components/Common/CommonFloatingHelpButton.vue` | Custom "Get Help" button |
| Layout | `resources/js/Layouts/AppLayout.vue` | Initializes `useIntercom()` |

### Inertia Middleware

**File**: `app/Http/Middleware/HandleInertiaRequests.php`

Passes Intercom config to frontend:
```php
'intercom' => config('services.intercom.enabled') ? [
    'app_id' => config('services.intercom.app_id'),
    'user_hash' => App::make(IntercomService::class)->getHash(),
] : null,
```

### NPM Package

Uses `@intercom/messenger-js-sdk` (v0.0.18)

### Fallback

When Intercom is disabled, falls back to HelpScout Beacon for external users (guests, suppliers) - see `resources/views/app.blade.php` lines 90-137.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `INTERCOM_ENABLED` | Feature toggle (default: false) |
| `VITE_INTERCOM_APP_ID` | Intercom application ID |
| `INTERCOM_SECRET` | Secret for HMAC identity verification |

---

## Testing

**File**: `tests/Service/IntercomServiceTest.php` (5 test cases)

---

## Status

**Maturity**: Production
**Pod**: Platform
