---
title: "Home Modifications Contractor - Document Requirements"
---


**Service Code**: SERV-0067

## Overview

Home Modifications contractors must provide standard supplier documents PLUS additional home modifications-specific documents during onboarding. Some documents require expiry date capture, and state-specific contract/registration documents are conditionally required based on the contractor's operating state(s).

## Standard Supplier Documents

All suppliers (regardless of type) must provide standard business verification documents. These are referenced generically and not detailed here, as they apply to all supplier types.

## Home Modifications-Specific Required Documents

All Home Modifications contractors must provide the following documents during onboarding:

| Document | Required? | Expiry Date Needed? | Notes |
|----------|-----------|---------------------|-------|
| Builders License | Yes | No | - |
| Builders Warranty Insurance | Yes | **Yes** | Must capture expiry date |
| Building Contract | Yes | No | State-specific variants below |
| Building Permit | Yes | No | - |
| Workers Compensation | Yes | **Yes** | Must capture expiry date |
| WorkSafe | Yes | **Yes** | Must capture expiry date |
| Certificate of Currency | Yes | No | - |
| Bank Statement | Yes | No | - |
| Certificate of Registration | Yes | No | - |
| Business Name Registration Certificate | Yes | No | - |
| Tax Certificate | Yes | No | - |
| Notice of Assessment | Yes | No | - |
| Utility Bill | Yes | No | - |
| Professional Body Membership | See registration requirements | **Yes** | Conditional based on state registration |

## State-Specific Contract Documents

The following contract documents are required based on which state(s) the contractor operates in. The system must conditionally require these based on selected service areas:

| State/Territory | Required Contract Document | Expiry Date Needed? |
|----------------|---------------------------|---------------------|
| Queensland (QLD) | QBCC Contract (Level 2) | No |
| New South Wales (NSW) | NSW Building Contract | No |
| Victoria (VIC) | VIC Major Domestic Building Contract | No |
| Australian Capital Territory (ACT) | ACT Residential Building Work Contract | No |
| South Australia (SA) | SA Domestic Building Contract & SA Building Indemnity Insurance | No |
| Tasmania (TAS) | TAS Residential Building Work Contract & TAS Residential Building Insurance/Statutory Warranties | No |
| Western Australia (WA) | WA Home Building Work Contract & WA Home Indemnity Insurance | **Yes** |
| Northern Territory (NT) | NT Work Safe, NT Building Contract, & NT Building Permit information | **Yes** |

## Builder Registration Requirements by State/Territory

**Important**: Builder registration is NOT required to complete onboarding, but contractors MUST be shown a disclaimer during onboarding that explains registration requirements for work over certain thresholds in their selected operating state(s).

### Registration Disclaimer Logic

If a contractor selects any of the states below as their service area, they must be shown the registration threshold disclaimer for those states.

| State/Territory | Registration Required? | Registration Body | Thresholds / Notes |
|----------------|----------------------|-------------------|-------------------|
| Victoria (VIC) | Yes | Victorian Building Authority (VBA) | Domestic building work > $10,000 or any structural/building permit work. |
| New South Wales (NSW) | Yes | NSW Fair Trading | Residential building work > $5,000 (license); > $20,000 (insurance). |
| Queensland (QLD) | Yes | Queensland Building and Construction Commission (QBCC) | Building work > $3,300 or structural work of any value. |
| Western Australia (WA) | Yes | Building Services Board / Building and Energy WA | Residential work > $20,000 or structural work. |
| South Australia (SA) | Yes | Consumer and Business Services (CBS) | Building work > $12,000 or requiring development approval. |
| Tasmania (TAS) | Yes | Consumer, Building and Occupational Services (CBOS) | All licensed work (building, plumbing, electrical) regardless of value. |
| Australian Capital Territory (ACT) | Yes | ACT Planning and Land Authority (Access Canberra) | Any building work requiring approval must be licensed. |
| Northern Territory (NT) | Yes | NT Building Practitioners Board | Residential work > $12,000 or any regulated work. |

**Note**: This does NOT include licensing requirements by individual trades (e.g., plumbing license, electrical license). This is specifically for builder registration for home modification work.

## Implementation Requirements

### Document Upload Form

1. **All Required Documents Section**: Display all documents from "Home Modifications-Specific Required Documents" table
2. **State-Specific Contracts Section**: Conditionally display contract documents based on selected service states
3. **Expiry Date Fields**: For documents where "Expiry Date Needed? = Yes", the upload form must include a date picker field to capture the expiry date
4. **File Upload**: Each document must support file upload (PDF, JPG, PNG formats)

### Registration Disclaimer Modal/Banner

When a contractor selects service states during onboarding, show a modal or prominent banner that explains:

> "You have selected [State Names]. Please note that if you will be performing work over the following thresholds in these states, you must be registered with the relevant authority:
>
> **[State]**: [Threshold notes] - Registration required with [Registration Body]
>
> By continuing, you acknowledge that you are responsible for ensuring compliance with all registration requirements for work you undertake."

### Document Validation

- **Required Documents**: All documents marked "Required? = Yes" must be uploaded before onboarding can be submitted
- **Expiry Date Validation**: Documents with expiry dates must have a valid future date (cannot be expired)
- **State Conditional Validation**: State-specific contract documents must be uploaded based on selected service states

### Document Storage Schema

Each uploaded document should store:
- `document_type` (enum from the tables above)
- `file_path` (path to uploaded file)
- `uploaded_at` (timestamp)
- `expiry_date` (nullable date, only for documents requiring expiry)
- `state_code` (nullable, for state-specific documents)
- `approval_status` (pending/approved/rejected)
- `rejection_reason` (nullable text)
- `approved_by` (nullable user_id)
- `approved_at` (nullable timestamp)
