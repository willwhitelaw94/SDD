---
title: "Services Australia API"
description: "REST API integration for Support at Home (SaH) program invoicing and claims"
---


**Last Updated**: 2025-10-28
**Status**: Active Integration
**Related Systems**: Support at Home (SaH), Invoice Processing, Claims Management

---

## Table of Contents

- [Overview](#overview)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Key Data Models](#key-data-models)
- [Invoice Lifecycle](#invoice-lifecycle)
- [Business Rules](#business-rules)
- [Error Handling](#error-handling)
- [Integration Architecture](#integration-architecture)

---

## Overview

Services Australia provides REST APIs for the Support at Home (SaH) program that enable aged care providers to:
- Submit invoices for services delivered to care recipients
- Query invoice and claim status
- Manage funding allocations and claims
- Upload supporting documentation

### Base URLs

- **Test Environment**: `https://test.healthclaiming.api.humanservices.gov.au/claiming/ext-vnd/acws/service/support-at-home`
- **Production**: (TBD - pending Services Australia availability)

### API Version

- Current Version: **v1**
- Protocol: HTTPS only
- Format: JSON (application/json)
- Spec: OpenAPI 2.0 (Swagger)

### Integration Status

- **Test Environment**: Active for development and testing
- **CSV Portal**: Government portal for CSV-based invoicing expected Nov 1, 2025
- **Production API**: TBD - awaiting Services Australia production environment

---

## API Endpoints

### Invoice Management

#### 1. Create Invoice
```
POST /invoice/v1
```

**Purpose**: Create a new invoice (draft or auto-submit)

**Parameters**:
- `submit` (query, boolean): Auto-submit invoice (`true`) or create as OPEN (`false`, default)

**Request Body**: Invoice object with items

**Response**:
- `201 Created`: Invoice created
- `400 Bad Request`: Validation errors

**Headers**:
- Response includes `etag` for versioning

#### 2. Query Invoices
```
GET /invoice/v1
```

**Purpose**: Search and filter invoices

**Query Parameters**:
- `serviceNapsId` (string, max 5): NAPS Identifier
- `serviceProviderId` (string, max 10): Services Australia ID
- `externalReferenceId` (string): External identifier (e.g., TC Portal invoice ID)
- `status` (enum): OPEN, SUBMITTED, HELD, DELETED, CLAIMED, COMPLETED
- `updatedAtDateTimeFrom` (datetime): Start of date range
- `updatedAtDateTimeTo` (datetime): End of date range
- `limit` (int, 1-10000, default 10): Results per page
- `page` (int, min 1, default 1): Page number
- `sort-fields` (enum): createdAtDateTime, updatedAtDateTime, externalReferenceId
- `sort` (enum): asc, desc (default: desc)

**Response**: Array of InvoiceSummary objects

#### 3. Get Invoice Details
```
GET /invoice/v1/{invoiceId}
```

**Purpose**: Retrieve full invoice details including all items

**Path Parameters**:
- `invoiceId` (string, required): Invoice unique identifier

**Response**: Complete Invoice object with items array

#### 4. Submit Invoice
```
POST /invoice/v1/{invoiceId}/submit
```

**Purpose**: Change invoice status from OPEN to SUBMITTED

**Headers** (required):
- `if-match` (string): Invoice etag from previous GET/POST

**Response**: InvoiceSummary with updated status

#### 5. Re-open Invoice
```
POST /invoice/v1/{invoiceId}/open
```

**Purpose**: Change invoice status from SUBMITTED back to OPEN for editing

**Headers** (required):
- `if-match` (string): Invoice etag

**Response**: InvoiceSummary with OPEN status

#### 6. Delete Invoice
```
POST /invoice/v1/{invoiceId}/delete
```

**Purpose**: Delete an invoice (status becomes DELETED, no longer editable/claimable)

**Headers** (required):
- `if-match` (string): Invoice etag

**Response**: InvoiceSummary with DELETED status

### Item Management

#### 7. Add Item to Invoice
```
POST /invoice/v1/{invoiceId}/item
```

**Purpose**: Add a line item to an existing invoice (max 9999 items per invoice)

**Request Body**: Item object

**Response**:
- `201 Created`: Item added
- Includes item `etag` in header

#### 8. Get Item Details
```
GET /invoice/v1/{invoiceId}/item/{itemId}
```

**Purpose**: Retrieve specific item details

**Response**: Item object with etag

#### 9. Update Item
```
PUT /invoice/v1/{invoiceId}/item/{itemId}
```

**Purpose**: Update an existing item (only OPEN items can be edited)

**Headers** (required):
- `if-match` (string): Item etag

**Request Body**: Updated Item object

**Response**: `204 No Content`

#### 10. Delete Item
```
DELETE /invoice/v1/{invoiceId}/item/{itemId}
```

**Purpose**: Delete an item from an invoice

**Headers** (required):
- `if-match` (string): Item etag

**Response**: `204 No Content`

### Attachments

#### 11. Upload Attachment
```
POST /invoice/v1/{invoiceId}/item/{itemId}/attachments
```

**Purpose**: Upload supporting documentation (PDF)

**Request Body**: AttachmentUpload object with base64-encoded PDF

**Response**: `204 No Content`

**Notes**:
- Required for late submissions (>60 days after budget period)
- Required for certain service types and funding sources
- Format: PDF only

#### 12. Retrieve Attachment
```
GET /invoice/v1/{invoiceId}/attachments/{attachmentId}
```

**Purpose**: Download attachment PDF

**Response**: PDF file (application/pdf)

---

## Authentication

### Method
Basic Authentication with Client ID header

### Required Headers

All API calls require:

```
Authorization: Basic {base64(email:api_token)}
dhs-auditId: {audit_identifier}
dhs-auditIdType: {identifier_type}
dhs-subjectId: {subject_identifier}
dhs-subjectIdType: {subject_type}
dhs-productId: {product_identifier}
dhs-messageId: {unique_message_id}
dhs-correlationId: {correlation_identifier}
X-IBM-Client-Id: {client_id}
x-requested-with: XMLHttpRequest (for POST/PUT/DELETE)
```

### Configuration

Credentials stored in:
- `.claude/settings.local.json` (Jira/Confluence credentials)
- Services Australia specific credentials TBD

---

## Key Data Models

### Invoice

```json
{
  "invoiceId": "12345",              // Read-only, assigned by SA
  "serviceNapsId": "12345",          // NAPS Identifier (5 chars)
  "serviceProviderId": "40123234",   // SA Provider ID (10 chars, required)
  "externalReferenceId": "TC-INV-001", // Our internal reference (24 chars)
  "status": "OPEN",                   // OPEN|SUBMITTED|HELD|DELETED|CLAIMED|COMPLETED
  "createdAtDateTime": "2025-10-28T10:00:00Z",
  "updatedAtDateTime": "2025-10-28T10:00:00Z",
  "items": [/* Array of Item objects */]
}
```

### Item

```json
{
  "itemId": "12345",                              // Read-only
  "externalReferenceId": "TC-ITEM-001",           // Our reference (24 chars)
  "itemStatus": "OPEN",                            // OPEN|DELETED|COMPLETED
  "careRecipientId": "12345",                     // SA Care Recipient ID (10 chars, required, immutable)
  "careRecipientFirstName": "John",               // Read-only
  "careRecipientLastName": "Smith",               // Read-only

  // Service Classification (Read-only, derived from serviceId)
  "serviceGroupId": "SERG-0001",                  // e.g., Home support
  "serviceGroupText": "Home support",
  "serviceTypeId": "SERT-0001",                   // e.g., Home maintenance
  "serviceTypeText": "Home maintenance",
  "serviceId": "SERV-0001",                       // Required, immutable
  "serviceText": "House cleaning",

  // Core Fields (Required)
  "deliveryDate": "2025-10-01",                   // Date service delivered (immutable)
  "quantity": 2.0,                                // Min 0, multiple of 0.25 (for hours)
  "pricePerUnit": 50.00,                          // Min 0, multiple of 0.01
  "unitType": "hours",                            // hours|trip|item|bill|voucher|meal

  // Funding
  "fundingSource": "ON",                          // ON|AT|CM|EL|HM|RC|AS
  "fundingSourceText": "Home Support ongoing",    // Read-only

  // Third Party & Item Type
  "deliveredByThirdParty": false,                 // Boolean
  "itemOrWraparound": "ITEM",                     // ITEM|WRAPAROUND

  // Item Details (Conditional based on itemOrWraparound)
  "functionCode": "12 22",                        // Read-only, derived
  "functionText": "Walking, manipulated by one arm",
  "itemDescriptionCode": "12 22 34",             // Required for ITEM type
  "itemDescriptionText": "Finger orthoses",
  "itemDescription": "Custom description...",     // Free text (500 chars, conditional)

  // Wraparound Details (Conditional)
  "wraparoundDescriptionCode": "WRAP-001",
  "wraparoundDescriptionText": "Installation",
  "wraparoundDescription": "Custom description...", // Free text (500 chars)

  // Clinical
  "prescribedItem": "N",                          // Y|N
  "healthProfessionalTypeCode": "SERV-0027",      // Conditional
  "healthProfessionalTypeText": "Allied health",
  "healthProfessionalTypeOther": "Description...", // Free text (500 chars, conditional)

  // AT/HM Specific
  "purchaseMethodType": "PURCHASED",              // PURCHASED|LOANED (conditional)
  "loanedByOrganisationName": "Pharmacy",         // Conditional when LOANED
  "loanedByInvoiceNumber": "INV-12345",          // Conditional when LOANED
  "itemFirstPayment": true,                       // Required for HM

  // Late Submission
  "lateSubmissionReasonCode": "LATE-001",        // Required if >60 days
  "lateSubmissionReasonText": "Delayed processing",
  "lateSubmissionJustification": "Due to...",    // Required if reason is "Other"

  // Attachments
  "attachmentProvided": false,                    // Read-only
  "attachmentRequired": false,                    // Read-only
  "furtherInformationRequired": false,            // Read-only

  "createdAtDateTime": "2025-10-28T10:00:00Z",
  "updatedAtDateTime": "2025-10-28T10:00:00Z",
  "attachments": [/* Array of Attachment objects */]
}
```

### Attachment

```json
{
  "attachmentId": "12345",
  "type": "LATE_SUBMISSION_EVIDENCE",
  "fileName": "evidence.pdf",
  "uploadedAtDateTime": "2025-10-28T10:00:00Z"
}
```

---

## Invoice Lifecycle

### Status Flow

```
OPEN → SUBMITTED → HELD → CLAIMED → COMPLETED
  ↓         ↓
DELETED   DELETED
```

### Status Descriptions

| Status | Description | Actions Allowed |
|--------|-------------|-----------------|
| **OPEN** | Draft invoice, items can be edited | Add/Edit/Delete items, Submit, Delete invoice |
| **SUBMITTED** | Ready to be claimed | Re-open (back to OPEN), Delete invoice |
| **HELD** | Held by Services Australia pending approval | None (wait for SA action) |
| **DELETED** | Invoice deleted | None (terminal state) |
| **CLAIMED** | Claim in progress | None |
| **COMPLETED** | Claim paid | None (terminal state) |

### Workflow

1. **Create Invoice**: POST `/invoice/v1` with `submit=false` → Status: OPEN
2. **Add Items**: POST `/invoice/v1/{invoiceId}/item` for each service delivered
3. **Edit Items**: PUT `/invoice/v1/{invoiceId}/item/{itemId}` (only in OPEN status)
4. **Upload Attachments**: POST `/invoice/v1/{invoiceId}/item/{itemId}/attachments` (if required)
5. **Submit**: POST `/invoice/v1/{invoiceId}/submit` → Status: SUBMITTED
6. **SA Processing**: Automatic → HELD → CLAIMED → COMPLETED

### Alternative: Auto-Submit

Create invoice with `submit=true` to skip OPEN status and go directly to SUBMITTED.

---

## Business Rules

### Invoice Rules

1. **Max Items**: 9999 items per invoice
2. **Provider ID**: Must be valid Services Australia provider ID
3. **External Reference**: Use TC Portal invoice ID for traceability
4. **Versioning**: Always use `etag` in `if-match` header for updates

### Item Rules

1. **Care Recipient**: Must be valid SA care recipient ID (immutable after creation)
2. **Service ID**: Must be from approved service list (immutable after creation)
3. **Delivery Date**: Cannot be changed after creation
4. **Quantity**:
   - Minimum: 0
   - For hours: Multiple of 0.25 (15-minute intervals)
   - Round up if between intervals (e.g., 3h 8m → 3h 15m = 3.25)
5. **Price**: Minimum 0, multiple of 0.01 (cent precision)

### Funding Source Rules

Different service groups allow different funding sources:

- **SERG-0001 (Home Support)**: ON, AT, CM, EL, HM, RC, AS
- **SERG-0002 (Assistive Technology)**: AT, AS
- **SERG-0003 (Home Modifications)**: HM

See `config/support-at-home.php` allocation rules.

### Conditional Fields

#### Required for ALL Items
- `careRecipientId`, `serviceId`, `deliveryDate`, `quantity`, `pricePerUnit`

#### Required for ITEM Type
- `itemDescriptionCode` (from reference data)
- `itemDescription` (if `freeTextRequired` is true in reference data)

#### Required for WRAPAROUND Type
- `wraparoundDescriptionCode`
- `wraparoundDescription` (if code is "Other")

#### Required for AT Above High Tier Cap
- `purchaseMethodType` (PURCHASED or LOANED)
- If LOANED:
  - `loanedByOrganisationName`
  - `loanedByInvoiceNumber`

#### Required for Home Modifications
- `itemFirstPayment` (boolean)

#### Required for Late Submission (>60 days after budget period)
- `lateSubmissionReasonCode`
- `lateSubmissionJustification` (if reason is "Other")
- Attachment upload (PDF evidence)

#### Required Based on Service
- `healthProfessionalTypeCode` (when service requires health professional)
- `healthProfessionalTypeOther` (if `freeTextRequired` for the code)
- `unitType` (required when not defined in service reference data)

---

## Error Handling

### HTTP Status Codes

- `200 OK`: Successful GET request
- `201 Created`: Resource created
- `204 No Content`: Successful update/delete
- `400 Bad Request`: Validation error (see response body for details)
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: Not authorized for this resource
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Version mismatch (etag issue)

### Error Response Format

```json
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "careRecipientId is required",
      "field": "careRecipientId"
    }
  ]
}
```

### Common Errors

1. **Missing etag**: Include `if-match` header for PUT/POST/DELETE on existing resources
2. **Etag mismatch**: Resource was modified, fetch latest and retry
3. **Immutable field**: Cannot change `careRecipientId`, `serviceId`, `deliveryDate` after creation
4. **Status constraint**: Can only edit items in OPEN invoices
5. **Conditional field missing**: Check `furtherInformationRequired` flag in GET response

---

## Integration Architecture

### TC Portal → Services Australia Flow

```
TC Portal                Services Australia
---------                ------------------
1. User submits bill
2. Validate bill
3. Map to SA format
4. Create invoice        → POST /invoice/v1
5. Store invoiceId       ← 201 Created
6. Add items             → POST /invoice/v1/{id}/item (x N)
7. Store itemIds         ← 201 Created
8. Upload attachments    → POST .../item/{id}/attachments (if needed)
9. Submit invoice        → POST /invoice/v1/{id}/submit
10. Poll status          → GET /invoice/v1/{id}
11. Update local status  ← SUBMITTED → HELD → CLAIMED → COMPLETED
```

### Synchronization Pattern

```php
// domain/Funding/Jobs/SyncServicesAustraliaInvoiceStatusJob.php
// Runs on schedule to poll invoice status from SA API
```

### Data Mapping

| TC Portal Field | SA API Field | Notes |
|-----------------|--------------|-------|
| `bills.id` | `externalReferenceId` | Invoice level |
| `bill_items.id` | `item.externalReferenceId` | Item level |
| `packages.external_id` | `careRecipientId` | SA package ID |
| `services.external_code` | `serviceId` | Must be from SA service list |
| `bill_items.delivery_date` | `deliveryDate` | |
| `bill_items.quantity` | `quantity` | Convert to 0.25 intervals |
| `bill_items.rate` | `pricePerUnit` | Supplier rate (excl. fees) |
| `funding_streams.code` | `fundingSource` | ON, RC, EL, etc. |

### Fee Calculation (Portal Responsibility)

Services Australia API expects **supplier amounts** (excluding TC/CC fees).

Fees are calculated in TC Portal:
- **Supplier Amount**: What provider receives
- **TC Fee**: 10% of (Supplier Amount + CC Fee)
- **CC Fee**: 20% of Supplier Amount (if SM+)
- **Total Package Debit**: Supplier Amount + TC Fee + CC Fee

Example:
```
Supplier submits: $100
CC Fee (20%): $20
TC Fee (10% of $120): $12
Total package debit: $132

SA API item.pricePerUnit: $100 (supplier amount only)
```

See [support-at-home---myob-structure.md](support-at-home---myob-structure.md) for MYOB accounting.

---

## Reference Data APIs

Services Australia provides reference data APIs for:

1. **Service List**: Available services, service groups, service types
2. **Item List**: AT/HM item codes and descriptions
3. **Wraparound List**: Wraparound service codes
4. **Health Professional List**: Health professional types
5. **Funding Source List**: Valid funding sources per service
6. **Late Submission Reason List**: Reason codes for late submissions

**Pattern**:
```
GET /reference/v1/{list-type}
```

These lists should be cached locally and refreshed periodically.

---

## CSV Export (Alternative to API)

Government portal (available Nov 1, 2025) will accept CSV uploads for bulk invoicing.

### CSV Format

See: [sah-portal-data---csv-mapping--gap-analysis.md](sah-portal-data---csv-mapping--gap-analysis.md)

**Key Points**:
- One row per item
- Rows with same `invoice_externalReferenceId` belong to same invoice
- CSV must include all mandatory and conditional fields
- Attachments referenced by filename/path

**CSV Export Job**:
```php
// domain/Billing/Jobs/ExportInvoicesToSAHCSVJob.php
```

---

## Testing & Development

### Test Environment

- **URL**: https://test.healthclaiming.api.humanservices.gov.au
- **Purpose**: Development and testing
- **Availability**: Active as of Oct 2025
- **Data**: Test packages and recipients provided by SA

### Test Scenarios

1. **Happy Path**: Create invoice → Add items → Submit → Check status
2. **Edit Flow**: Create OPEN invoice → Add items → Edit items → Submit
3. **Reopen**: Submit invoice → Reopen → Edit → Resubmit
4. **Delete**: Create invoice → Delete (no claims processed)
5. **Attachments**: Late submission → Upload evidence → Submit
6. **Conditional Fields**: AT high-tier with loan → Include loan details
7. **Error Handling**: Invalid service ID → Validate error response

### Postman Collection

Trilogy Care maintains a Postman collection for SA API testing:
- Location: TBD
- Includes: All endpoints, sample requests, test scripts

---

## Future Enhancements

1. **Webhook Integration**: Real-time status updates from SA (if/when available)
2. **Batch Processing**: Submit multiple invoices in single API call
3. **Reconciliation**: Automated matching of SA payments to TC Portal invoices
4. **Reference Data Sync**: Automated refresh of service/item/code lists
5. **Audit Logging**: Complete audit trail of all SA API interactions

---

## Related Documentation

- [Bill Processing](/features/domains/bill-processing) - TC Portal bill processing workflows
- [Support at Home Context](/context/industry/support-at-home-context) - SaH program overview
- Confluence: [Aged_Care_API_-_Support_at_Home_Invoices-1.0.0.yaml](https://trilogycare.atlassian.net/wiki/spaces/TCPH/pages/605159466)

---

## Strategic API Analysis

*Analysis by Will Whitelaw - January 2025*

The Services Australia API provides a structured approach to integrating aged care data, facilitating real-time access to client information, financial details, and claims processing.

### Customer Journey Flow

1. **Client Entry** (Entry/Departure API) - Registers a new client and their initial status
2. **Service Allocation** (Service List API) - Matches available services to the client's needs
3. **Budget Verification** (Budget API) - Ensures funding is available before services are scheduled
4. **Service Delivery & Claims** (Claim API & Invoice API) - Submits claims and invoices for provided services
5. **Payments & Reconciliation** (Payment Report API & Account Summary API) - Tracks payments and reconciles transactions
6. **Ongoing Adjustments** (Care Recipient Individual Contribution API) - Updates client payments and contributions
7. **Client Exit** (Entry/Departure API) - Closes the client record when they leave the program

### API Priority Assessment

| API | Priority | Relevance |
|-----|----------|-----------|
| **Support at Home Entry/Departure API** | 10/10 | Critical for managing client records. Currently manually lodged for each care recipient upon entry. Recommend submitting when Home Care Agreement is signed. Requires client address and commencement date. |
| **Care Recipient Summary API** | 10/10 | Highly relevant - provides detailed client information, classification, approved services. Real-time as soon as ACER is lodged or daily pulls to maintain accurate database. |
| **Support at Home Budget API** | 10/10 | Critical for real-time balances of all funding streams. Daily sync recommended. Good for reconciling balances (use Client Summary API for new funding streams). |
| **Support at Home Invoice API** | 10/10 | Most important API in the system. Essential for tracking and submission of package expenditure. Line items broken down by Tier 3 Service Type (mandatory). Real-time cadence (15 min etc). We have 1000+ of these to do per day. |
| **Support at Home Claim API** | 10/10 | Essential for payment flow. Daily claim submissions. A claim has many invoices associated - claim items represent the allowable amount of invoice line items. |
| **Support at Home Payment Statement API** | 10/10 | Highly relevant. First concept of Payment Item appears. Daily cadence. Supports financial reconciliation of payment items with Cash at Bank. |
| **Care Recipient Individual Contribution API** | 6/10 | Provides contribution percentages. Payment file gives us the individual contribution amounts. |
| **Support at Home Service List API** | 2/10 | Only relevant if Service categories change. Not relevant to individual clients - see Care Recipient Summary API for this data. Annual/adhoc cadence. |
| **Provider Summary API** | 0/10 | Low relevance unless mapping service, changing contacts or address. |
| **Service Search API** | 0/10 | Unclear relevance - potentially for finding other providers. Not needed. |

### Key Takeaways

**Entry/Departure API:**
- Must have client address and commencement date at time of lodging
- Recommend submitting when Home Care Agreement is signed
- Departure record simple but needs consideration of when in departure flow it's sent

**Invoice API:**
- Line items broken down by Tier 3 Service Type (mandatory)
- DELETE and SUBMIT operations available
- Investigate DELETE behaviour if already Claimed

**Claim vs Payment Item:**
- Need to understand difference between Claim Item and Payment Item
- If Invoice goes over Claimable amount, is the net the Payment Item or Claim Item?

---

**Maintained by**: Development Team
**Questions?**: Contact engineering lead or refer to Confluence documentation
