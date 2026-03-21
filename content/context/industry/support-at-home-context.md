---
title: "Support at Home (SaH) Program - Regulatory Context"
---


**Last Updated**: 2025-10-28
**Status**: Active Program (Go-Live: July 1, 2025)
**Regulatory Framework**: Aged Care Act 1997, Support at Home Program Guidelines

---

## Table of Contents

- [Overview](#overview)
- [Program Structure](#program-structure)
- [Key Changes from HCP](#key-changes-from-hcp)
- [Fee Structure & Models](#fee-structure--models)
- [Funding Streams](#funding-streams)
- [Regulatory Requirements](#regulatory-requirements)
- [Timeline & Milestones](#timeline--milestones)
- [Impact on TC Portal](#impact-on-tc-portal)

---

## Overview

### What is Support at Home?

Support at Home (SaH) is the Australian Government's reformed aged care program that replaced the Home Care Packages (HCP) and Commonwealth Home Support Programme (CHSP) programs on **July 1, 2025**.

**Program Goals**:
- Provide a more flexible, consumer-directed aged care system
- Improve access to services through streamlined funding
- Support older Australians to remain independent at home longer
- Increase transparency in pricing and service delivery
- Simplify administration for providers

### Managed By

- **Services Australia**: Government agency managing SaH funding, claims, and compliance
- **Department of Health and Aged Care**: Policy and regulation
- **Aged Care Quality and Safety Commission**: Quality standards and audits

### Eligibility

Older Australians aged 65+ (50+ for Aboriginal and Torres Strait Islander peoples) who:
- Have been assessed by Services Australia as needing support
- Require assistance to live independently at home
- Meet the aged care means test

---

## Program Structure

### Service Categories

Support at Home services are organized into **Service Groups**, **Service Types**, and **Services**:

#### Service Groups (SERG)

1. **SERG-0001: Home Support**
   - Personal care, domestic assistance, social support
   - Meals, transport, allied health
   - Most commonly used service group

2. **SERG-0002: Assistive Technology (AT)**
   - Equipment and devices to support independence
   - Mobility aids, communication devices
   - Subject to caps and approval thresholds

3. **SERG-0003: Home Modifications (HM)**
   - Physical changes to the home environment
   - Ramps, grab rails, bathroom modifications
   - Subject to caps and approval thresholds

4. **SERG-0004: Care Management**
   - Care coordination and planning services
   - Case management

5. **SERG-0005: End of Life Pathway (EL)**
   - Specialized support for end-of-life care
   - Higher funding allocation

6. **SERG-0006: Restorative Care Pathway (RC)**
   - Short-term intensive support
   - Goal-oriented rehabilitation

### Assessment & Planning

1. **Assessment**: Services Australia conducts needs assessment
2. **Budget Allocation**: Funding assigned based on assessed needs
3. **Service Planning**: Care plan developed with care coordinator
4. **Service Delivery**: Providers deliver services
5. **Claiming**: Providers submit invoices to Services Australia
6. **Payment**: Services Australia processes claims and pays providers

---

## Key Changes from HCP

### Major Differences

| Aspect | Home Care Packages (Old) | Support at Home (New) |
|--------|--------------------------|----------------------|
| **Program Structure** | 4 levels (HCP 1-4) | Flexible, needs-based budgets |
| **Budget Allocation** | Fixed annual amount by level | Quarterly, based on assessed needs |
| **Funding Model** | Package subsidy | Activity-based claiming |
| **Fee Structure** | Percentage-based (15-17%) | Usage-based loading fees (10%) |
| **Service Categories** | Unstructured | Structured service groups (SERG) |
| **Claiming** | Provider holds funds | Direct claiming from Services Australia |
| **Consumer Contributions** | Income-tested care fee | Income-tested care fee (similar) |
| **Pricing Transparency** | Limited | Required price lists and transparency |
| **Rollover** | Complex, provider-managed | Automatic, SA-managed (60 days) |

### What This Means for Trilogy Care

#### Before (HCP Model)
- TC received package subsidy upfront
- TC held and managed client funds
- TC charged management fees as % of subsidy
- Annual budget cycles
- Complex rollover management

#### Now (SaH Model)
- TC claims for services as delivered
- Services Australia pays directly
- TC charges 10% loading fee per service
- Quarterly budget allocations
- Automatic rollover by SA (60 days post-quarter)

---

## Fee Structure & Models

### Loading Fee Model

Support at Home uses a **usage-based loading fee** structure instead of fixed percentage fees.

#### Fee Components

For each service delivered:

```
Total Package Debit = Supplier Cost + TC Fee + CC Fee (if applicable)
```

**Example**: 2 hours of house cleaning at $50/hour

1. **Self-Managed Model**:
   - Supplier Invoice: $100
   - TC Loading Fee (10%): $10
   - **Total Package Debit**: $110

2. **Self-Managed PLUS Model** (with Care Coordinator support):
   - Supplier Invoice: $100
   - CC Loading Fee (20% of supplier): $20
   - TC Loading Fee (10% of supplier + CC): $12
   - **Total Package Debit**: $132

#### Fee Rates

| Fee Type | Rate | Applied To | Who Receives |
|----------|------|-----------|--------------|
| **TC Management Fee** | 10% | Supplier cost + CC fee | Trilogy Care |
| **Care Coordinator Fee** | 20% | Supplier cost only | Care Coordinator (SM+ only) |
| **Supplier Payment** | Invoice amount | Service delivered | Service Provider |

### Fee Allocation Rules

Fees are deducted from **specific funding streams** in priority order:

1. **EL** (End of Life) - Highest priority
2. **ON** (Ongoing) - Primary funding
3. **RC** (Restorative Care)
4. **CU** (Commonwealth Unspent) - No client contributions
5. **HC** (Home Care Account) - Client funds
6. **VC** (Voluntary Contribution) - Client voluntary payments

See `config/support-at-home.php` for allocation rules per service group.

### MYOB Accounting Structure

The fee-inclusive model requires specific accounting treatment:

**Bill Record Structure**:
- Line items: Fee-inclusive amounts → Client Balance accounts (by funding stream)
- TC Loading: Negative line item → Revenue account (e.g., 6850)
- CC Loading: Negative line item → Payable account (e.g., 6600)
- GST: Separate line item → GST account
- **Bill Total**: Supplier invoice amount (what they get paid)

See [Services Australia API](/context/industry/services-australia-api) for API expectations.

Reference: [support-at-home---myob-structure.md](support-at-home---myob-structure.md)

---

## Funding Streams

### Core Funding Streams

| Code | Name | Description | Expirable | Contributions Apply |
|------|------|-------------|-----------|---------------------|
| **ON** | Ongoing | Primary home support funding | Yes (quarterly) | Yes |
| **AT** | Assistive Technology | Equipment and devices | No | Yes |
| **CM** | Care Management | Coordination services | No | No |
| **EL** | End of Life | Palliative/EOL support | No | No |
| **HM** | Home Modifications | Physical home changes | No | Yes |
| **RC** | Restorative Care | Short-term rehabilitation | No | No |
| **AS** | Assistive Tech (Specified) | High-value AT items | No | Yes |
| **CU** | Commonwealth Unspent | Rolled-over govt funds | No | No |
| **HC** | Home Care Account | Client private funds | No | N/A |
| **VC** | Voluntary Contribution | Additional client funds | No | N/A |

### Funding Allocation Rules

Different services can be paid from different funding streams:

**Home Support (SERG-0001)**: EL, ON, RC, CU, HC, VC
**Assistive Technology (SERG-0002)**: AT, AS, CU, HC, VC
**Home Modifications (SERG-0003)**: HM, CU, HC, VC

### Quarterly Budgets

- Funding allocated per **13-week quarters**
- Quarters defined by Services Australia (Q1, Q2, Q3, Q4)
- Budget allocation reviewed quarterly based on needs
- Underspend automatically rolls over (60 days grace period)

### Underspend Management

Trilogy Care monitors underspend and alerts at:
- **31-45 days** (33% through quarter): First alert
- **61-75 days** (66% through quarter): Second alert
- **76-90 days** (85% through quarter): Final alert

Purpose: Ensure clients utilize their budget before rollover period expires.

---

## Regulatory Requirements

### Pricing Transparency

Providers must:
1. Publish price lists for all services
2. Clearly display TC management fees
3. Provide itemized statements showing:
   - Service delivered
   - Provider cost
   - TC management fee
   - CC fee (if applicable)
   - Funding stream used
   - Remaining balance per stream

### Service Standards

All services must meet:
- **Aged Care Quality Standards** (8 standards)
- **Charter of Aged Care Rights**
- **Serious Incident Response Scheme (SIRS)** requirements
- **Commonwealth Home Support Programme Guidelines**

### Claims & Invoicing

1. **Invoice Timing**: Claims must be submitted within **60 days** of quarter end
2. **Late Submissions**: Require justification and evidence
3. **Service Verification**: Proof of service delivery required
4. **Attachments**: Required for:
   - Late submissions
   - High-value items (AT, HM)
   - Prescribed items
   - Loaned equipment

### Compliance & Audits

Services Australia may:
- Request evidence of service delivery
- Audit claims and payments
- Recover overpayments
- Suspend claiming privileges for non-compliance

---

## Timeline & Milestones

### Key Dates

| Date | Milestone |
|------|-----------|
| **July 1, 2025** | Support at Home program commenced |
| **Oct 2025** | SaH APIs available for testing |
| **Nov 1, 2025** | Government CSV portal expected to be available |
| **Q1 2026** | First SaH quarterly budget cycle complete |
| **June 30, 2026** | HCP to SaH transition complete |

### Transition Period

- **July 1 - Dec 31, 2025**: Transition period for existing HCP clients
- **HCP clients**: Gradually moved to SaH budgets
- **CHSP clients**: Integrated into SaH framework
- **New clients**: Start directly on SaH from July 1, 2025

---

## Impact on TC Portal

### Required Changes

#### 1. Fee Model (✅ Completed)
- Migrate from percentage-based to usage-based loading fees
- Calculate TC fee (10%) and CC fee (20%) per service
- Apply fees to correct funding streams

#### 2. Budget Management (🏗️ In Progress)
- Support quarterly budget allocations
- Track spending per quarter per funding stream
- Implement underspend alerts (33%, 66%, 85%)
- Handle automatic rollover from SA

#### 3. Invoicing & Claiming (🏗️ In Progress)
- Generate invoices in SA API format
- Support CSV export for government portal
- Track invoice status (OPEN, SUBMITTED, CLAIMED, COMPLETED)
- Handle late submission workflows

#### 4. Service Classification
- Map TC services to SA service IDs (SERV-XXXX)
- Support service groups (SERG), service types (SERT)
- Implement conditional field logic for AT/HM
- Support wraparound services and health professional classification

#### 5. Statements & Reporting
- Show fee-inclusive amounts on client statements
- Break down TC fee vs CC fee vs supplier cost
- Display funding stream balances per quarter
- Generate SA-compliant reports

#### 6. Compliance
- Enforce 60-day claiming deadline
- Collect evidence for late submissions
- Support attachment uploads (PDF)
- Maintain audit trail for all SA interactions

### Technical Architecture

**Key Components**:

```
/domain
  /Funding
    - FundingStream (model)
    - Funding (model)
    - Quarter (model)
  /Budget
    - BudgetPlan (with quarterly allocations)
    - BudgetPlanFundingStream
  /Billing
    - Bill (invoice)
    - BillItem (service line item)
    - ServicesAustraliaInvoice (SA API representation)
  /Integration
    - ServicesAustraliaApiClient
    - InvoiceExportService
```

**Jobs**:
- `SyncServicesAustraliaInvoiceStatusJob` - Poll SA for invoice status updates
- `ExportInvoicesToSAHCSVJob` - Generate CSV for government portal
- `QuarterEndRolloverJob` - Process quarter-end rollover
- `UnderspendAlertJob` - Send alerts at 33%, 66%, 85%

**Events** (Event Sourcing):
- `BudgetPlanFundingStreamAdded`
- `BudgetPlanFundingStreamUpdated`
- `FundingSyncedFromServicesAustralia`
- `InvoiceSubmittedToServicesAustralia`
- `InvoiceStatusUpdatedFromServicesAustralia`

---

## Data Requirements

### Portal Data Captured

TC Portal must capture:

**Invoice Level**:
- Service provider ID (SA ID)
- External reference (TC invoice ID)
- Invoice status

**Item Level (per service delivered)**:
- Care recipient ID (SA package ID)
- Service ID (from SA service list)
- Delivery date
- Quantity (in 0.25-hour increments)
- Price per unit (supplier rate, excl. fees)
- Unit type (hours, trip, item, bill, voucher, meal)
- Funding source (ON, RC, EL, etc.)

**Conditional Fields** (based on service type):
- Item/wraparound classification
- Item description code (for AT/HM)
- Health professional type (for clinical services)
- Purchase method (purchased/loaned for high-value AT)
- First payment flag (for HM)
- Late submission reason & justification

**Attachments**:
- Evidence for late submissions
- Prescriptions for prescribed items
- Quotes/invoices for loaned equipment

See [Services Australia API](/context/industry/services-australia-api) for full field mapping.

---

## Service Provider Requirements

### For Suppliers

Suppliers submitting invoices must:
1. **Be registered** with Services Australia (have provider ID)
2. **Meet quality standards** (NDIS or equivalent)
3. **Have valid insurances**:
   - Public liability
   - Professional indemnity
   - Workers compensation
4. **Comply with pricing** guidelines
5. **Deliver services** as per care plan

### For TC Portal

1. **Verification**: Validate supplier credentials before onboarding
2. **Pricing**: Ensure rates align with SA price schedules
3. **Documentation**: Collect and store compliance documents
4. **Audit Trail**: Maintain complete history of all supplier interactions

---

## Reference Materials

### Service Lists

Services Australia provides:
1. **Service List API**: All available services (SERV-XXXX codes)
2. **Item List API**: AT/HM item codes and descriptions
3. **Wraparound List API**: Wraparound service codes
4. **Health Professional List API**: Health professional types
5. **Funding Source List API**: Valid funding sources per service

These lists should be:
- Cached locally in TC Portal
- Refreshed daily via scheduled job
- Used for validation during service planning and invoicing

### Government Resources

- **Services Australia Portal**: https://www.servicesaustralia.gov.au/support-at-home
- **Department of Health**: https://www.health.gov.au/aged-care
- **Quality Standards**: https://www.agedcarequality.gov.au/
- **Provider Guidance**: Available through Services Australia provider portal

---

## Risks & Considerations

### Key Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **SA API Downtime** | Cannot submit claims | CSV export fallback, queue for retry |
| **Data Mapping Errors** | Claim rejections | Validation before submission, test coverage |
| **Fee Miscalculation** | Client overcharge/undercharge | Comprehensive unit tests, financial reconciliation |
| **Late Submission** | Lost revenue | Automated alerts, grace period monitoring |
| **Compliance Breach** | Provider suspension | Regular audits, automated validation |

### Contingency Plans

1. **API Failure**: Use CSV export to government portal
2. **Validation Errors**: Manual correction workflow with admin approval
3. **Payment Delays**: Track outstanding claims, follow up with SA
4. **System Changes**: Monitor SA announcements, maintain flexible mapping layer

---

## Future Enhancements

### Planned

1. **Real-time Budget Sync**: Webhook integration with SA for instant balance updates
2. **Predictive Analytics**: Forecast underspend, recommend service adjustments
3. **Automated Service Planning**: AI-generated budgets based on needs assessment
4. **Provider Marketplace**: Match clients with providers based on SaH service requirements
5. **Compliance Dashboard**: Real-time view of SA claiming status, error rates, payment timelines

### Under Consideration

1. **Direct Client Portal**: Allow clients to view SA statements directly
2. **Mobile App**: Field workers capture service delivery in real-time
3. **Automated Reconciliation**: Match SA payments to TC Portal invoices
4. **Advanced Reporting**: SA-compliant reports for financial audits

---

## Related Documentation

- [Services Australia API](/context/industry/services-australia-api) - API integration details
- [Bill Processing](/features/domains/bill-processing) - TC Portal bill processing workflows
- Confluence: [Support at Home - MYOB structure](https://trilogycare.atlassian.net/wiki/spaces/TC/pages/605126664)
- Confluence: [SaH Portal Data & CSV Mapping](https://trilogycare.atlassian.net/wiki/spaces/TCPH/pages/579698712)

---

## Glossary

| Term | Definition |
|------|------------|
| **SaH** | Support at Home program |
| **SA** | Services Australia (government agency) |
| **HCP** | Home Care Packages (predecessor program) |
| **CHSP** | Commonwealth Home Support Programme |
| **SERG** | Service Group (e.g., SERG-0001 for Home Support) |
| **SERT** | Service Type (e.g., SERT-0001 for Home Maintenance) |
| **SERV** | Service code (e.g., SERV-0001 for House Cleaning) |
| **NAPS** | National Approved Provider System |
| **AT** | Assistive Technology |
| **HM** | Home Modifications |
| **TC** | Trilogy Care |
| **CC** | Care Coordinator |
| **SM+** | Self-Managed PLUS (with coordinator support) |
| **Loading Fee** | Usage-based management fee (10% for TC) |

---

**Maintained by**: Product & Development Teams
**Questions?**: Contact product owner or refer to Services Australia provider documentation
**Last Reviewed**: 2025-10-28
