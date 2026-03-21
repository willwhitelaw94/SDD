---
title: "MOB1 - Home Care Agreements"
description:
---

**Endpoints**: 4
**Build Effort**: **HIGH - NEW FEATURE**

---

## Overview

The Home Care Agreement (HCA) is the contract between the recipient and Trilogy. Recipients must read and sign this agreement before services can commence. This is the **biggest build effort for MOB1**.

---

## Endpoints

| Endpoint                                                  | Method | Status | Notes             |
|-----------------------------------------------------------|--------|--------|-------------------|
| `/api/v1/recipient/packages/{package}/agreement`          | GET    | 🔨     | View agreement    |
| `/api/v1/recipient/packages/{package}/agreement/sign`     | POST   | 🔨     | Sign with e-sig   |
| `/api/v1/recipient/packages/{package}/agreement/decline`  | POST   | 🔨     | Decline agreement |
| `/api/v1/recipient/packages/{package}/agreement/download` | GET    | 🔨     | Download PDF      |

---

## GET /api/v1/recipient/packages/{package}/agreement

**Purpose**: Get the current Home Care Agreement for the package.

**Authorization**: User must have access to the package

**Response**:
```json
{
  "data": {
    "id": 1,
    "title": "Home Care Agreement",
    "version": "2.1",
    "status": "PENDING_SIGNATURE",
    "effective_date": "2024-01-15",
    "expiry_date": "2025-01-15",
    "content": {
      "sections": [
        {
          "title": "1. Services",
          "content": "Trilogy will provide..."
        },
        {
          "title": "2. Fees and Charges",
          "content": "You agree to pay..."
        },
        {
          "title": "3. Responsibilities",
          "content": "As a recipient you are responsible for..."
        }
      ]
    },
    "requires_signature": true,
    "signature_deadline": "2024-02-15",
    "signatures": [],
    "created_at": "2024-01-15T09:00:00Z"
  }
}
```

---

## POST /api/v1/recipient/packages/{package}/agreement/sign

**Purpose**: Sign the Home Care Agreement electronically.

**Authorization**: 
- User must have access to the package
- Agreement must be in `PENDING_SIGNATURE` status
- Only recipient or authorized representative can sign

**Request Body**:
```json
{
  "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "signature_type": "DRAWN",
  "full_name": "John Smith",
  "signed_date": "2024-01-20",
  "ip_address": "203.45.67.89",
  "device_info": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)"
}
```

**Signature Types**:
- `DRAWN` - User drew signature on screen (base64 image)
- `TYPED` - User typed their name (text)
- `BIOMETRIC` - Authenticated via biometrics (fingerprint/face ID)

**Response**:
```json
{
  "data": {
    "id": 1,
    "status": "SIGNED",
    "signatures": [
      {
        "id": 1,
        "signed_by": {
          "name": "John Smith",
          "email": "john@example.com",
          "role": "Recipient"
        },
        "signature_type": "DRAWN",
        "signed_at": "2024-01-20T14:30:00Z",
        "ip_address": "203.45.67.89"
      }
    ],
    "effective_date": "2024-01-20",
    "pdf_available": true
  },
  "message": "Agreement signed successfully"
}
```

**Status Code**: 200 OK

---

## POST /api/v1/recipient/packages/{package}/agreement/decline

**Purpose**: Decline to sign the agreement.

**Authorization**: User must have access to the package

**Request Body**:
```json
{
  "reason": "NEED_MORE_INFORMATION",
  "comment": "I would like to discuss the fees section with my care manager"
}
```

**Decline Reasons**:
- `NEED_MORE_INFORMATION` - Need clarification
- `TERMS_NOT_ACCEPTABLE` - Don't agree with terms
- `SEEKING_ALTERNATIVE` - Looking at other providers
- `OTHER` - Other reason (must provide comment)

**Response**:
```json
{
  "data": {
    "id": 1,
    "status": "DECLINED",
    "declined_by": {
      "name": "John Smith",
      "email": "john@example.com",
      "role": "Recipient"
    },
    "declined_at": "2024-01-20T15:00:00Z",
    "reason": "NEED_MORE_INFORMATION",
    "comment": "I would like to discuss the fees section with my care manager"
  },
  "message": "Agreement declined. A care manager will contact you shortly."
}
```

**Status Code**: 200 OK

**Notifications**: Triggers notification to care team

---

## GET /api/v1/recipient/packages/{package}/agreement/download

**Purpose**: Download the agreement as PDF (with signatures if signed).

**Authorization**: User must have access to the package

**Response**: PDF file

**Content-Type**: `application/pdf`

**Content-Disposition**: `attachment; filename="home-care-agreement-2024.pdf"`

**Status Code**: 200 OK

**Notes**:
- If unsigned: Shows agreement without signatures
- If signed: Shows agreement with signature images embedded

---

## Agreement Status Workflow

```
DRAFT → PENDING_SIGNATURE → SIGNED → ACTIVE
                ↓
            DECLINED → REVISED → PENDING_SIGNATURE
                ↓
            EXPIRED → RENEWED → PENDING_SIGNATURE
```

| Status               | Description                          |
|----------------------|--------------------------------------|
| `DRAFT`              | Being prepared, not yet sent         |
| `PENDING_SIGNATURE`  | Waiting for recipient to sign        |
| `SIGNED`             | Signed, not yet effective            |
| `ACTIVE`             | Currently in effect                  |
| `DECLINED`           | Recipient declined to sign           |
| `REVISED`            | Updated after decline                |
| `EXPIRED`            | Term ended, needs renewal            |
| `TERMINATED`         | Agreement ended                      |

---

## Implementation Requirements

### Database

**New Table**: `recipient_agreements`
```sql
id, package_id, version, status, content (JSON),
effective_date, expiry_date, signature_deadline,
created_at, updated_at
```

**New Table**: `agreement_signatures`
```sql
id, agreement_id, user_id, signature_type, signature_data,
full_name, signed_at, ip_address, device_info, created_at
```

### Backend

- **Model**: `Domain\Agreement\Models\RecipientAgreement`
- **Model**: `Domain\Agreement\Models\AgreementSignature`
- **Controller**: `app-modules/api/src/V1/src/Http/Controllers/RecipientAgreementController`
- **Policy**: `Domain\Agreement\Policies\RecipientAgreementPolicy`
- **Action**: `Domain\Agreement\Actions\SignRecipientAgreement`
- **Action**: `Domain\Agreement\Actions\DeclineRecipientAgreement`
- **Service**: `Domain\Agreement\Services\AgreementPdfGenerator`

### PDF Generation

Use existing PDF generation infrastructure:
- Laravel DOMPDF or similar
- Template with signature image placement
- Watermarks for unsigned copies

### Mobile E-Signature

Frontend needs signature capture:
- React Native Signature Canvas
- Convert to PNG/JPG base64
- Compress before upload
- Validate signature not blank

### Security

- Log all signature attempts
- Store IP address and device info
- Use timestamps for audit trail
- Prevent signature tampering

---

## Risk Assessment

**This is the biggest unknown for MOB1:**

| Risk                        | Mitigation                                    |
|-----------------------------|-----------------------------------------------|
| Agreement model doesn't exist for recipients | Create new polymorphic relationship         |
| E-signature legal validity  | Consult legal team on requirements            |
| PDF generation complexity   | Use existing Trilogy templates                |
| Mobile signature UX         | Test with multiple devices                    |
| Multi-party signatures      | Phase 1: Single signature, Phase 2: Multiple  |

---

## Related Documents

- [API Endpoints Overview](./API-ENDPOINTS)
- [MOB1 Packages APIs](./mob1-packages)
- [MOB1 Implementation Plan](../DESIGN)
