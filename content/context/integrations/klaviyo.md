---
title: "Klaviyo"
description: "Email and SMS marketing platform"
---

> Lead event tracking and profile management for marketing automation

---

## TL;DR

- **What**: Email/SMS marketing platform integration for lead event tracking
- **Who**: Marketing team, Lead management workflows
- **Key flow**: Lead created/updated → Event queued → Klaviyo profile upserted → Marketing automation triggered
- **Watch out**: Feature-flagged via `ff_klaviyo_integration` in Nova settings

---

## Integration Points

- Lead creation events (`METRIC_NEW_LEAD_CREATED`)
- Lead update events (`METRIC_LEAD_UPDATED`)
- Content watched events (`METRIC_LEAD_CONTENT_WATCHED`)
- Profile management and upserts
- Bulk event tracking (batches of 50, up to 1,000 per execution)

---

## Technical Reference

### Actions & Jobs

| Component | File | Purpose |
|-----------|------|---------|
| **CreateKlaviyoEventAction** | `app/Actions/Klaviyo/CreateKlaviyoEventAction.php` | Creates individual events for leads |
| **UpsertKlaviyoProfileAction** | `app/Actions/Klaviyo/UpsertKlaviyoProfileAction.php` | Creates/updates Klaviyo profiles |
| **KlaviyoCreateLeadBulkEventJob** | `app/Jobs/Klaviyo/KlaviyoCreateLeadBulkEventJob.php` | Bulk processes leads with NEED_RESYNC status |

### Data Classes

```
app/Data/Klaviyo/
├── KlaviyoEventData.php          # Event payloads with bulk format support
└── KlaviyoProfileData.php        # Profile payloads with validation
```

### Model

**File**: `app/Models/KlaviyoProfile.php`

Stores local cache of Klaviyo profile data (`klaviyo_id`, `email`)

### Feature Flag

**File**: `app/Features/ToggleKlaviyoFeature.php`

- Setting key: `ff_klaviyo_integration`
- Stored in Nova settings database
- Gates all Klaviyo operations

### Scheduled Job

```php
// app/Console/Kernel.php (line 204-208)
Schedule::job(new KlaviyoCreateLeadBulkEventJob)
    ->everyFiveMinutes()
    ->environments(['production']);
```

### Integration Points in Lead Domain

| Location | Usage |
|----------|-------|
| `domain/Lead/Http/Controllers/LeadController.php` | Queues on lead creation |
| `domain/Lead/Http/Controllers/LeadPublicController.php` | Queues on public lead creation |
| `domain/Lead/Actions/MarkLeadContentCompleted.php` | Triggers content watched event |
| `domain/Lead/Actions/UpdateLeadFromZohoAction.php` | Triggers profile upsert |

### Configuration

**File**: `config/klaviyo.php`

```php
return [
    'public_key' => env('KLAVIYO_PUBLIC_KEY'),
    'private_key' => env('KLAVIYO_PRIVATE_KEY'),
];
```

### Service Provider

Singleton in `AppServiceProvider`:
```php
$this->app->singleton(KlaviyoAPI::class, function () {
    return new KlaviyoAPI(config('klaviyo.private_key'));
});
```

### Vendor Package

Uses `klaviyo/api` SDK for API calls

---

## Testing

- `tests/.../CreateKlaviyoEventActionTest.php`
- `tests/.../UpsertKlaviyoProfileActionTest.php`

---

## Status

**Maturity**: Production
**Pod**: Marketing / Lead Management
