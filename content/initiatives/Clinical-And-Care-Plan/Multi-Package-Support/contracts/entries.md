---
title: "API Contracts: Entries"
---

# API Contracts: Entries

## Routes

All routes are authenticated and gated by the `multi-package-support` feature flag.

```php
// routes/web/entry.php

Route::middleware(['check.feature.flag:multi-package-support'])
    ->prefix('entries')
    ->group(function () {
        Route::get('/', [EntryController::class, 'index'])->name('entries.index');
        Route::get('/{entryRecord}', [EntryController::class, 'show'])->name('entries.show');

        Route::post('/{entryRecord}/activate', ActivateEntryAction::class)->name('entries.activate');
        Route::post('/{entryRecord}/defer', DeferEntryAction::class)->name('entries.defer');
        Route::post('/{entryRecord}/lodge', LodgeAcerAction::class)->name('entries.lodge');
        Route::post('/{entryRecord}/promote', PromoteEntryAction::class)->name('entries.promote');
    });
```

---

## GET /entries

**Controller**: `EntryController@index`
**Authorization**: `Gate::authorize('viewAny', EntryRecord::class)`
**Feature Flag**: `multi-package-support`

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `tab` | `string` | `new` | Filter tab: `new`, `acer_pending`, `lodged`, `all` |
| `search` | `string` | `null` | Search by client name or classification |
| `sort` | `string` | `take_up_deadline` | Sort column |
| `direction` | `string` | `asc` | Sort direction |

### Response (Inertia)

```typescript
// Props passed to Entries/Index.vue

type EntryMetrics = {
    new_count: number;        // Queued + PendingIntent
    acer_pending_count: number; // ACERPending
    lodged_count: number;     // ACERLodged + FundingAvailable + Active
    total_count: number;      // All statuses
}

type Props = {
    entries: Table<App.Data.Entry.EntryRecordData>;
    metrics: EntryMetrics;
    features: Record<string, boolean>;
}
```

### Tab -> Status Mapping

| Tab | Statuses Included |
|-----|-------------------|
| `new` | `pending_intent`, `queued`, `deferred` |
| `acer_pending` | `activated`, `acer_pending` |
| `lodged` | `acer_lodged`, `funding_available`, `active` |
| `all` | All statuses |

---

## GET /entries/{entryRecord}

**Controller**: `EntryController@show`
**Authorization**: `Gate::authorize('view', $entryRecord)`

### Response (Inertia)

```typescript
type Props = {
    entryRecord: App.Data.Entry.EntryRecordData;
    package: App.Data.Package.PackageData;
    carePartners: App.Data.User.UserData[]; // Available care partners for RC/EOL
    features: Record<string, boolean>;
}
```

---

## POST /entries/{entryRecord}/activate

**Action**: `ActivateEntryAction@asController`
**Authorization**: `EntryRecordPolicy@activate`
**Valid From Status**: `queued`, `deferred`

### Request Body (ActivateEntryData)

```typescript
type ActivateEntryData = {
    commencement_date: string;    // Required. ISO date. Must be <= take_up_deadline
    care_partner_id?: number;     // Required for RC/EOL classifications
    notes?: string;               // Optional. Max 500 chars
}
```

### Validation Rules

| Field | Rules | Notes |
|-------|-------|-------|
| `commencement_date` | `required`, `date`, `before_or_equal:{take_up_deadline}` | Server validates against entry's take_up_deadline |
| `care_partner_id` | `required_if:classification_code,RC,EL`, `exists:users,id` | Required for Restorative Care and End of Life |
| `notes` | `nullable`, `string`, `max:500` | Optional activation notes |

### Response

- **Success**: Redirect back to `/entries` with success toast
- **Validation Error**: 422 with field errors mapped to `form.errors`

### Side Effects

1. Sets `consent_date` to now, `consent_confirmed_by` to authenticated user
2. Sets `commencement_date` and `care_partner_id`
3. Transitions status: `queued` -> `activated` -> `acer_pending` (auto-promotion)
4. Logs activity on EntryRecord

---

## POST /entries/{entryRecord}/defer

**Action**: `DeferEntryAction@asController`
**Authorization**: `EntryRecordPolicy@defer`
**Valid From Status**: `queued`

### Request Body (DeferEntryData)

```typescript
type DeferEntryData = {
    reason: string;          // Required. Max 1000 chars
    reminder_date?: string;  // Optional. ISO date. Must be before take_up_deadline
}
```

### Validation Rules

| Field | Rules |
|-------|-------|
| `reason` | `required`, `string`, `max:1000` |
| `reminder_date` | `nullable`, `date`, `before:{take_up_deadline}` |

### Response

- **Success**: Redirect back to `/entries` with success toast
- **Validation Error**: 422 with field errors

### Side Effects

1. Sets `deferred_reason`, `deferred_at` to now
2. Transitions status: `queued` -> `deferred`
3. If `reminder_date` set, schedules notification
4. Logs activity on EntryRecord

---

## POST /entries/{entryRecord}/lodge

**Action**: `LodgeAcerAction@asController`
**Authorization**: `EntryRecordPolicy@lodge`
**Valid From Status**: `acer_pending`

### Request Body (LodgeAcerData)

```typescript
type LodgeAcerData = {
    lodgement_date: string;      // Required. ISO date
    commencement_date: string;   // Required. ISO date. Must be <= take_up_deadline
}
```

### Validation Rules

| Field | Rules | Notes |
|-------|-------|-------|
| `lodgement_date` | `required`, `date` | When the ACER was lodged in PRODA |
| `commencement_date` | `required`, `date`, `before_or_equal:{take_up_deadline}` | Hard block if after deadline |

### Response

- **Success**: Redirect back to `/entries` with success toast
- **Warning**: If commencement_date is in first 7 days of quarter, return with warning flash message (but still allow)
- **Validation Error**: 422 if commencement_date > take_up_deadline

### Side Effects

1. Sets `lodgement_date` and updates `commencement_date`
2. Transitions status: `acer_pending` -> `acer_lodged`
3. Logs activity on EntryRecord

---

## POST /entries/{entryRecord}/promote

**Action**: `PromoteEntryAction@asController`
**Authorization**: `EntryRecordPolicy@promote`
**Valid From Status**: `pending_intent`

### Request Body

```typescript
type PromoteEntryData = {
    commencement_date: string;  // Required. ISO date. Must be <= take_up_deadline
}
```

### Response

- **Success**: Redirect back to `/entries` with success toast

### Side Effects

1. Links to `PackageAllocation` (now exists since SA allocated)
2. Sets `commencement_date` and `take_up_deadline` from allocation
3. Transitions status: `pending_intent` -> `queued`
4. Logs activity on EntryRecord

---

## Shared Types

### EntryRecordData

```typescript
// Generated via #[TypeScript] on EntryRecordData Laravel Data class

namespace App.Data.Entry {
    type EntryRecordData = {
        id: number;
        packageId: number;
        packageAllocationId: number | null;
        classificationCode: string;
        status: EntryRecordStatus;
        commencementDate: string | null;
        lodgementDate: string | null;
        consentDate: string | null;
        consentConfirmedBy: App.Data.User.UserData | null;
        deferredReason: string | null;
        deferredAt: string | null;
        carePartner: App.Data.User.UserData | null;
        takeUpDeadline: string | null;
        intentCapturedAt: string | null;
        withdrawalReason: string | null;
        withdrawnAt: string | null;
        statusReason: string | null;
        package: App.Data.Package.PackageData;
        fundings: App.Data.Funding.FundingData[];
        isUrgent: boolean;          // Computed: take_up_deadline within 14 days
        requiresCarePartner: boolean; // Computed: classification is RC or EL
        statusBadge: { label: string; colour: string }; // Computed for CommonBadge
    }

    type EntryRecordStatus =
        | 'pending_intent'
        | 'queued'
        | 'activated'
        | 'acer_pending'
        | 'acer_lodged'
        | 'funding_available'
        | 'active'
        | 'deferred'
        | 'expired'
        | 'withdrawn'
        | 'completed';
}
```
