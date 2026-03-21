---
title: "MOB1 - Bills"
description:
---

**Endpoints**: 4
**Build Effort**: Low - actions exist

---

## Overview

Bills (invoices) represent charges from suppliers for services delivered. Recipients and representatives can view bills, see transaction details, and approve or reject bills that require attention.

---

## Endpoints

| Endpoint                                                  | Method | Status | Notes                        |
|-----------------------------------------------------------|--------|--------|------------------------------|
| `/api/v1/recipient/packages/{package}/bills`              | GET    | ✅      | List bills                   |
| `/api/v1/recipient/packages/{package}/bills/{id}`         | GET    | ✅      | Bill detail with transactions|
| `/api/v1/recipient/packages/{package}/bills/{id}/approve` | POST   | ✅      | Approve bill                 |
| `/api/v1/recipient/packages/{package}/bills/{id}/reject`  | POST   | ✅      | Reject/query bill            |

*Submit invoice (create bill) = Phase 2*

---

## GET /api/v1/recipient/packages/{package}/bills

**Purpose**: List all bills for the package with filters and pagination.

**Authorization**: User must have access to the package

**Query Parameters**:
- `status` - Filter by status (pending, approved, rejected, paid)
- `supplier_id` - Filter by supplier
- `from_date` - Start date filter (YYYY-MM-DD)
- `to_date` - End date filter (YYYY-MM-DD)
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "invoice_number": "INV-2024-001",
      "supplier": {
        "id": 5,
        "name": "ABC Home Care",
        "abn": "12 345 678 901"
      },
      "invoice_date": "2024-01-15",
      "due_date": "2024-02-14",
      "total_amount": 450.00,
      "gst_amount": 45.00,
      "status": "PENDING_APPROVAL",
      "requires_action": true,
      "line_items_count": 3,
      "created_at": "2024-01-16T09:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 20,
    "total": 52
  }
}
```

---

## GET /api/v1/recipient/packages/{package}/bills/{id}

**Purpose**: Get detailed bill information including all transactions/line items.

**Authorization**: User must have access to the package

**Response**:
```json
{
  "data": {
    "id": 1,
    "invoice_number": "INV-2024-001",
    "supplier": {
      "id": 5,
      "name": "ABC Home Care",
      "abn": "12 345 678 901",
      "contact_email": "accounts@abchomecare.com.au",
      "contact_phone": "1300 123 456"
    },
    "invoice_date": "2024-01-15",
    "due_date": "2024-02-14",
    "status": "PENDING_APPROVAL",
    "requires_action": true,
    "transactions": [
      {
        "id": 101,
        "date": "2024-01-05",
        "description": "Personal care - Morning assistance",
        "quantity": 2,
        "unit": "hours",
        "unit_price": 65.00,
        "amount": 130.00,
        "gst_amount": 13.00,
        "budget_item": "Personal Care"
      },
      {
        "id": 102,
        "date": "2024-01-06",
        "description": "Personal care - Morning assistance",
        "quantity": 2,
        "unit": "hours",
        "unit_price": 65.00,
        "amount": 130.00,
        "gst_amount": 13.00,
        "budget_item": "Personal Care"
      }
    ],
    "subtotal": 410.00,
    "gst_amount": 41.00,
    "total_amount": 451.00,
    "notes": "Regular fortnightly services",
    "approval_history": [
      {
        "action": "QUERIED",
        "by": "Jane Smith",
        "at": "2024-01-17T10:30:00Z",
        "comment": "Please confirm dates"
      }
    ],
    "created_at": "2024-01-16T09:00:00Z",
    "updated_at": "2024-01-17T10:30:00Z"
  }
}
```

---

## POST /api/v1/recipient/packages/{package}/bills/{id}/approve

**Purpose**: Approve a bill for payment.

**Authorization**: 
- User must have access to the package
- User must have `can_approve_bills` permission (for representatives)
- Bill must be in `PENDING_APPROVAL` status

**Request Body**:
```json
{
  "comment": "Services confirmed, ready for payment"
}
```

**Response**:
```json
{
  "data": {
    "id": 1,
    "status": "APPROVED",
    "approved_by": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "approved_at": "2024-01-18T14:20:00Z",
    "comment": "Services confirmed, ready for payment"
  },
  "message": "Bill approved successfully"
}
```

**Status Code**: 200 OK

---

## POST /api/v1/recipient/packages/{package}/bills/{id}/reject

**Purpose**: Reject or query a bill (sends back to supplier for review).

**Authorization**: 
- User must have access to the package
- User must have `can_approve_bills` permission (for representatives)
- Bill must be in `PENDING_APPROVAL` status

**Request Body**:
```json
{
  "reason": "INCORRECT_DATES",
  "comment": "The dates don't match the services delivered"
}
```

**Reason Codes**:
- `INCORRECT_DATES` - Service dates are wrong
- `INCORRECT_AMOUNT` - Pricing or calculations incorrect
- `SERVICE_NOT_DELIVERED` - Service wasn't provided
- `DUPLICATE` - Duplicate invoice
- `OTHER` - Other reason (must provide comment)

**Response**:
```json
{
  "data": {
    "id": 1,
    "status": "REJECTED",
    "rejected_by": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "rejected_at": "2024-01-18T14:25:00Z",
    "reason": "INCORRECT_DATES",
    "comment": "The dates don't match the services delivered"
  },
  "message": "Bill rejected and returned to supplier"
}
```

**Status Code**: 200 OK

---

## Bill Status Workflow

```
DRAFT → SUBMITTED → PENDING_APPROVAL → APPROVED → PAID
                           ↓
                       REJECTED → RESUBMITTED → PENDING_APPROVAL
```

---

## Implementation Notes

### Backend Actions

The bills feature uses existing Laravel actions:

- `ApproveBill` - Approve bill for payment
- `RejectBill` - Reject/query bill
- `CreateBillFromInvoice` - Phase 2 (submit invoice)

### Related Models

- `Domain\Bill\Models\Bill`
- `Domain\Transaction\Models\Transaction`
- `Domain\Supplier\Models\Supplier`

### Notifications

Actions trigger notifications:

- `InvoiceOnHoldNotification` - When bill needs approval
- `InvoiceHasBeenPaidNotification` - When bill is paid
- Bill rejection notifies supplier

### Policy Checks

```php
// PackagePolicy methods
public function viewBills(User $user, Package $package): Response
public function approveBills(User $user, Package $package): Response
```

---

## Validation Rules

### Approve Bill

```php
[
    'comment' => 'nullable|string|max:500',
]
```

### Reject Bill

```php
[
    'reason' => 'required|in:INCORRECT_DATES,INCORRECT_AMOUNT,SERVICE_NOT_DELIVERED,DUPLICATE,OTHER',
    'comment' => 'required|string|max:500',
]
```

---

## Related Documents

- [API Endpoints Overview](./API-ENDPOINTS)
- [MOB1 Packages APIs](./mob1-packages)
- [MOB1 Statements APIs](./mob1-statements)
- [MOB1 Implementation Plan](../DESIGN)
