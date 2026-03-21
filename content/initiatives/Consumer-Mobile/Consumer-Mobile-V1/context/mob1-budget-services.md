---
title: "MOB1 - Budget & Services"
description:
---

**Endpoints**: 5
**Build Effort**: Low - mostly exists

---

## Overview

Budget items define how package funds are allocated across service categories. Suppliers provide the services and are tracked against budget items. Funding endpoints show quarterly allocations.

---

## Endpoints

| Endpoint                                       | Method | Status | Notes                             |
|------------------------------------------------|--------|--------|-----------------------------------|
| `/api/v1/recipient/packages/{id}/budget-items` | GET    | ✅      | View budget items                 |
| `/api/v1/recipient/packages/{id}/suppliers`    | GET    | ✅      | View suppliers                    |
| `/api/v1/recipient/packages/{id}/suppliers`    | POST   | 🔨     | Add supplier to service plan      |
| `/api/v1/recipient/packages/{id}/funding`      | GET    | 🔨     | Funding streams (current quarter) |
| `/api/v1/recipient/packages/{id}/funding/next` | GET    | 🔨     | Next quarter (optional)           |

---

## GET /api/v1/recipient/packages/{id}/budget-items

**Purpose**: List all budget items (service categories) and their allocations.

**Authorization**: User must have access to the package

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Personal Care",
      "description": "Assistance with daily activities like showering, dressing, and grooming",
      "category": "CARE_SERVICES",
      "allocated": 8000.00,
      "spent": 2340.00,
      "committed": 1200.00,
      "available": 4460.00,
      "utilization": 44.25,
      "suppliers_count": 2
    },
    {
      "id": 2,
      "name": "Domestic Assistance",
      "description": "Help with housework, laundry, and meal preparation",
      "category": "CARE_SERVICES",
      "allocated": 3500.00,
      "spent": 890.00,
      "committed": 450.00,
      "available": 2160.00,
      "utilization": 38.29,
      "suppliers_count": 1
    },
    {
      "id": 3,
      "name": "Transport",
      "description": "Transport to appointments and social activities",
      "category": "CARE_SERVICES",
      "allocated": 2000.00,
      "spent": 150.00,
      "committed": 0.00,
      "available": 1850.00,
      "utilization": 7.5,
      "suppliers_count": 0
    }
  ],
  "meta": {
    "total_allocated": 25000.00,
    "total_spent": 6830.00,
    "total_committed": 3170.00,
    "total_available": 15000.00,
    "overall_utilization": 40.0
  }
}
```

---

## GET /api/v1/recipient/packages/{id}/suppliers

**Purpose**: List all suppliers providing services to the package.

**Authorization**: User must have access to the package

**Query Parameters**:
- `budget_item_id` - Filter by budget item
- `status` - Filter by status (active, inactive)

**Response**:
```json
{
  "data": [
    {
      "id": 5,
      "name": "ABC Home Care",
      "abn": "12 345 678 901",
      "trading_name": "ABC Care Services",
      "contact": {
        "email": "accounts@abchomecare.com.au",
        "phone": "1300 123 456",
        "website": "https://abchomecare.com.au"
      },
      "address": {
        "street": "123 Service St",
        "suburb": "Melbourne",
        "state": "VIC",
        "postcode": "3000"
      },
      "services": [
        {
          "budget_item": "Personal Care",
          "rate": 65.00,
          "unit": "hour",
          "frequency": "Daily"
        }
      ],
      "status": "ACTIVE",
      "total_spent": 2340.00,
      "last_service_date": "2024-01-19"
    },
    {
      "id": 8,
      "name": "Clean & Tidy Services",
      "abn": "98 765 432 109",
      "trading_name": "Clean & Tidy",
      "contact": {
        "email": "hello@cleanandtidy.com.au",
        "phone": "0412 345 678"
      },
      "services": [
        {
          "budget_item": "Domestic Assistance",
          "rate": 45.00,
          "unit": "hour",
          "frequency": "Weekly"
        }
      ],
      "status": "ACTIVE",
      "total_spent": 890.00,
      "last_service_date": "2024-01-18"
    }
  ]
}
```

---

## POST /api/v1/recipient/packages/{id}/suppliers

**Purpose**: Add a supplier to the package service plan.

**Authorization**: User must have access to the package

**Status**: 🔨 Not yet implemented (Phase 1 is read-only)

**Expected Request**:
```json
{
  "supplier_id": 12,
  "budget_item_id": 1,
  "rate": 65.00,
  "unit": "hour",
  "frequency": "DAILY",
  "start_date": "2024-02-01",
  "notes": "Morning personal care assistance"
}
```

**Expected Response**: Returns the supplier relationship

**Note**: Phase 1 uses Intercom shortcuts for this action

---

## GET /api/v1/recipient/packages/{id}/funding

**Purpose**: Show funding allocation for current quarter.

**Authorization**: User must have access to the package

**Status**: 🔨 Not yet implemented

**Expected Response**:
```json
{
  "data": {
    "quarter": "Q1 2024",
    "start_date": "2024-01-01",
    "end_date": "2024-03-31",
    "streams": [
      {
        "type": "GOVERNMENT_SUBSIDY",
        "amount": 6500.00,
        "received": true,
        "received_date": "2024-01-01"
      },
      {
        "type": "RECIPIENT_CONTRIBUTION",
        "amount": 0.00,
        "description": "No income-tested fee applicable"
      }
    ],
    "total": 6500.00,
    "status": "RECEIVED"
  }
}
```

---

## GET /api/v1/recipient/packages/{id}/funding/next

**Purpose**: Preview next quarter's expected funding.

**Authorization**: User must have access to the package

**Status**: 🔨 Not yet implemented (optional for Phase 1)

**Expected Response**: Same structure as current funding endpoint

---

## Budget Item Categories

| Category          | Description                  | Examples                              |
|-------------------|------------------------------|---------------------------------------|
| `CARE_SERVICES`   | Direct care provision        | Personal care, nursing, therapy       |
| `SUPPORT_SERVICES`| Household and community      | Domestic help, transport, meals       |
| `EQUIPMENT`       | Aids and equipment           | Walking frame, shower chair           |
| `MODIFICATIONS`   | Home modifications           | Ramps, rails, bathroom modifications  |
| `MANAGEMENT`      | Package management           | Care coordination, admin fees         |

---

## Implementation Notes

### Related Models

- `Domain\BudgetItem\Models\BudgetItem`
- `Domain\Supplier\Models\Supplier`
- `Domain\PackageSupplier\Models\PackageSupplier`
- `Domain\FundingStream\Models\FundingStream`

### Budget Calculations

```php
available = allocated - (spent + committed)
utilization = (spent / allocated) * 100
```

### Supplier Status

| Status     | Description                      |
|------------|----------------------------------|
| `ACTIVE`   | Currently providing services     |
| `INACTIVE` | No longer providing services     |
| `PENDING`  | Agreement not yet finalized      |

---

## Phase 1 Limitations

In Phase 1 (MOB1), the budget and services section is **read-only**:
- View budget allocations and spending
- View suppliers and services
- Cannot add/edit suppliers (use Intercom)
- Cannot request funding changes (use Intercom)

Phase 2 (MOB2) will add:
- Add suppliers to service plan
- Request budget reallocation
- Find new services in marketplace

---

## Related Documents

- [API Endpoints Overview](./API-ENDPOINTS)
- [MOB1 Packages APIs](./mob1-packages)
- [MOB1 Bills APIs](./mob1-bills)
- [MOB1 Implementation Plan](../DESIGN)
