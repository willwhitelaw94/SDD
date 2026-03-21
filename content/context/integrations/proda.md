---
title: "PRODA"
description: "Australian government provider authentication for Services Australia APIs"
---

> Provider Digital Access authentication for government API access

---

## TL;DR

- **What**: Government authentication system for accessing Services Australia APIs
- **Who**: System (automated), Finance team (device management)
- **Key flow**: Device activated → RSA keys generated → JWT signed → OAuth token obtained → API calls authenticated
- **Watch out**: Keys expire and need refresh; device expiry notifications sent 7 days before expiry

---

## Key Concepts

| Term | What it means |
|------|---------------|
| **PRODA** | Provider Digital Access - government auth system |
| **Device** | Virtual device registered with PRODA for API access |
| **RSA Keys** | Public/private key pair for JWT signing |
| **JWT Bearer Grant** | OAuth flow using signed JWT for token requests |
| **DHS Headers** | Government-specific headers (auditId, subjectId, productId, etc.) |

---

## Integration Points

- Device activation via PRODA API
- RSA key generation and refresh
- JWT Bearer Grant OAuth token requests
- Automatic header attachment for Aged Care API calls

---

## Technical Reference

### Core Client

**File**: `app-modules/aged-care-api/src/ProdaClient.php`

**Methods**:
- `activateDevice()` - PUT request with device details
- `refreshDevice()` - Regenerates RSA keys before expiry
- `getAccessToken()` - JWT Bearer grant flow

**JWT Implementation**:
- RSA-2048 private key signing
- Token expiry: 3600 seconds (configurable)
- Grant type: `urn:ietf:params:oauth:grant-type:jwt-bearer`

### Device Model

**File**: `app-modules/aged-care-api/src/Models/ProdaDevice.php`

**Table**: `proda_devices`

| Column | Purpose |
|--------|---------|
| `name` | Device identifier |
| `status` | Active/inactive |
| `organisation_id` | PRODA org ID |
| `one_time_activation_code` | Used during initial activation |
| `device_expiry` | When device expires |
| `key_status`, `key_expiry` | RSA key tracking |
| `private_key`, `public_key_modulus` | RSA key storage |
| `json_web_key`, `json_algorithm` | JWK metadata |

**Key Methods**:
- `activate()` - Full device activation workflow
- `refreshKey()` - Refresh RSA keys before expiry
- `getAccessToken()` - Cached token retrieval
- `isActive()` - Status checking

### Request Middleware

**File**: `app-modules/aged-care-api/src/Http/Integrations/AttachFreshProdaHeaders.php`

Automatically attaches PRODA headers to all Aged Care API requests:
- `dhs-auditId`, `dhs-auditIdType`
- `dhs-subjectId`, `dhs-subjectIdType`
- `dhs-productId`, `dhs-messageId`, `dhs-correlationId`
- Bearer token in Authorization header

### CLI Commands

| Command | Purpose |
|---------|---------|
| `proda:refresh-devices` | Auto-refresh devices within 31 days of key expiry |
| `proda:notify-expiring-devices` | Email notifications for devices within 7 days of expiry |

### Web UI

**Controller**: `ProdaDeviceController`

**Routes** (at `/aged-care-apis/devices`):
- Index - List all devices with pagination
- Create - Form for new device setup
- Store - Activation endpoint

**Views**:
- `resources/views/devices/index.blade.php`
- `resources/views/devices/create.blade.php`

### Exception Handling

15 custom exceptions for specific PRODA error codes:

**Device errors**: DE.2, DE.4, DE.5, DE.7, DE.9
**JWK errors**: JWK.1, JWK.2, JWK.8, JWK.9
**Token errors**: Various access token exceptions

### Authorization Policy

**File**: `ProdaDevicePolicy.php`

| Action | Permission |
|--------|------------|
| View | `view-proda-devices` |
| Create/Update/Delete | `create-proda-devices` |

---

## Configuration

**File**: `app-modules/aged-care-api/config/config.php`

| Variable | Purpose |
|----------|---------|
| `PRODA_BASE_URL` | Base PRODA URL (default: `https://proda.humanservices.gov.au`) |
| `PRODA_ORGANISATION_ID` | Organisation identifier |
| `PRODA_CLIENT_ID` | Client ID for authentication |
| `PRODA_DEVICE_NAME` | Device identifier |
| `PRODA_PRODUCT_ID` | Product identifier |
| `IBM_CLIENT_ID` | IBM client for Aged Care APIs |
| `PRODA_ACCESS_TOKEN_EXPIRY_SECONDS` | Token expiry (default: 3600) |
| `PRODA_URL_ACTIVATE_DEVICE` | Device activation endpoint |
| `PRODA_URL_REFRESH_DEVICE` | Device refresh endpoint |
| `PRODA_URL_AUTHORISATION_REQUEST` | OAuth token endpoint |
| `PRODA_EXPIRING_DEVICES_NOTIFICATION_EMAIL` | Admin notification list |

---

## Related

- [Services Australia API](./services-australia-api.md) - Uses PRODA for authentication

---

## Status

**Maturity**: Production
**Pod**: Finance / Platform
