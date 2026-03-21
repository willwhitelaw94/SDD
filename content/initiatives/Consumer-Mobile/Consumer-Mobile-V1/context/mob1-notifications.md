---
title: "MOB1 - Notifications"
description:
---

**Endpoints**: 6
**Build Effort**: Medium - push infrastructure needed

---

## Overview

Notifications keep recipients informed about important events like bills needing approval, statements ready, and package updates. Includes push notifications via Firebase Cloud Messaging (FCM).

---

## Endpoints

| Endpoint                                       | Method | Status | Notes                          |
|------------------------------------------------|--------|--------|--------------------------------|
| `/api/v1/recipient/notifications`              | GET    | 🔨     | List notifications (paginated) |
| `/api/v1/recipient/notifications/{id}/read`    | POST   | 🔨     | Mark as read                   |
| `/api/v1/recipient/notifications/read-all`     | POST   | 🔨     | Mark all read                  |
| `/api/v1/recipient/notifications/unread-count` | GET    | 🔨     | Badge count                    |
| `/api/v1/recipient/device-tokens`              | POST   | 🔨     | Register FCM token             |
| `/api/v1/recipient/device-tokens`              | DELETE | 🔨     | Unregister on logout           |

---

## GET /api/v1/recipient/notifications

**Purpose**: List all notifications for the authenticated user.

**Authorization**: Any authenticated user

**Query Parameters**:
- `status` - Filter by status (unread, read, all) default: all
- `type` - Filter by notification type
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "type": "BILL_NEEDS_APPROVAL",
      "title": "Invoice requires your approval",
      "message": "ABC Home Care has submitted an invoice for $450.00",
      "data": {
        "bill_id": 123,
        "invoice_number": "INV-2024-001",
        "amount": 450.00
      },
      "action_url": "/billing/bills/123",
      "is_read": false,
      "created_at": "2024-01-20T09:00:00Z",
      "read_at": null
    },
    {
      "id": 2,
      "type": "STATEMENT_READY",
      "title": "Your January statement is ready",
      "message": "Your monthly statement for January 2024 is now available",
      "data": {
        "statement_id": 45,
        "period": "January 2024"
      },
      "action_url": "/billing/statements/45",
      "is_read": true,
      "created_at": "2024-02-01T08:00:00Z",
      "read_at": "2024-02-01T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 20,
    "total": 47,
    "unread_count": 5
  }
}
```

---

## POST /api/v1/recipient/notifications/{id}/read

**Purpose**: Mark a specific notification as read.

**Authorization**: User must own the notification

**Response**:
```json
{
  "data": {
    "id": 1,
    "is_read": true,
    "read_at": "2024-01-20T14:30:00Z"
  },
  "message": "Notification marked as read"
}
```

**Status Code**: 200 OK

---

## POST /api/v1/recipient/notifications/read-all

**Purpose**: Mark all notifications as read for the user.

**Authorization**: Any authenticated user

**Response**:
```json
{
  "data": {
    "marked_count": 5
  },
  "message": "All notifications marked as read"
}
```

**Status Code**: 200 OK

---

## GET /api/v1/recipient/notifications/unread-count

**Purpose**: Get count of unread notifications (for badge).

**Authorization**: Any authenticated user

**Response**:
```json
{
  "data": {
    "unread_count": 5
  }
}
```

**Status Code**: 200 OK

**Notes**: 
- Lightweight endpoint for frequent polling
- Used for app badge count
- Should be cached/optimized

---

## POST /api/v1/recipient/device-tokens

**Purpose**: Register a device token for push notifications.

**Authorization**: Any authenticated user

**Request Body**:
```json
{
  "token": "cH4c5k2j9d8f7g6h5j4k3l2m1n0o9p8q7r6s5t4u3v2w1x0y9z8",
  "platform": "ios",
  "app_version": "1.0.0",
  "device_model": "iPhone 13 Pro"
}
```

**Platforms**: `ios`, `android`

**Response**:
```json
{
  "data": {
    "id": 1,
    "token": "cH4c5k2j9d8f7g6h5j4k3l2m1n0o9p8q7r6s5t4u3v2w1x0y9z8",
    "platform": "ios",
    "is_active": true,
    "registered_at": "2024-01-20T15:00:00Z"
  },
  "message": "Device registered successfully"
}
```

**Status Code**: 201 Created

**Notes**:
- Token is unique per device
- Re-registering same token updates `last_used_at`
- Old tokens for same device are marked inactive

---

## DELETE /api/v1/recipient/device-tokens

**Purpose**: Unregister device token (on logout or app uninstall).

**Authorization**: Any authenticated user

**Request Body**:
```json
{
  "token": "cH4c5k2j9d8f7g6h5j4k3l2m1n0o9p8q7r6s5t4u3v2w1x0y9z8"
}
```

**Response**:
```json
{
  "message": "Device unregistered successfully"
}
```

**Status Code**: 200 OK

---

## Notification Types

### Recipient-Relevant Notifications

| Type                          | Trigger                       | Action                   |
|-------------------------------|-------------------------------|--------------------------|
| `BILL_NEEDS_APPROVAL`         | Invoice on hold               | View/approve bill        |
| `BILL_PAID`                   | Invoice paid                  | View transaction         |
| `STATEMENT_READY`             | Monthly statement generated   | View/download statement  |
| `BUDGET_ACTIVATED`            | New budget plan active        | View budget              |
| `PROPOSAL_APPROVED`           | Service proposal approved     | View proposal            |
| `PROPOSAL_REJECTED`           | Service proposal rejected     | View proposal            |
| `FEE_APPROVAL_REQUEST`        | Fee needs approval            | Approve/query fee        |
| `FEE_UPDATED`                 | Contribution amount changed   | View contributions       |
| `INVITATION_RECEIVED`         | New care circle invitation    | Accept/decline           |
| `CHECK_IN_REMINDER`           | Regular check-in due          | Complete check-in        |
| `AGREEMENT_READY`             | HCA ready for signature       | Sign agreement           |
| `DOCUMENT_UPLOADED`           | New document available        | View document            |

---

## Push Notification Infrastructure

### Database Tables

**`device_tokens`**:
```sql
id, user_id, token, platform (ios/android),
app_version, device_model, is_active,
last_used_at, created_at, updated_at
```

**`notifications`**:
```sql
id, notifiable_type, notifiable_id, type, data (JSON),
read_at, created_at, updated_at
```
(Uses Laravel's built-in notifications table)

### Backend Components

**Models**:
- `Domain\Notification\Models\DeviceToken`
- Uses Laravel's `Notification` model

**Notification Classes**:
- `Domain\Notification\Notifications\InvoiceOnHoldNotification`
- `Domain\Notification\Notifications\InvoiceHasBeenPaidNotification`
- `Domain\Notification\Notifications\YourMonthlyStatementNotification`
- etc.

**Channels**:
- `App\Channels\FcmChannel` - Custom FCM channel for push notifications
- Database channel (built-in) - For in-app notifications

**Services**:
- `Domain\Notification\Services\FcmService` - Firebase Cloud Messaging wrapper

### FCM Setup

**Backend**:
```php
// config/services.php
'fcm' => [
    'key' => env('FCM_SERVER_KEY'),
    'sender_id' => env('FCM_SENDER_ID'),
],
```

**Environment**:
```env
FCM_SERVER_KEY=your-firebase-server-key
FCM_SENDER_ID=your-firebase-sender-id
```

### Notification Dispatch

```php
$user->notify(new InvoiceOnHoldNotification($bill));
```

Automatically sends:
1. Database notification (in-app)
2. Push notification to all registered devices

---

## Implementation Notes

### Notification Lifecycle

1. Event occurs (e.g., bill submitted)
2. Backend dispatches notification
3. Stored in database
4. If user has device tokens, send push
5. Mobile app receives push
6. User taps notification
7. App navigates to relevant screen
8. Notification marked as read

### Push Notification Payload

```json
{
  "notification": {
    "title": "Invoice requires your approval",
    "body": "ABC Home Care has submitted an invoice for $450.00",
    "sound": "default",
    "badge": 5
  },
  "data": {
    "type": "BILL_NEEDS_APPROVAL",
    "action_url": "/billing/bills/123",
    "bill_id": 123
  }
}
```

### Permissions

Mobile app must request notification permissions:
- iOS: `UNAuthorizationOptions`
- Android: Automatic (Android 13+ requires explicit permission)

### Testing

**Development**:
- Use FCM test messages
- Test token registration/cleanup
- Test notification tap handling

**Production**:
- Monitor delivery rates
- Track open rates
- Handle token expiration

---

## Related Documents

- [API Endpoints Overview](./API-ENDPOINTS)
- [MOB1 Packages APIs](./mob1-packages)
- [MOB1 Bills APIs](./mob1-bills)
- [MOB1 Implementation Plan](../DESIGN)
