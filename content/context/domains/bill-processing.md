---
title: "Bill Processing Documentation"
description: "Complete supplier invoice lifecycle from receipt to payment, including planned and unplanned service workflows"
---


**Last Updated**: 2025-10-27
**Status**: Active Documentation
**Related Systems**: Support at Home (SAH), Budget Management, Funding Streams

---

## Table of Contents

- [Overview](#overview)
- [Key Concepts](#key-concepts)
- [Roles & Responsibilities](#roles--responsibilities)
- [Bill Processing Workflows](#bill-processing-workflows)
- [Business Rules](#business-rules)
- [Acceptance Criteria](#acceptance-criteria)
- [UI/UX Considerations](#uiux-considerations)
- [Future Enhancements](#future-enhancements)
- [Technical Implementation](#technical-implementation)

---

## Overview

Bill processing in the TC Portal manages the complete lifecycle of supplier invoices from receipt through payment. The system distinguishes between **planned services** (budgeted in active service plans) and **unplanned services** (approved in NOA but not budgeted), with different approval workflows for each.

### Key Objectives

1. **Accuracy**: Match invoice line items to correct service plan items
2. **Compliance**: Ensure bills follow funding allocation rules and budget limits
3. **Efficiency**: Streamline processing for planned services within delegated authority
4. **Control**: Route unplanned services to appropriate approvers
5. **Transparency**: Provide clear visibility into processing status and decisions

### System Context

- **Bills** are submitted by suppliers via the supplier portal or uploaded by administrators
- **Bill Items** represent individual line items on an invoice, each linked to a service delivery
- **Service Plans** (Budget Plans) define planned services and funding allocations
- **Funding Streams** provide the "cash in the bank" (ON, RC, EL, CU, HC, VC)
- **Packages** represent participant care packages with associated funding entitlements

---

## Key Concepts

### Planned Services

**Definition**: Services that are included in the active (published) service plan/budget for a package.

**Characteristics**:
- Pre-approved by care partner during budget planning
- Specific supplier, service type, rate, frequency, and date range defined
- Funding already allocated in the budget
- Fast-track processing when invoices match plan

**Example**:
```
Service Plan Item:
- Service: Personal Care
- Supplier: ABC Home Care
- Rate: $65/hour
- Frequency: 3x per week
- Period: Q1 2025 (Jan-Mar)
- Funding: ON (Ongoing - Quarterly)
```

### Unplanned Services

**Definition**: Services that are:
- Approved in the Notice of Assessment (NOA)
- NOT included in the current active service plan/budget
- Require care partner approval before payment

**Types**:

1. **Legitimate Unplanned Services**
   - Emergency services
   - One-off needs that arose after budget was published
   - Services in NOA but not yet budgeted
   - Example: Emergency respite care after family emergency

2. **Minor Unplanned Services** (Under Threshold)
   - Small value items beneath policy threshold (e.g., $300)
   - May be processed directly by bill processing officer if within funding stream
   - Subject to monitoring and policy review
   - Example: $150 one-off taxi service

3. **Out-of-Budget Planned Services**
   - Planned service that exceeds budgeted amount
   - Service continues but budget allocation insufficient
   - Requires care partner approval for over-budget amount

### Bill Matching Process

**Goal**: Match invoice line items to service plan items using:
- Supplier
- Service type
- Rate (within tolerance)
- Service date range
- Funding stream eligibility

**Matching Levels**:

1. **Exact Match** ✅
   - All criteria match perfectly
   - Auto-recommend (when feature available)

2. **Close Match** 🟡
   - Most criteria match
   - Rate within acceptable tolerance (e.g., ±5%)
   - Supported by historical invoicing data
   - Bill processor reviews and confirms

3. **No Match** ❌
   - Cannot be matched to any planned service
   - Flagged as unplanned service
   - Routed to care partner

---

## Roles & Responsibilities

### Bill Processing Officer (BPO)

**Primary Responsibilities**:

1. **Invoice Receipt & Verification**
   - Review incoming invoices for completeness
   - Verify supplier details and invoice reference
   - Check for required documentation

2. **Bill Item Matching**
   - Match invoice line items to service plan items
   - Use matching criteria: supplier, rate, date, service type
   - Accept "close enough" matches within policy tolerances
   - Utilize automated recommendations (when available - Nov 1 target)

3. **Planned Service Processing**
   - Process bills for planned services within budget directly
   - Verify sufficient funding exists in funding stream
   - Ensure service dates fall within planned period
   - Confirm rates match (or fall within tolerance)

4. **Unplanned Service Identification**
   - Flag bill items that cannot be matched to planned services
   - Categorize as unplanned service
   - Place bill on hold pending care partner approval
   - Document reason for hold

5. **Minor Unplanned Service Processing**
   - For unplanned services under threshold (e.g., $300):
   - Verify service is approved in NOA
   - Check sufficient funding exists in appropriate funding stream
   - Process directly if within policy guidelines
   - Monitor volume and report trends

6. **Accuracy & Compliance**
   - Verify rates against published service plan
   - Check supplier is authorized for the service type
   - Ensure funding stream eligibility rules followed
   - Use correct workflow for planned vs. unplanned

7. **Communication & Documentation**
   - Document matching decisions and rationale
   - Add notes explaining holds or special handling
   - Report discrepancies between environments
   - Participate in training and process improvements

**Key Performance Indicators**:
- Matching accuracy rate
- Processing time per bill
- Error/rework rate
- Compliance with funding rules

### Care Partner (Case Manager)

**Primary Responsibilities**:

1. **Unplanned Service Approval**
   - Review bills on hold for unplanned services
   - Verify service is approved in NOA
   - Confirm service was actually delivered and appropriate
   - Check sufficient funding available in funding stream
   - Approve or reject unplanned service bills

2. **Budget Reconciliation**
   - Resolve unplanned services by:
     - Option A: Mapping to existing planned service (if similar)
     - Option B: Processing as unplanned (if appropriate)
     - Option C: Rejecting (if inappropriate or not approved)
   - Update service plan if pattern of unplanned services emerges

3. **Budget Version Management**
   - Monitor active vs. draft budget versions
   - Identify significant amounts accumulating under unplanned
   - Trigger creation of updated service plan when needed
   - Ensure service plan stays aligned with actual service delivery

4. **Funding Stream Oversight**
   - Ensure total payments do not exceed funding stream balance
   - Monitor "cash in the bank" across all funding streams
   - Balance between budget flexibility and funding constraints
   - Note: Exceeding planned budget OK if funding stream has capacity

5. **Supplier Communication**
   - Notify suppliers when added to service plan
   - Provide service plan ID for invoice reference
   - Educate suppliers on correct invoicing process
   - Use email templates for consistency

6. **Quality Assurance**
   - Review patterns in unplanned services
   - Identify training needs for coordinators
   - Ensure budget accuracy and compliance
   - Escalate systemic issues to management

**Key Performance Indicators**:
- Unplanned service approval turnaround time
- Budget accuracy (planned vs. actual variance)
- Service plan update frequency
- Supplier onboarding effectiveness

---

## Bill Processing Workflows

### Workflow 1: Planned Service (Happy Path)

```
[Invoice Received]
     ↓
[BPO: Review Invoice]
     ↓
[BPO: Match Line Items to Service Plan]
     ↓
[System: Check Matching Criteria]
     ├─ Supplier ✅
     ├─ Service Type ✅
     ├─ Rate (within tolerance) ✅
     ├─ Date Range ✅
     └─ Funding Available ✅
     ↓
[System: Auto-Match (or BPO Manual Match)]
     ↓
[BPO: Verify & Confirm]
     ↓
[System: Validate Funding Rules]
     ↓
[Bill Status: Approved]
     ↓
[Queue for Payment]
     ↓
[Payment Processed]
```

**Timeline**: 1-2 business days (target)

### Workflow 2: Unplanned Service (Care Partner Approval Required)

```
[Invoice Received]
     ↓
[BPO: Review Invoice]
     ↓
[BPO: Attempt Match to Service Plan]
     ↓
[System: No Match Found] ❌
     ↓
[BPO: Flag as Unplanned Service]
     ↓
[BPO: Check NOA for Service Approval]
     ├─ Not in NOA → [Reject Bill]
     └─ In NOA → [Continue]
     ↓
[BPO: Check Threshold]
     ├─ Under $300 → [Check Funding] → [Process Directly if OK]
     └─ Over $300 → [Place on Hold]
     ↓
[System: Notify Care Partner]
     ↓
[Care Partner: Review Bill]
     ↓
[Care Partner: Decision]
     ├─ Approve → [Map to Planned/Unplanned] → [Continue Processing]
     ├─ Reject → [Reject Bill] → [Notify Supplier]
     └─ Request Info → [Hold] → [Contact Supplier/Coordinator]
     ↓
[Bill Approved]
     ↓
[Queue for Payment]
     ↓
[Payment Processed]
```

**Timeline**: 3-5 business days (target)

### Workflow 3: Over-Budget Planned Service

```
[Invoice Received]
     ↓
[BPO: Match to Service Plan Item]
     ↓
[System: Match Found ✅]
     ↓
[System: Check Budget Allocation]
     ↓
[System: Budget Exceeded] ⚠️
     ↓
[System: Check Funding Stream Balance]
     ├─ Funding Available → [Flag for Care Partner Review]
     └─ Insufficient Funding → [Hold - Funding Required]
     ↓
[Care Partner: Review Over-Budget]
     ↓
[Care Partner: Decision]
     ├─ Approve → [Allocate Additional Funding] → [Process]
     └─ Reject → [Reject Bill] → [Review Service Plan]
```

### Workflow 4: Missing Service Plan ID

```
[Invoice Received WITHOUT Service Plan ID]
     ↓
[BPO: Check for Active Service Plan]
     ├─ No Active Plan → [Hold - Create Plan First]
     └─ Active Plan Exists → [Continue]
     ↓
[BPO: Manual Match Attempt]
     ↓
[BPO: Follow Planned/Unplanned Workflow]
     ↓
[BPO: Update Supplier Communication]
     ↓
[Care Partner: Send Template Email to Supplier]
```

---

## Business Rules

### Matching Rules

1. **Exact Match Required**:
   - Supplier ID must match planned supplier
   - Service type must match planned service category
   - Service date must fall within planned date range

2. **Rate Tolerance**:
   - Rates within ±5% may be accepted as "close enough"
   - Historical invoicing data supports tolerance
   - Bill processor documents reason for acceptance
   - Exceptions require care partner approval

3. **Multiple Plan Items**:
   - If invoice could match multiple service plan items:
     - Prioritize by date range (most recent/relevant)
     - Consider remaining budget allocation
     - Use supplier historical patterns
   - Document matching decision

### Funding Rules

1. **Funding Stream Validation**:
   - Bill cannot be paid without sufficient funding stream balance
   - System validates: `funding_stream.available_amount >= bill.total_amount`
   - Error if insufficient: "Insufficient funding - [Stream Name]"

2. **Budget vs. Funding Stream**:
   - Exceeding planned budget IS allowed if funding stream has balance
   - Exceeding funding stream is NOT allowed (hard stop)
   - Voluntary Contribution can be created to add funding

3. **Funding Allocation Priority** (for planned services):
   ```
   1. EL (End of Life) - Highest priority
   2. ON (Ongoing) - Primary quarterly funding
   3. RC (Restorative Care)
   4. CU (Commonwealth Unspent) - Only after quarterly funds
   5. HC (Home Care Account)
   6. VC (Voluntary Contribution)
   ```

4. **Service Plan Version**:
   - Bills matched against **published/active** service plan only
   - Draft service plans NOT used for bill matching
   - Update service plan and publish to enable new services

### Approval Authority

1. **Bill Processing Officer Can Approve**:
   - Planned services within budget
   - Planned services over budget BUT within funding stream
   - Unplanned services under threshold ($300) within funding stream
   - All criteria met for accuracy and compliance

2. **Care Partner Approval Required**:
   - All unplanned services over threshold
   - Services not approved in NOA
   - Questionable matches or discrepancies
   - Pattern of over-budget planned services

3. **Rejection Triggers**:
   - Service not in NOA
   - No available funding in any stream
   - Duplicate invoice
   - Invalid supplier or service type
   - Rate significantly exceeds approved rate without justification

### Hold Reasons

**Common On-Hold Scenarios**:

1. **Unplanned Service** - Most common
   - Service not in published service plan
   - Requires care partner approval

2. **Missing Documentation**
   - Invoice document incomplete or unreadable
   - Service delivery evidence missing

3. **Rate Discrepancy**
   - Rate exceeds tolerance threshold
   - No historical precedent for rate

4. **Funding Insufficient**
   - No available balance in eligible funding streams
   - Awaiting funding update or voluntary contribution

5. **Duplicate Invoice**
   - Invoice reference already processed
   - Requires verification with supplier

6. **Service Plan Mismatch**
   - Service dates outside planned period
   - Supplier not authorized in service plan
   - Service type not approved

---

## Acceptance Criteria

### As a Bill Processing Officer

#### AC 1: Invoice Line Item Matching

**Given** I am reviewing an invoice with multiple line items
**When** I match line items to service plan items using supplier, rate, date, and service criteria
**Then** I should be able to:
- View **published/active** service plan items for the package (not draft versions)
- See supplier, rate, date range, and service type for each planned item
- Select/deselect planned service items to match invoice lines
- See remaining budget allocation for each service item
- Receive automated "recommended" match flags (when implemented - Nov 1 target)
- Manually override recommendations if needed
- Accept "close enough" matches within policy tolerances (e.g., ±5% rate variance)
- Document matching rationale and any tolerance decisions in notes
- Complete matching process efficiently using designated UI controls

#### AC 2: Planned Service Processing (Within Delegated Authority)

**Given** an invoice line item matches a planned service from the **published budget/service plan**
**When** all matching criteria are met (supplier, rate within tolerance, date range, funding available)
**And** the bill is within planned limits
**And** sufficient funding exists in the funding stream
**Then** I should be able to:
- Process the bill directly without care partner approval (within delegated authority)
- See confirmation that funding allocation is within limits
- Verify rate is within acceptable tolerance (±5%)
- Document any "close enough" matches with supporting rationale
- See visual confirmation that I'm matching against the **published** (not draft) service plan
- Complete processing in under 5 minutes per bill (target)

**Business Rule Note**: Bills for unplanned services (not budgeted but approved in NOA) must be routed to care partner for approval - unless they fall beneath the minor threshold

#### AC 3: Unplanned Service Identification

**Given** an invoice line item cannot be matched to any planned service
**When** I flag it as an unplanned service
**Then** the system should:
- Place the bill on hold automatically
- Notify the assigned care partner
- Prompt me to check NOA for service approval
- Display threshold amount for minor unplanned services
- Allow me to add context notes explaining the unplanned service

#### AC 4: Minor Unplanned Service Processing

**Given** an unplanned service is under the threshold (e.g., $300)
**And** the service is approved in the NOA
**And** sufficient funding exists in an eligible funding stream
**When** I process the bill
**Then** I should be able to:
- Select "Process as Minor Unplanned Service"
- Choose the appropriate funding stream
- Document the decision
- Process without care partner approval (within policy)
- See confirmation of funding stream deduction

#### AC 5: Rate Tolerance Matching

**Given** an invoice rate differs from the planned rate by less than 5%
**When** I review the match
**Then** I should be able to:
- See the planned rate vs. invoice rate clearly
- See percentage difference calculated
- View historical invoicing data for this supplier/service
- Accept the match with documented rationale
- Override and flag for care partner if uncertain

#### AC 6: UI Clarity

**Given** I am using the bill processing interface
**Then** the UI should:
- Clearly distinguish between planned and unplanned service buttons
- Show selected items with visual confirmation (checkmarks, highlights)
- Display funding stream balances in real-time
- Indicate which service plan version is active
- Provide clear error messages with actionable next steps
- Match design specifications from development environment

#### AC 7: Accuracy Verification

**Given** I am processing a bill
**When** I select service plan items
**Then** the system should:
- Validate supplier authorization
- Check rate against published service plan
- Verify service dates fall within planned period
- Confirm funding stream eligibility
- Prevent processing if validation fails
- Provide clear reason for validation failure

#### AC 7.1: UI Usage & Feedback

**Given** I am using the designated UI for bill processing
**Then** I should be able to:
- Use clearly labeled buttons to select/deselect planned services
- Use clearly labeled buttons to flag/process unplanned services
- See which service plan items have been selected (with visual indicators)
- Distinguish between active and draft service plan versions
- Report issues when I observe discrepancies between design and live/development environments
- Provide feedback on UI improvements through designated channels

**And** I commit to:
- Participate in foundational and advanced training sessions on bill processing
- Stay updated with new workflows, especially as automation features are introduced
- Adapt to UI improvements such as clearer buttons, recommended matches, and better selection visibility

### As a Care Partner

#### AC 8: Unplanned Service Approval (If Within Funding)

**Given** a bill is on hold for an unplanned service (approved in NOA but not budgeted)
**When** I review the bill
**Then** I should be able to:
- See full context: invoice details, service description, supplier, amount
- View the participant's NOA to verify service approval
- Check available funding stream balances ("cash in the bank")
- **Verify sufficient funds remain in the funding stream** before approving
- Approve and map to planned OR process as unplanned (if within funding)
- Reject with documented reason (if not appropriate or insufficient funding)
- Request additional information from supplier/coordinator

**Critical Business Rule**: Unplanned services are services approved on the NOA but not included in the planned budget. Care partners are responsible for approving these bills, provided sufficient funds remain in the funding stream. Bill processing officers cannot approve unplanned services above the threshold - the bill must go on hold for care partner review.

#### AC 9: Unplanned Service Resolution Options

**Given** I am approving an unplanned service
**When** I choose how to process it
**Then** I should have options to:
- **Option A**: Map to existing planned service item (if similar enough)
- **Option B**: Process as unplanned service (deduct from funding stream)
- **Option C**: Add to draft service plan and publish (for ongoing services)
- **Option D**: Reject if not appropriate or not in NOA

#### AC 10: Funding Stream Monitoring

**Given** I am reviewing bills and budgets
**Then** I should be able to:
- View "cash in the bank" for all funding streams
- See total allocated vs. available for each stream
- Identify funding streams approaching capacity
- Receive alerts when funding stream < 10% remaining
- Drill down to see all bills charged to each funding stream

#### AC 11: Budget Version Management

**Given** I notice significant unplanned service amounts accumulating
**When** I review the budget
**Then** I should be able to:
- Compare active service plan vs. draft versions
- See total unplanned expenditure for current quarter
- Identify services that should be added to service plan
- Create/update draft budget with new services
- Publish updated service plan to enable future planned processing

#### AC 12: Supplier Communication

**Given** I add a supplier to a service plan
**When** the service plan is published
**Then** the system should:
- Trigger email to supplier using template
- Include service plan ID in email
- Explain benefits of including service plan ID on invoices
- Provide contact information for questions
- Log communication in package notes

**Given** I remove a supplier from a service plan
**Then** the system should:
- Trigger removal email to supplier
- Explain change in invoicing process
- Provide end date for service plan
- Log communication in package notes

#### AC 13: Approval Turnaround Time

**Given** I receive notification of bill on hold
**When** I review and approve/reject
**Then** I should be able to:
- Complete review in under 10 minutes (target)
- Access all necessary information in one view
- Approve with one click if straightforward
- Provide quick rejection reasons via dropdown
- Add detailed notes for complex situations

---

## UI/UX Considerations

### Current State Issues

1. **Button Clarity** (Reported Issue)
   - Planned vs. Unplanned service buttons not clearly differentiated
   - Improvements needed for visual distinction

2. **Selection Visibility** (Reported Issue)
   - Not always clear which items are selected
   - Need better visual feedback (checkmarks, highlighting)

3. **Matching Recommendations** (Target: Nov 1)
   - Automated "recommended" flags not yet implemented
   - Currently manual matching process
   - Priority enhancement for efficiency

4. **Environment Discrepancies** (Reported Issue)
   - Differences between design and live/development environments
   - Bill processors to report discrepancies as they occur

### Design Requirements

1. **Visual Hierarchy**
   - Primary action (process planned) should be most prominent
   - Secondary actions (flag unplanned, hold) should be clearly accessible
   - Destructive actions (reject) should have warning styling

2. **Feedback & Confirmation**
   - Selected items: Clear visual indication (checkmarks, highlighted rows)
   - Validation errors: Inline, specific, actionable
   - Success messages: Confirm action taken and next steps
   - Loading states: Show progress for long operations

3. **Information Density**
   - Balance between information completeness and cognitive load
   - Progressive disclosure: Show essentials, reveal details on demand
   - Use accordions, tabs, or panels for complex information

4. **Accessibility**
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast compliance (WCAG AA minimum)
   - Clear focus indicators

5. **Mobile Responsiveness**
   - While bill processing is primarily desktop workflow
   - Care partner approval may occur on mobile
   - Ensure critical functions accessible on tablet/mobile

---

## Future Enhancements

### Phase 1: Automation (Target: Nov 1, 2024)

1. **Automated Matching Recommendations**
   - ML-based algorithm to suggest matches
   - Confidence scoring (high/medium/low)
   - Learning from historical matching decisions
   - Override capability for bill processors

2. **Rate Tolerance Configuration**
   - Admin-configurable tolerance thresholds
   - Per-service-type tolerances
   - Automatic flagging of out-of-tolerance rates

3. **Duplicate Detection**
   - Automatic detection of duplicate invoice references
   - Fuzzy matching for slight variations
   - Alert bill processor before processing

### Phase 2: Workflow Optimization (Target: Q1 2025)

1. **Bulk Processing**
   - Select multiple bills for same action
   - Batch approval for similar unplanned services
   - Bulk funding stream allocation

2. **Smart Routing**
   - Route complex bills to senior bill processors
   - Priority routing for urgent bills (e.g., near due date)
   - Workload balancing across bill processing team

3. **Predictive Budgeting**
   - Identify patterns in unplanned services
   - Suggest service plan additions
   - Forecast budget requirements

### Phase 3: Advanced Features (Target: Q2 2025)

1. **Supplier Portal Integration**
   - Suppliers submit invoices directly via portal
   - Auto-populate service plan ID from supplier database
   - Real-time invoice status tracking for suppliers

2. **Mobile Approval App**
   - Native mobile app for care partner approvals
   - Push notifications for bills on hold
   - Quick approve/reject with context

3. **Advanced Analytics**
   - Bill processing KPI dashboard
   - Supplier performance metrics
   - Budget variance analysis
   - Funding stream utilization trends

---

## Technical Implementation

## Open Questions

| Question | Context |
|----------|---------|
| **Auto-rejection gate criteria?** | Which fields trigger auto-rejection (Supplier ID + Package ID mentioned)? |
| **Multiple on-hold reasons schema?** | Current: single field; needed: multiple with timestamps and resolution outcomes |
| **Bill linking for resubmissions?** | How to track rejected bills linked to resubmitted versions? |
| **Cadence/timeout implementation?** | Configurable timeouts per hold reason for auto-rejection? |
| **AI matching confidence thresholds?** | What score triggers auto-match vs manual review? |

---

### Data Models

#### Bill
```php
// App\Models\Bill\Bill
- id: int
- ref: string (unique bill reference)
- invoice_ref: string|null (supplier invoice number)
- package_id: int (FK to Package)
- supplier_id: int (FK to Supplier)
- bill_stage: BillStageEnum (submitted, in_review, approved, paid, rejected, on_hold)
- bill_on_hold_reason: BillOnHoldReasonsEnum|null
- bill_rejected_reason: BillRejectedReasonsEnum|null
- total_amount: decimal
- invoice_date: date
- due_date: date
- submitted_at: timestamp
- approved_at: timestamp|null
- paid_at: timestamp|null
- on_hold_at: timestamp|null
- on_hold_comment: text|null
```

#### BillItem
```php
// App\Models\Bill\BillItem
- id: int
- bill_id: int (FK to Bill)
- budget_plan_item_id: int|null (FK to BudgetPlanItem - if matched)
- service_type: string
- description: text
- quantity: decimal
- rate: decimal
- amount: decimal
- service_date: date
- is_unplanned: boolean
- matched_at: timestamp|null
- matched_by: int|null (FK to User)
```

#### BillExtraction (AI Document Processing)
```php
// App\Models\Bill\BillExtraction
- Stores AI-extracted data from invoice documents
- Used by ProcessBillExtraction action
- Enables fuzzy matching for supplier/service identification
```

#### BudgetPlanItem (Service Plan Item)
```php
// Domain\Budget\Models\BudgetPlanItem
- id: int
- budget_plan_id: int (FK to BudgetPlan)
- supplier_id: int (FK to Supplier)
- service_type_id: int
- rate: decimal
- frequency: enum (daily, weekly, fortnightly, monthly, etc.)
- start_date: date
- end_date: date
- total_allocated: decimal
- funding_stream_allocations: json (array of funding_stream_id => amount)
```

### Key Actions

```php
// Bill Processing Actions (domain/Bill/Actions/)
SelectServicePlanForBillItem.php        # Shows planned & unplanned services for matching
FindRecommendedServiceAction.php        # AI-powered LLM recommendation for best match
ApproveBill.php / BulkApproveBills.php  # Approve single or multiple bills
UnapproveBill.php                       # Reverse bill approval
MarkBillAsPaid.php                      # Mark as paid in accounting
GetPastBillItems.php                    # Historical billing for comparison
CorrectBillFundingConsumptions.php      # Adjust funding allocations
ProcessBillExtraction.php               # Process AI-extracted bill data
FindDuplicatedBills.php                 # Detect duplicate submissions
CorrectServiceTypes.php                 # Adjust service type classifications

// Evaluation Actions (domain/Bill/Actions/Evaluations/)
EvaluatePlannedServiceFundingAmount.php # Checks funding availability
EvaluatePlannedServiceBudgetAmount.php  # Checks budget availability
EvaluateRate.php                        # Compares invoice vs planned rate
EvaluateSupplierAbn.php                 # Validates supplier ABN match
EvaluateUnits.php                       # Validates unit quantities

// Fee Calculation
CalculateFeesAction.php                 # Full fee calc for SAH & coordination

// Funding Tracking
BudgetPlanItemFundingConsumption.php    # Per-item consumption tracking
```

### Enums

```php
// Bill Stage
enum BillStageEnum: string {
    case SUBMITTED = 'submitted';
    case IN_REVIEW = 'in_review';
    case APPROVED = 'approved';
    case ON_HOLD = 'on_hold';
    case REJECTED = 'rejected';
    case PAID = 'paid';
}

// On Hold Reasons
enum BillOnHoldReasonsEnum: string {
    case UNPLANNED_SERVICE = 'unplanned_service';
    case MISSING_DOCUMENTATION = 'missing_documentation';
    case RATE_DISCREPANCY = 'rate_discrepancy';
    case INSUFFICIENT_FUNDING = 'insufficient_funding';
    case DUPLICATE_INVOICE = 'duplicate_invoice';
    case SERVICE_PLAN_MISMATCH = 'service_plan_mismatch';
}
```

### API Endpoints

```php
// Bill Processing Endpoints (app-modules/api/src/V1/Bill)
POST   /api/v1/bills/{bill}/match-items          // Match bill items to service plan
POST   /api/v1/bills/{bill}/approve              // Approve bill (BPO)
POST   /api/v1/bills/{bill}/hold                 // Place bill on hold
POST   /api/v1/bills/{bill}/reject               // Reject bill
POST   /api/v1/bills/{bill}/approve-unplanned    // Approve unplanned service (Care Partner)
GET    /api/v1/bills/{bill}/matching-candidates  // Get service plan items for matching
```

### Event Sourcing

```php
// Bill Events
Domain\Bill\Events\BillSubmitted
Domain\Bill\Events\BillItemMatchedToServicePlan
Domain\Bill\Events\BillApproved
Domain\Bill\Events\BillPlacedOnHold
Domain\Bill\Events\UnplannedServiceApproved
Domain\Bill\Events\BillRejected
Domain\Bill\Events\BillPaid

// Projectors
Domain\Bill\Projectors\BillProjector
Domain\Bill\Projectors\BillItemProjector
```

---

## Related Documentation

- [Budget Management](/features/domains/budget) - Budget tracking and planning
- [Task Management](/features/domains/task-management) - Task workflows for bill processing

---

## Current Challenges

From Fireflies meetings (Aug 2025 - Jan 2026):

| Challenge | Impact |
|-----------|--------|
| **66% deletion rate** | High proportion of submitted bills deleted due to errors |
| **15% missing IDs** | Invoices without essential IDs could be auto-rejected |
| **Processing scale** | Target: 100,000 monthly bills by 40-person offshore team |
| **Attachment issues** | Corrupted or missing attachments causing delays |
| **Handwritten bills** | Manual processing causing bottlenecks |
| **Credit reversal display** | Impacting approvals, need better UI |
| **Training time** | 4 months proposed reduction to 2 weeks |

---

## Processing Metrics

| Metric | Target |
|--------|--------|
| **Bills processed daily** | 90 bills/person (5 min each) |
| **Processing time** | 5 minutes per bill |
| **Deletion rate target** | Reduce from 66% |
| **AI accuracy target** | 80% initial → 99% goal |

---

## AI-Driven Invoice Processing

### TC Bill Processor & Document Extractor

| Feature | Status |
|---------|--------|
| **Initial accuracy** | 80% target |
| **Ultimate accuracy** | 99% goal |
| **Classification** | 70% accuracy using keyword matching + supplier data |
| **Extraction** | Azure Document Intelligence |
| **Pilot success** | Mabel invoices (1,900 processed) |

### AI Capabilities

- Keyword matching for service classification
- Supplier data enrichment for accuracy
- Layout LLM3 for improved template handling
- Fuzzy matching for supplier/service identification

---

## On-Hold Bills Workflow Redesign

Major redesign in progress (Jan 2026):

| Enhancement | Description |
|-------------|-------------|
| **Master hold reasons list** | Standardized definitions |
| **Multiple reasons per bill** | Status, timestamps, resolution outcomes |
| **Supplier communications** | Three types of status notifications |
| **Email notifications** | Improvements targeting February delivery |

---

## Express Pay Features

Coming soon for suppliers:
- Faster payment processing
- Batch validation before payment runs
- QR code-based service confirmation

---

## Status

**Maturity**: Production
**Pod**: Bills
**Owner**: Bruce B, Dave H

---

## Source Meetings

| Date | Meeting | Key Topics |
|------|---------|------------|
| Jan 14, 2026 | OHB Dev Alignment | 66% deletion rate, processing targets, AI classification |
| Jan 7, 2026 | On Hold Mapping Work Group | Hold reasons, multiple statuses, notifications |
| Dec 22, 2025 | Invoice Classification | AI training, 70% accuracy target |
| Dec 16, 2025 | TC Bill Processor Overview | Azure Document Intelligence, 80-99% accuracy |
| Multiple | Supplier Touchpoints | Email notifications, rejection reasons |

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-27 | 1.0 | Initial documentation | Product Team |
| 2026-01-31 | 1.1 | Added Fireflies research findings | Claude |

---

## Feedback & Questions

For questions about bill processing workflows, contact:
- **Product Team**: For process clarification
- **Development Team**: For technical implementation
- **Operations**: For policy and compliance questions

Report UI/UX issues via standard issue tracking system.
