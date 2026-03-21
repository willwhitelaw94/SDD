---
title: "Feature Specification: Service Requests — Cab Charge & Meals"
---

> **[View Mockup](/mockups/service-requests/index.html)**{.mockup-link}

# Feature Specification: Service Requests — Cab Charge & Meals

**Initiative**: Coordinator Management
**Created**: 2026-02-26
**Status**: Draft
**Source**: Zoho CRM modules `Cab_Charge` and `Meals` — migrating coordinator service request workflows from Zoho into TC Portal.

---

## Overview

Coordinators currently manage two recipient service request workflows entirely within Zoho CRM:

1. **Cab Charge** — ordering, tracking, and managing Cabcharge cards for recipient transport
2. **Meals** — ordering and managing meal delivery services for recipients

Both modules follow a similar pattern: a coordinator creates a request linked to a recipient and their care plan, the request progresses through stages, and the coordinator manages the lifecycle until closure or cancellation.

This spec covers bringing both workflows into TC Portal as first-class features, replacing the Zoho dependency for day-to-day coordinator work.

---

## Module 1: Cab Charge Requests

### Zoho Source Module: `Cab_Charge`

#### Data Model (from Zoho)

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | autonumber | auto | e.g., CC15190 |
| Stage | picklist | yes | Lifecycle stage (see below) |
| Recipient | lookup | yes | Links to Contacts (recipient) |
| Care Plan | lookup | yes | Links to recipient's care plan |
| Monthly Budget Limit | currency | no | e.g., $50, $100, $250 |
| Delivery Option | picklist | no | How the card is sent |
| Card Number | text | no | Last 4 digits of assigned card |
| CRN | text | no | Customer reference number |
| Tracking Number | text | no | Postal tracking reference |
| Cabcharge Start Date | date | no | When card becomes active |
| Cabcharge Cancellation Date | date | no | When card was cancelled |
| Postal Address | textarea | no | Delivery address for physical cards |
| Digital Fast Card - SMS | phone | no | Mobile number for digital card via SMS |
| Verification Email | email | no | Email for digital card delivery |
| Verification Phone Number | phone | no | Phone for verification |
| Declaration | boolean | no | Recipient declaration completed |
| SMS confirmed by Recipient | boolean | no | Recipient confirmed via SMS (Zoho: "SMS confirmed by Consumer") |
| Email confirmed by Recipient | boolean | no | Recipient confirmed via email (Zoho: "Email confirmed by Consumer") |
| Replacement card | boolean | no | Whether this is a replacement card request |
| Replaces Request | lookup | no | Links to the original Cab Charge request being replaced (nullable) |
| Created in error | boolean | no | Flag for erroneous records |
| Mass Email | boolean | no | Part of mass email send |
| Stage change | boolean | no | Internal trigger flag |

#### Cab Charge Stages (Lifecycle)

Active stages in Zoho (marked `type: "used"`):

| Stage | Colour | Description |
|---|---|---|
| Requested | Blue `#ced9ff` | Initial request submitted |
| Declaration Complete | Orange `#c9651a` | Recipient has signed declaration |
| Ordered | Green `#25b52a` | Card ordered from Cabcharge |
| Sent to Recipient | Blue `#168aef` | Card dispatched to recipient |
| Delivered | Purple `#f6c1ff` | Card confirmed delivered |
| Pending Cancellation | Pink `#e972fd` | Cancellation requested |
| Cancellation Lodged | Light blue `#add9ff` | Cancellation submitted to Cabcharge |
| Closed | Yellow `#f8e199` | Request completed/closed |

Unused/legacy stages: Added to Plan, Finalised, Agreed, Cancelled, Cancel, Pending Closure.

#### Delivery Options

| Option | Notes |
|---|---|
| Postage and Handling ($14.10 - 10 days) | Standard post |
| Digital Fast Card - SMS | Digital card via text message |
| Digital Fast Card - Email | Digital card via email |
| Express Post ($12.10 - 5 days) | Faster postal delivery |
| Express Registered Post ($16.03 - 1-3 days) | Tracked express delivery |

#### Sample Records

| ID | Recipient | Care Plan | Stage | Budget | Delivery | Start Date |
|---|---|---|---|---|---|---|
| CC15190 | Janfiaf FATHULLA | CP8673 | Ordered | $250 | Registered Post | 2026-02-10 |
| CC15180 | Ruth W. Morgan | CP14151 | Sent to Recipient | $100 | Postage & Handling | — |
| CC15179 | Simone Lawson | CP23269 | Sent to Recipient | $50 | Registered Post | 2026-02-10 |

#### Related Module: `Cabcharge_Stage_History`

Tracks stage transitions with fields: Stage, Modified By, Modified Time, Duration (Days), Moved To, Cabcharge Start Date. Links back to the parent `Cab_Charge` record.

---

## Module 2: Meal Service Requests

### Zoho Source Module: `Meals`

#### Data Model (from Zoho)

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | autonumber | auto | e.g., 10408 |
| Stage | picklist | yes | Lifecycle stage (see below) |
| Recipient | lookup | yes | Links to Contacts (recipient) |
| Care Plan | lookup | yes | Links to recipient's care plan |
| Monthly Budget | currency | no | Budget amount |
| Budget Occurrence | picklist | no | per day / per week / per fortnight / per month |
| Meal Services | picklist | no | Meal provider (see below) |
| State | picklist | no | Australian state |
| Existing customer | picklist | no | Yes / No |
| Phone Order Authority | picklist | no | Yes / No |
| Recipient Email | email | no | Contact email for meal provider |
| CRN | text | no | Customer reference number |
| Cancellation Date | date | no | When service was cancelled |
| Includes Shakes | picklist | no | Yes / No |

#### Meal Stages (Lifecycle)

| Stage | Description |
|---|---|
| Added to plan | Initial — added to recipient's care plan |
| Requested | Request submitted to meal provider |
| Approved | Provider has approved the order |
| Finalised | Service set up and active |
| Cancelled | Service cancelled |

#### Meal Service Providers

| Provider |
|---|
| Gourmet Meals |
| LiteNeasy |
| Meals in a Moment |
| Meals On Wheels |
| Tender Loving Cuisine |
| YouFoodz |
| Other |

#### Australian States

Queensland, New South Wales, Victoria, South Australia, Western Australia, Tasmania, Australian Capital Territory, Northern Territory.

#### Budget Occurrence Options

per day, per week, per fortnight, per month.

#### Sample Records

| ID | Recipient | Care Plan | Stage | Provider | Budget | Occurrence | State |
|---|---|---|---|---|---|---|---|
| 10408 | Colleen Gill | CP25991 | Added to plan | LiteNeasy | $40 | per week | — |
| 10406 | Francis Day | CP20394 | Requested | LiteNeasy | $50 | per fortnight | SA |
| 10407 | Patricia Bainbridge | CP2791 | Added to plan | Other | $220 | per month | VIC |

#### Related Module: `Stage_History_Meals`

Tracks stage transitions with fields: Stage, Modified By, Modified Time, Duration (Days), Moved To. Links back to the parent `Meals` record.

---

## User Scenarios & Testing

### User Story 1 — View Cab Charge Requests for a Recipient (Priority: P1)

As a **Coordinator**, I want to see all Cab Charge requests for a recipient on their profile — so that I can understand what transport support is in place without switching to Zoho.

**Acceptance Scenarios**:

1. **Given** a Coordinator navigates to a recipient's profile, **When** they open the Cab Charge section, **Then** they see a list of all Cab Charge requests with ID, Stage, Budget, Delivery Option, and Start Date
2. **Given** there are no Cab Charge requests for the recipient, **When** the section loads, **Then** an empty state is shown with a prompt to create a new request
3. **Given** a request is in "Pending Cancellation" stage, **When** the Coordinator views the list, **Then** the stage is highlighted with the appropriate colour indicator

---

### User Story 2 — Create a Cab Charge Request (Priority: P1)

As a **Coordinator**, I want to create a new Cab Charge request for a recipient — so that I can initiate the process of getting them a transport card.

**Acceptance Scenarios**:

1. **Given** a Coordinator is on a recipient's profile, **When** they click "New Cab Charge Request", **Then** a form opens pre-filled with the recipient and their single active care plan (recipients only have one active care plan at a time)
2. **Given** the Coordinator selects a delivery option and sets a monthly budget, **When** they submit the form, **Then** the request is created in "Requested" stage
3. **Given** the Coordinator selects "Digital Fast Card - SMS", **When** the form is shown, **Then** a mobile number field becomes required
4. **Given** the Coordinator selects "Digital Fast Card - Email", **When** the form is shown, **Then** a verification email field becomes required
5. **Given** the Coordinator selects a physical delivery option, **When** the form is shown, **Then** the postal address field becomes visible
6. **Given** the recipient already has an active (non-Closed/non-Cancelled) Cab Charge request, **When** the Coordinator clicks "New Cab Charge Request", **Then** a warning is shown (e.g., "This recipient already has an active Cab Charge request — CC15190 (Ordered)") but the Coordinator can proceed
7. **Given** a Coordinator is creating a replacement card, **When** they tick "Replacement card" and select the original request from a dropdown of the recipient's existing Cab Charge requests, **Then** the new request is linked to the original, and the original request is automatically moved to "Pending Cancellation"

---

### User Story 3 — Progress Cab Charge Through Stages (Priority: P1)

As a **Coordinator**, I want to move a Cab Charge request through its lifecycle stages — so that I can track the end-to-end process from request to delivery.

**Acceptance Scenarios**:

1. **Given** a request is in "Requested" stage, **When** the recipient completes their declaration, **Then** the Coordinator ticks a "Declaration" checkbox confirming the recipient has declared (verbally or via external paper form) and can move it to "Declaration Complete". *(Phase 2: replace checkbox with in-Portal declaration form/document for digital signing)*
2. **Given** a request is in "Declaration Complete" stage, **When** the card is ordered, **Then** the Coordinator can move it to "Ordered"
3. **Given** a request is in "Ordered" stage, **When** the card is dispatched, **Then** the Coordinator can move it to "Sent to Recipient" and optionally add a tracking number
4. **Given** a request is in "Sent to Recipient" stage, **When** delivery is confirmed, **Then** the Coordinator can move it to "Delivered" and optionally add the card number (last 4 digits)
5. **Given** a request is in any active stage, **When** cancellation is needed, **Then** the Coordinator can move it to "Pending Cancellation" → "Cancellation Lodged" → "Closed"

---

### User Story 4 — View Meal Requests for a Recipient (Priority: P1)

As a **Coordinator**, I want to see all Meal service requests for a recipient — so that I can manage their meal delivery services in one place.

**Acceptance Scenarios**:

1. **Given** a Coordinator navigates to a recipient's profile, **When** they open the Meals section, **Then** they see a list of all meal requests with ID, Stage, Provider, Budget, Occurrence, and State
2. **Given** there are no Meal requests for the recipient, **When** the section loads, **Then** an empty state is shown with a prompt to create a new request
3. **Given** a meal request has `Includes Shakes: Yes`, **When** the Coordinator views the detail, **Then** this is clearly indicated

---

### User Story 5 — Create a Meal Service Request (Priority: P1)

As a **Coordinator**, I want to create a new Meal service request for a recipient — so that I can set up meal delivery through their care plan.

**Acceptance Scenarios**:

1. **Given** a Coordinator is on a recipient's profile, **When** they click "New Meal Request", **Then** a form opens pre-filled with the recipient and their single active care plan
2. **Given** the Coordinator selects a meal provider, sets a budget amount and occurrence, and indicates the state, **When** they submit, **Then** the request is created in "Added to plan" stage
3. **Given** the Coordinator selects "Other" as the meal provider, **When** the form is shown, **Then** they can proceed without a specific provider name (the provider will be determined later)
4. **Given** the Coordinator indicates this is an existing customer (`Yes`), **When** viewing the request, **Then** this fact is recorded for the meal provider's reference
5. **Given** the recipient's email is known, **When** creating the request, **Then** the recipient email field is pre-filled from their profile

---

### User Story 6 — Progress Meal Request Through Stages (Priority: P1)

As a **Coordinator**, I want to move a Meal request through its lifecycle stages — so that I can track the process from initial plan through to active service.

**Acceptance Scenarios**:

1. **Given** a request is in "Added to plan" stage, **When** the coordinator submits the order to the provider, **Then** they can move it to "Requested"
2. **Given** a request is in "Requested" stage, **When** the provider approves, **Then** the Coordinator can move it to "Approved"
3. **Given** a request is in "Approved" stage, **When** the service is set up and active, **Then** the Coordinator can move it to "Finalised"
4. **Given** a request is in any active stage, **When** the service needs to be cancelled, **Then** the Coordinator can move it to "Cancelled" and a cancellation date is recorded

---

### User Story 7 — Edit Service Request Details (Priority: P2)

As a **Coordinator**, I want to edit the details of an existing Cab Charge or Meal request — so that I can update information as circumstances change.

**Acceptance Scenarios**:

1. **Given** a Cab Charge request exists, **When** the Coordinator edits it, **Then** they can update the monthly budget, delivery option, postal address, card number, tracking number, and verification details
2. **Given** a Meal request exists, **When** the Coordinator edits it, **Then** they can update the budget, occurrence, provider, state, existing customer status, phone order authority, and shakes inclusion
3. **Given** a request is in "Closed" or "Cancelled" stage, **When** the Coordinator views it, **Then** editing is restricted to read-only
4. **Given** a recipient's care plan is closed/exited (deceased, withdrawn, package ended), **When** the system processes the exit, **Then** all active (non-Closed/non-Cancelled) Cab Charge and Meal requests are automatically moved to "Cancelled" with a system note recording the reason (e.g., "Auto-cancelled: care plan CP8673 closed")

---

### User Story 8 — View Stage History (Priority: P3)

As a **Coordinator**, I want to see the stage transition history for a service request — so that I can understand when each stage change happened and how long each stage took.

**Acceptance Scenarios**:

1. **Given** a Cab Charge request has been through multiple stages, **When** the Coordinator views the history, **Then** they see each stage transition with the date, who made the change, and the duration in days
2. **Given** a Meal request has been through multiple stages, **When** the Coordinator views the history, **Then** they see the same transition timeline

---

## Existing Codebase Context

### Cab Charge — Bill Import Integration

Cab Charge already exists in the bill import system as a supplier:

- **Enum**: `BillImportSupplierEnum::CAB_CHARGE` — ABN `22615032427`, MYOB Vendor `SUPP000648`
- **Service mapping**: Transport → Direct transport
- **Tax handling**: Dynamic GST based on `total_gst` column (GST Included or No GST)
- **File**: `app/Enums/Bill/BillImportSupplierEnum.php`

The new Cab Charge request module is separate from bill import — it manages the card ordering lifecycle, not invoice processing.

### Meals — Feature Branch `feature/meals-module`

Active development exists on the `feature/meals-module` branch with:

- **Domain**: `domain/Meal/` — Model, Actions (Create/Edit/Show/Store), Data class, Factory
- **Pages**: `resources/js/Pages/Staff/Meals/` — Index, Create, Edit, Show
- **Enums**: `domain/Need/Enums/Meals/` — MealSupportTypeEnum, SpecialDietaryNeedsEnum
- **Navigation**: Added to staff sidebar
- **Latest commit**: `c2821b1922` — "fix(meals): address PR review critical issues" (Feb 24, 2026)

The existing branch has 7 commits and aligns enum values with Zoho CRM. This spec should be reconciled with that in-flight work.

### UI Placement

Both modules appear as **tabs on the recipient's staff profile page**, alongside existing sections (needs, risks, budget, etc.). There is no standalone global list page — coordinators access requests in the context of the recipient they're managing.

> **Note**: The existing `feature/meals-module` branch uses a standalone Staff sidebar page (`/staff/meals`). This should be migrated to the recipient profile tab pattern to match this spec.

### Shared Patterns

Both modules follow the same pattern as other recipient-linked entities in the portal:
- Linked to a recipient (Contact) and care plan
- Stage-based lifecycle with history tracking
- Coordinator-managed CRUD operations
- Accessed from the recipient's staff profile as tabs

---

## Technical Considerations

### Zoho Sync Strategy: Read from Zoho, Write to Portal

- **Historical records**: Import/display existing Zoho records (15,000+ Cab Charge, 10,000+ Meals estimated) as read-only in Portal
- **New records**: All new Cab Charge and Meal requests are created and managed exclusively in Portal
- **No write-back**: Portal does not sync data back to Zoho — Zoho becomes a historical archive
- **Stage history**: Import `Cabcharge_Stage_History` and `Stage_History_Meals` for historical context on migrated records
- **Cutover**: Once Portal modules are live, coordinators stop using Zoho for these workflows

### Shared Architecture

- Both modules are structurally identical: recipient lookup + care plan lookup + picklist stages + metadata fields
- Consider a shared `ServiceRequest` base pattern or trait to avoid duplication
- Stage transition logic could share a common `StageTransitionAction` pattern

### Authorization

- **Any staff member with access to the recipient** can create, edit, and progress Cab Charge and Meal requests
- No new permission model required — piggybacks on existing recipient access controls
- Matches Zoho's broad access pattern where all profiles have read/write

### Feature Flags

- Use Laravel Pennant to control rollout independently for each module
- Existing staff sidebar navigation for Meals is already on the feature branch

---

## Clarifications

### Session 2026-02-26
- Q: What is the Zoho sync strategy? -> A: Read from Zoho (historical), write to Portal (new records). No write-back to Zoho.
- Q: Where do Cab Charge and Meals live in the Portal UI? -> A: Tabs on the recipient's staff profile page (not standalone pages).
- Q: Who can manage service requests? -> A: Any staff member with access to the recipient. No new permission model needed.
- Q: How to handle multiple active care plans? -> A: Not applicable — recipients only have one active care plan at a time. Auto-link.
- Q: "Consumer" vs "Recipient" terminology? -> A: Use "Recipient" throughout to match existing Portal codebase convention.
- Q: Can a recipient have multiple active Cab Charge requests? -> A: Yes, but show a warning when creating a second active request. No hard block.
- Q: What happens to active requests when a recipient exits? -> A: Auto-cancel all active requests with a system note recording the reason.
- Q: What is the Cab Charge declaration? -> A: v1 = checkbox (coordinator confirms external declaration). Phase 2 = in-Portal declaration form for digital signing.
- Q: Replacement card workflow? -> A: New request linked to original. Original auto-moves to "Pending Cancellation". Dropdown to select which request is being replaced.
- Q: Should stage changes trigger notifications? -> A: No notifications in v1. Stage changes recorded in history only.
