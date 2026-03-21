---
title: "Zoho CRM Field Reference — Cab Charge & Meals"
---

# Zoho CRM Field Reference — Cab Charge & Meals

Raw field definitions extracted from Zoho CRM on 2026-02-26 for migration reference.

---

## Cab Charge Module (`Cab_Charge`)

**Total fields**: 37 (including system fields)

### Business Fields

| API Name | Label | Data Type | Required | Pick List Values |
|---|---|---|---|---|
| `Name` | CabCharge | autonumber | auto | — |
| `Stage` | Cabcharge Stage | picklist | yes | -None-, Requested, Declaration Complete, Ordered, Sent to Recipient, Delivered, Pending Cancellation, Cancellation Lodged, Closed, Added to Plan, Agreed, Cancel, Cancelled, Finalised, Pending Closure |
| `Consumers` | Consumer | lookup → Contacts | yes | — |
| `Care_Plan` | Care Plan | lookup → Care Plans | yes | — |
| `Monthly_Budget_Limit` | Cabcharge Budget | currency | no | — |
| `Delivery_Option` | Delivery Option | picklist | no | -None-, Postage and Handling ($14.10 - 10 days), Digital Fast Card - SMS, Digital Fast Card - Email, Express Post ($12.10 - 5 days), Express Registered Post ($16.03 - 1-3 days) |
| `Card_Number1` | Card Number | text | no | — |
| `CRN` | CRN | text | no | — |
| `Tracking_Number` | Tracking Number | text | no | — |
| `Cabcharge_Start_Date` | Cabcharge Start Date | date | no | — |
| `Cabcharge_Cancellation_Date` | Cabcharge Cancellation Date | date | no | — |
| `Postal_Address` | Postal Address | textarea | no | — |
| `Digital_Fast_Card_SMS` | Fast Card - SMS | phone | no | — |
| `Verification_Email` | Verification Email | email | no | — |
| `Verification_Phone_Number` | Verification Phone Number | phone | no | — |
| `Declaration` | Declaration | boolean | no | — |
| `SMS_confirmed_by_Consumer` | SMS confirmed by Consumer | boolean | no | — |
| `Email_confirmed_by_Consumer` | Email confirmed by Consumer | boolean | no | — |
| `Replacement_card` | Replacement card | boolean | no | — |
| `Created_in_error` | Created in error | boolean | no | — |
| `Mass_Email` | Mass Email | boolean | no | — |
| `Stage_change` | Stage change | boolean | no | — |
| `Close` | Close | text | no | — |

### Stage Definitions (with active/legacy status)

| Display Value | Actual Value | Colour | Status |
|---|---|---|---|
| Requested | Requested | `#ced9ff` | **Active** |
| Declaration Complete | Declaration Complete1 | `#c9651a` | **Active** |
| Ordered | Ordered | `#25b52a` | **Active** |
| Sent to Recipient | Sent to recipient1 | `#168aef` | **Active** |
| Delivered | Delivered | `#f6c1ff` | **Active** |
| Pending Cancellation | Pending Cancellation | `#e972fd` | **Active** |
| Cancellation Lodged | Cancellation Lodged | `#add9ff` | **Active** |
| Closed | Closed | `#f8e199` | **Active** |
| Added to Plan | Added to profile | `#c4f0b3` | Legacy |
| Finalised | Declaration Complete | `#ffc6c6` | Legacy |
| Agreed | Approved | `#25b52a` | Legacy |
| Cancelled | Cancelled | `#eb4d4d` | Legacy |
| Pending Closure | Pending Closure | `#168aef` | Legacy |
| Cancel | Sent to Recipient | `#f8e199` | Legacy |

> Note: Several legacy stages have mismatched display_value vs actual_value — evidence of Zoho renaming over time. The Portal implementation should use clean, consistent values.

---

## Meals Module (`Meals`)

**Total fields**: 28 (including system fields)

### Business Fields

| API Name | Label | Data Type | Required | Pick List Values |
|---|---|---|---|---|
| `Name` | Meal Name | autonumber | auto | — |
| `Stage` | Stage | picklist | yes | -None-, Added to plan, Requested, Approved, Finalised, Cancelled |
| `Consumers` | Consumers | lookup → Contacts | yes | — |
| `Care_Plan` | Care Plan | lookup → Care Plans | yes | — |
| `Monthly_Budget` | Budget | currency | no | — |
| `Budget_Occurrence` | Budget Occurrence | picklist | no | -None-, per day, per week, per fortnight, per month |
| `Meal_Services` | Meal Services | picklist | no | -None-, Gourmet Meals, LiteNeasy, Meals in a Moment, Meals On Wheels, Other, Tender Loving Cuisine, YouFoodz |
| `State` | State | picklist | no | -None-, Queensland, New South Wales, Victoria, South Australia, Western Australia, Tasmania, Australian Capital Territory, Northern Territory |
| `Existing_customer` | Existing customer? | picklist | no | -None-, Yes, No |
| `Phone_Order_Authority` | Phone Order Authority? | picklist | no | -None-, Yes, No |
| `Consumer_Email` | Consumer Email | email | no | — |
| `CRN` | CRN | text | no | — |
| `Cancellation_Date` | Cancellation Date | date | no | — |
| `Includes_Shakes` | Includes Shakes? | picklist | no | -None-, Yes, No |

### Stage Definitions

| Display Value | Actual Value | Status |
|---|---|---|
| Added to plan | Added to profile | **Active** |
| Requested | Requested | **Active** |
| Approved | Approved | Legacy (unused) |
| Cancelled | Cancelled | **Active** |
| Finalised | Linking Accounts | **Active** |

> Note: Like Cab Charge, several actual_values don't match display_values due to Zoho renaming history.

---

## Lookup Relationships

```
Recipient (Portal model, maps to Zoho Contacts)
├── CabCharge (via recipient_id)
└── Meal (via recipient_id)

Care Plan (Portal model, maps to Zoho Service_Plans)
├── CabCharge (via care_plan_id)
└── Meal (via care_plan_id)
```

> Stage history will be built natively in Portal using event sourcing — not imported from Zoho's `Cabcharge_Stage_History` / `Stage_History_Meals` modules.
