---
title: "Twilio"
description: "SMS phone number verification services"
---

> Phone number verification via Twilio Verify Service

---

## TL;DR

- **What**: SMS-based phone number verification (NOT SMS notifications or 2FA)
- **Who**: Users updating account information
- **Key flow**: User updates phone → Verification code sent → User enters code → Phone verified
- **Watch out**: Only phone verification is implemented; SMS notifications and 2FA are NOT implemented

---

## Open Questions

| Question | Context |
|----------|---------|
| **SMS Notifications?** | Documentation previously claimed SMS notifications exist - they do NOT. No Laravel notification channel for Twilio. |
| **SMS 2FA?** | 2FA is disabled in Fortify config. When enabled, uses TOTP (QR code), not SMS. |

---

## What's Actually Implemented

### Phone Number Verification Only ✅

Twilio is integrated exclusively for **phone number verification** via Twilio Verify API:

| Feature | Implemented | Notes |
|---------|------------|-------|
| Phone verification | ✅ Yes | Full Verify API integration |
| SMS notifications | ❌ No | No notification channel exists |
| SMS 2FA | ❌ No | 2FA uses TOTP only (when enabled) |

---

## Technical Reference

### Core Service

**File**: `domain/Shared/Services/TwilioVerificationService.php`

- Sends verification codes via SMS
- Validates verification codes
- 2-minute resend cooldown
- 60-minute code validity window

### Actions

```
domain/Shared/Actions/Twilio/
├── TwilioSendVerificationCodeAction.php
├── TwilioCheckVerificationCodeAction.php
└── Verification/
    ├── SendSMSVerificationCodeAction.php
    ├── VerifySMSVerificationCodeAction.php
    └── GetSMSVerificationDataAction.php
```

### Error Handling

**File**: `domain/Shared/Services/TwilioErrorHandlerService.php`

Maps Twilio error codes (60200-60214) to user-friendly messages.

### API Routes

```php
// routes/api.php
Route::prefix('sms-verification')->group(function () {
    Route::get('data', [GetSMSVerificationDataAction::class, 'asController']);
    Route::post('send', [SendSMSVerificationCodeAction::class, 'asApiController']);
    Route::post('verify', [VerifySMSVerificationCodeAction::class, 'asApiController']);
});
```

### User Verification Logging

**File**: `domain/User/Models/UserVerificationLog.php`

Tracks verification attempts with:
- `TYPE_PHONE = 1`
- `PROVIDER_TWILIO = 1`
- Status tracking (SENT, USED)
- Event tracking (UPDATE_ACCOUNT_INFORMATION)

### Configuration

**File**: `config/twilio.php`

```php
return [
    'account_sid' => env('TWILIO_ACCOUNT_SID'),
    'auth_token' => env('TWILIO_AUTH_TOKEN'),
    'verify_sid' => env('TWILIO_VERIFY_SID'),
];
```

### Service Provider

Twilio Client registered as singleton in `AppServiceProvider` (line 72-74)

### Helper Functions

**File**: `app/Helpers.php`

`formatPhoneNumberForTwilio()` - Converts phone numbers to E.164 format

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio account identifier |
| `TWILIO_AUTH_TOKEN` | API authentication token |
| `TWILIO_VERIFY_SID` | Verify Service identifier |

---

## Testing

- `domain/Shared/Services/TwilioVerificationServiceTest.php`
- `domain/Shared/Actions/Twilio/TwilioSendVerificationCodeActionTest.php`
- `domain/Shared/Actions/Twilio/TwilioCheckVerificationCodeActionTest.php`
- `domain/Shared/Actions/Twilio/Verification/SendSMSVerificationCodeActionTest.php`
- `domain/Shared/Actions/Twilio/Verification/VerifySMSVerificationCodeActionTest.php`

---

## Status

**Maturity**: Production (verification only)
**Pod**: Platform
