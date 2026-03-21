---
title: "MOB1 - Statements & Transactions"
description:
---

**Endpoints**: 4
**Build Effort**: Medium - contributions need work

---

## Overview

Statements provide monthly summaries of package activity, while transactions show individual charges and credits. Contributions (co-contributions and recipient fees) are also accessible.

---

## Endpoints

| Endpoint                                                        | Method | Status | Notes                          |
|-----------------------------------------------------------------|--------|--------|--------------------------------|
| `/api/v1/recipient/packages/{package}/transactions`             | GET    | 🔨     | Transaction list               |
| `/api/v1/recipient/packages/{package}/statements`               | GET    | 🔨     | Statement list                 |
| `/api/v1/recipient/packages/{package}/statements/{id}/download` | GET    | 🔨     | Download PDF                   |
| `/api/v1/recipient/packages/{package}/contributions`            | GET    | ⚠️     | View contributions (needs work)|

---

## GET /api/v1/recipient/packages/{package}/transactions

**Purpose**: List all financial transactions for the package.

**Authorization**: User must have access to the package

**Query Parameters**:
- `from_date` - Start date filter (YYYY-MM-DD)
- `to_date` - End date filter (YYYY-MM-DD)
- `type` - Filter by type (charge, payment, adjustment, refund)
- `budget_item_id` - Filter by budget item
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 50, max: 200)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "date": "2024-01-15",
      "type": "CHARGE",
      "description": "Personal care - Morning assistance",
      "supplier": {
        "id": 5,
        "name": "ABC Home Care"
      },
      "budget_item": "Personal Care",
      "amount": 130.00,
      "gst_amount": 13.00,
      "balance_after": 18370.00,
      "bill_id": 1,
      "invoice_number": "INV-2024-001",
      "status": "APPROVED"
    },
    {
      "id": 2,
      "date": "2024-01-01",
      "type": "CREDIT",
      "description": "Quarterly funding allocation",
      "amount": 6500.00,
      "balance_after": 25000.00,
      "status": "COMPLETED"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 15,
    "per_page": 50,
    "total": 723,
    "balance_summary": {
      "opening_balance": 18500.00,
      "total_charges": -2430.00,
      "total_credits": 6500.00,
      "closing_balance": 22570.00
    }
  }
}
```

---

## GET /api/v1/recipient/packages/{package}/statements

**Purpose**: List monthly statements for the package.

**Authorization**: User must have access to the package

**Query Parameters**:
- `year` - Filter by year (default: current year)
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 12, max: 24)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "period": "January 2024",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "opening_balance": 18500.00,
      "total_charges": 2430.00,
      "total_credits": 6500.00,
      "closing_balance": 22570.00,
      "status": "FINAL",
      "generated_at": "2024-02-01T09:00:00Z",
      "pdf_available": true
    },
    {
      "id": 2,
      "period": "December 2023",
      "start_date": "2023-12-01",
      "end_date": "2023-12-31",
      "opening_balance": 15200.00,
      "total_charges": 3200.00,
      "total_credits": 6500.00,
      "closing_balance": 18500.00,
      "status": "FINAL",
      "generated_at": "2024-01-01T09:00:00Z",
      "pdf_available": true
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 12,
    "total": 18
  }
}
```

---

## GET /api/v1/recipient/packages/{package}/statements/{id}/download

**Purpose**: Download a statement as PDF.

**Authorization**: User must have access to the package

**Response**: PDF file

**Content-Type**: `application/pdf`

**Content-Disposition**: `attachment; filename="statement-2024-01.pdf"`

**Status Code**: 200 OK

**Error Responses**:
- 404 Not Found - Statement doesn't exist or not yet generated
- 403 Forbidden - User doesn't have access to package

---

## GET /api/v1/recipient/packages/{package}/contributions

**Purpose**: View recipient contributions (co-contributions and fees).

**Authorization**: User must have access to the package

**Status**: ⚠️ Needs backend work on query logic

**Expected Response**:
```json
{
  "data": {
    "current_rate": {
      "income_tested_care_fee": 0.00,
      "basic_daily_fee": 11.84,
      "total_daily": 11.84,
      "total_monthly": 361.04,
      "effective_from": "2024-01-01"
    },
    "payment_method": {
      "type": "DIRECT_DEBIT",
      "frequency": "MONTHLY",
      "next_payment_date": "2024-02-15"
    },
    "history": [
      {
        "period": "January 2024",
        "income_tested_fee": 0.00,
        "basic_daily_fee": 367.04,
        "total": 367.04,
        "paid": true,
        "paid_date": "2024-02-01"
      },
      {
        "period": "December 2023",
        "income_tested_fee": 0.00,
        "basic_daily_fee": 367.04,
        "total": 367.04,
        "paid": true,
        "paid_date": "2024-01-02"
      }
    ],
    "annual_summary": {
      "year": 2024,
      "total_paid": 367.04,
      "total_outstanding": 0.00
    }
  }
}
```

---

## Implementation Notes

### Transaction Types

| Type         | Description                  | Impact  |
|--------------|------------------------------|---------|
| `CHARGE`     | Service charge from supplier | Debit   |
| `CREDIT`     | Funding allocation           | Credit  |
| `PAYMENT`    | Outgoing payment             | Debit   |
| `ADJUSTMENT` | Manual adjustment            | Varies  |
| `REFUND`     | Credit return                | Credit  |
| `FEE`        | Contribution/admin fee       | Debit   |

### Statement Status

| Status      | Description                           |
|-------------|---------------------------------------|
| `DRAFT`     | Still being compiled                  |
| `FINAL`     | Locked, PDF generated                 |
| `AMENDED`   | Corrected after finalization          |

### Related Models

- `Domain\Transaction\Models\Transaction`
- `Domain\Statement\Models\Statement`
- `Domain\RecipientContribution\Models\RecipientContribution`

### Notifications

- `YourMonthlyStatementNotification` - When statement is ready

---

## Outstanding Work

### Contributions Endpoint

The contributions query needs work to properly aggregate:
- Income-tested care fees
- Basic daily fees
- Payment history
- Outstanding amounts

Currently the data structure exists but query logic needs refinement.

---

## Related Documents

- [API Endpoints Overview](./API-ENDPOINTS)
- [MOB1 Packages APIs](./mob1-packages)
- [MOB1 Bills APIs](./mob1-bills)
- [MOB1 Implementation Plan](../DESIGN)
