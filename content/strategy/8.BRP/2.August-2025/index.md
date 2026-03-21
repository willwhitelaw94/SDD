---
title: "Big Room Planning - August 2025"
---

## Support at Home (SAH) Transition Planning

**Meeting Date:** August 2025
**Planning Period:** Sprint 16 (4th Aug) - Sprint 26 (22nd Dec 2025)
**Critical Go-Live Date:** 1st November 2025

---

## Overview

This Big Room Planning session focused on preparing the Trilogy Care Portal for the Support at Home program transition, scheduled for November 1st, 2025. The roadmap spans 6 months across Discovery, Design, Development, Data, and Operations tracks.

---

## Sprint Timeline

| Sprint | Dates | Key Focus Areas |
|--------|-------|-----------------|
| Sprint 16 | 4th Aug | Collections V1 discovery |
| Sprint 17 | 18th Aug | Utilisation Rate, Supplier Data, Note Types |
| Sprint 18 | 1st Sep | Other Recipient Pages, Client HCA, Contact Uplift, Risks Needs Care Plan |
| Sprint 19 | 15th Sep | Invoices V2, Update Questionnaire, Contact Data, Supplier & Recontracting |
| Sprint 20 | 29th Sep | Amendments, Service Confirmation, Dispute Invoice, Query Invoice, Budget V2 (DATA DEADLINE) |
| Sprint 21 | 13th Oct | Auto-Approve Invoice, HCA Flow, Rep Type, Recontract Agreement, Contact Uplift, Invoice V2 |
| Sprint 22 | 27th Oct | API Testing Round 1, Documents, Budget V2 |
| Sprint 23 | 10th Nov | AI Care Plan, API Testing Round 2, Dispute Statement |
| Sprint 24 | 24th Nov | Digital Statement, Collections V2 |
| Sprint 25 | 8th Dec | Dispute Invoice, Clinical Assessment (Prescriptions) |
| Sprint 26 | 22nd Dec | Collections V2 |

---

## Critical Deliverables & Deadlines

### **29th September 2025** - Budget V2 Complete
- All client budgets converted to SAH model
- Draft budgets generated for all 11,000+ clients
- Data migrated, fully tested, and handed to operations
- 30 days for care partner training before go-live

### **1st September 2025** - Supplier Onboarding Live
- Portal becomes source of truth for supplier data
- All new suppliers register through portal
- Automatic creation in MYOB/CRM

### **October 2025** - Claim Process Testing
- Full month for "dress rehearsal" of claims process
- Test runs with dummy data
- Staff training on claim reconciliation

### **1st November 2025** - Go-Live
- Support at Home program begins
- All suppliers must be recontracted
- All clients must have signed new HCAs
- Collections process active

---

## Feature Breakdown by Track

### DISCOVERY (Pink)

**Sprint 16 (4th Aug)**
- Collections V1

**Sprint 17 (18th Aug)**
- Utilisation Rate

**Sprint 18 (1st Sep)**
- Other Recipient Pages

**Sprint 19 (15th Sep)**
- Invoices V2

**Sprint 20 (29th Sep)**
- Amendments
- Service Confirmation
- Dispute Invoice
- Auto-Approve Invoice
- Query Invoice
- HCA Flow

**Sprint 21 (13th Oct)**
- Client HCA
- Recontract Agreement

**Sprint 23 (10th Nov)**
- AI Care Plan

**Sprint 24 (24th Nov)**
- Clinical Assessment (Prescriptions)

---

### DESIGN (Blue)

**Sprint 17 (18th Aug)**
- Supplier Onboarding
- Budget V2

**Sprint 18 (1st Sep)**
- Client HCA
- Recipient Uplift
- Contact Uplift
- Risks Needs Care Plan

**Sprint 19 (15th Sep)**
- Update Questionnaire

**Sprint 20 (29th Sep)**
- Budget V2

**Sprint 21 (13th Oct)**
- Dispute Invoice

**Sprint 23 (10th Nov)**
- Dispute Statement

---

### DEV (Orange)

**Sprint 17 (18th Aug)**
- Note Types

**Sprint 18 (1st Sep)**
- Supplier Onboarding
- Risks Needs Care Plan Webhook

**Sprint 19 (15th Sep)**
- Budgets V2

**Sprint 20 (29th Sep)**
- Utilisation Rate
- Budget Preview

**Sprint 21 (13th Oct)**
- Contact Uplift
- Claim Training
- Invoice V2

**Sprint 22 (27th Oct)**
- API Testing Round 1
- Documents

**Sprint 23 (10th Nov)**
- API Testing Round 2

**Sprint 24 (24th Nov)**
- Digital Statement

**Sprint 25 (8th Dec)**
- Dispute Invoice

---

### DATA (Yellow)

**Sprint 19 (15th Sep)**
- Contact Data
- Supplier & Recontracting

**Sprint 20 (29th Sep)**
- Budget V2

**Sprint 21 (13th Oct)**
- Utilisation Rate
- Bill Claim CSV
- Claim
- Dispute Invoice

---

### OPERATIONS (Green)

**Sprint 17 (18th Aug)**
- Supplier Data

**Sprint 22 (27th Oct)**
- Budget V2 Contact
- Supplier Recontract
- Budget Preview

**Sprint 24 (24th Nov)**
- Collections V2

---

## Detailed Feature Descriptions

### **AI Care Plan**
**Sprint:** 23 (Discovery)
**Purpose:** Use AI to draft care plans with human-in-the-loop approval
**Details:**
- AI generates draft care plan from assessment data and history
- Care partner reviews and approves
- Exploratory phase - no specific delivery date beyond discovery

### **API Testing Round 1 & 2**
**Sprints:** 22 (Dev), 23 (Dev)
**Purpose:** Test government's Support at Home API integration
**Details:**
- Round 1: Pre-launch end-to-end testing (3-4 developers allocated)
- Round 2: Post-launch validation with live data
- Contingent on production API access
- CSV fallback available if API not ready

### **Amendments**
**Sprint:** 20 (Discovery)
**Purpose:** Handle Home Care Agreement amendments when client situations change
**Details:**
- Currently managed via Zoho CRM workflow
- Goal: Bring into portal to remove Zoho dependency
- Triggered by management type changes (e.g., Self-Managed to Plus)
- Creates new HCA addendum

### **Auto-Approve Invoice**
**Sprint:** 20 (Discovery), 21 (Dev)
**Purpose:** Automatically approve supplier invoices after time window
**Details:**
- Inspired by Mable's model
- 48-hour window for client review
- Auto-approved if no client intervention
- Notification sent to client
- Override period for client disputes

### **Bill Claim CSV**
**Sprint:** 21 (Data) - **Due: 29th September**
**Purpose:** Contingency method to submit claims via CSV if API not ready
**Details:**
- CSV format per Services Australia template
- Compiles all billables for monthly subsidy claims
- October used for test runs
- Plan to switch to API when available

### **Budget Preview**
**Sprint:** 20 (Data/Ops) - **Due: 29th September**
**Purpose:** Generate draft budgets for all clients ahead of SAH launch
**Details:**
- Shows snapshot of upcoming budget under new rules
- Care partners review ~200-250 budgets each
- 90% accuracy target acceptable for training
- 30-day lead time for adjustments and client communication
- Tied to Budget V2 and Utilisation Rate

### **Budget V2**
**Sprints:** 17 (Design), 19-20 (Dev/Data) - **HARD DEADLINE: 29th September 2025**
**Purpose:** Second version of budgeting system for SAH funding model
**Details:**
- Introduces budget versions (service plan versions)
- Supports quarterly funding periods
- New subsidy and co-payment rules
- Migrate all existing package budgets to new structure
- **"Finished" = dev done, data migrated, fully tested, handed to ops**
- Every client's budget converted to draft by end September
- Ready to publish 1st November
- **Critical path item with cross-team dependencies**

### **Budget V2 Contact**
**Sprint:** 22 (Operations)
**Purpose:** Contact all ~11,000 clients about new budgets
**Details:**
- Communication plan for Budget V2 rollout
- Letters/emails to all clients
- One-on-one calls for high-impact cases
- Staff prepared for client conversations
- Identify which clients need direct contact vs notification

### **Claim**
**Sprint:** 21 (Data) - **Due: 29th September**
**Purpose:** Build claims submission process for government subsidies
**Details:**
- Fortnightly/monthly claim cycles
- Transform invoice data into remittance/claim file
- Marco and Gus working on data transformations
- October = "dress rehearsal" month
- Can test with dummy data before Budget V2 complete
- Validate 10% client contribution vs 90% subsidy split

### **Claim Training**
**Sprint:** 21 (Dev/Ops)
**Purpose:** Internal testing and training on claim submission
**Details:**
- Full month of October for testing in test environment
- Finance/claims staff learn claim workflow
- Review and reconcile claim outputs
- Handle errors and edge cases
- Prepare for real money in November

### **Client HCA (Home Care Agreement)**
**Sprint:** 18 (Design), 21 (Discovery)
**Purpose:** Enable clients to digitally sign HCA via Portal
**Details:**
- Discovery session: 18th August
- Tile on client dashboard for "Home Care Agreement"
- Client/representative can review and sign contract
- Currently done via DocuSign or PDF outside portal
- Triggered when package created or lead converted
- Remove dependency on external signing tools

### **Clinical Assessment (Prescriptions)**
**Sprint:** 24 (Discovery)
**Purpose:** Handle clinical prescriptions for assistive equipment
**Details:**
- Certain purchases require clinical prescription/assessment
- Capture OT/clinician recommendations
- Link prescriptions to claims
- Flag when "OT recommended item X"
- If API not ready: manual workflow
- Includes continence assessment flow
- Awaiting list of professions allowed to prescribe each item
- Hold bills until prescription verification

### **Collections V1**
**Sprint:** 16 (Discovery) - **Must-do for this quarter**
**Purpose:** Initial system for collecting client fees (co-payments)
**Details:**
- SAH introduces 10% client contributions
- Automatically charge or follow up with clients
- Identify unpaid contributions, generate invoices/reminders
- First collections in November after services start
- Confidence rating: 5/5 from team
- Collections V2 planned for advanced features later

### **Collections V2**
**Sprints:** 24, 26 (Operations)
**Purpose:** Advanced collections functionality
**Details:**
- Payment plans
- Advanced dunning processes
- Deeper direct debit integration
- Handle edge cases at scale
- Deferred to later timeline
- Scoping ticket created

### **Contact Data**
**Sprint:** 19-20 (Data)
**Purpose:** Verify and improve contact information for all clients
**Details:**
- Ensure correct representative/nominee on record
- Pull data from My Aged Care for 11,000+ clients
- MAC registers official "representatives" and "supporters"
- May need to scrape MAC if API doesn't provide contacts
- Critical for HCA signing (send to right person)
- Required for notifications to correct family member

### **Contact Uplift**
**Sprint:** 18 (Design), 21 (Dev)
**Purpose:** Redesign contact pages UI/UX
**Details:**
- Current: Cards with all roles (very cluttered)
- New: Cleaner table/list view
- Some contacts have "40 different roles"
- Quick action to email care team
- Incorporate Rep/Supporter distinction visually
- Straightforward: "just changing to a list"

### **Digital Statement**
**Sprint:** 24 (Dev - late November)
**Purpose:** Provide clients with digital monthly statements
**Details:**
- First SAH statements generated in November
- Show fees, subsidies, and spending online
- PDF or web view in portal
- Consolidates transaction, contribution data
- Timed for end of November when first statements due

### **Dispute Invoice**
**Sprint:** 20 (Discovery), 21 (Design), 25 (Dev)
**Purpose:** Allow formal invoice disputes
**Details:**
- Client clicks "Dispute" on invoice with reason
- Alerts Trilogy staff (email to Brian in finance)
- Invoice-level (not line-item level) to avoid multiple disputes
- Business rules: don't pay supplier until resolved
- Ties to contracting/supplier agreements
- Later deliverable after core billing stable

### **Dispute Statement**
**Sprint:** 21 (Design), 23 (Dev)
**Purpose:** Dispute monthly statements
**Details:**
- Similar to Dispute Invoice but for aggregated statements
- Flag statement entries client doesn't recognize
- Workflow for staff response
- Shares logic with Dispute Invoice
- Nice-to-have if time permits

### **Documents**
**Sprint:** 22 (Dev)
**Purpose:** Document Library for storing files against client records
**Details:**
- Store care plans, assessments, consents
- Nice-to-have feature
- Groundwork exists: upload behind feature flag
- Need UI to list package documents
- Security/access control required
- Care partners can upload PDF (e.g., OT assessment) to client profile

### **Invoice V2**
**Sprint:** 19 (Discovery), 20 (Design), 21 (Dev)
**Purpose:** Next iteration of invoice management UI and logic
**Details:**
- Redesign invoice page and data structure
- Distinguish transactions vs invoices
- Invoices may contain multiple service transactions
- Show line-item details better
- New statuses: disputes, queries, auto-approved
- Ready for November invoice flow

### **Note Types**
**Sprint:** 17-18 (Dev)
**Purpose:** Add new standardized note categories
**Details:**
- Back-end/config task only (no design needed)
- "Just enum changes"
- New classifications: Prescription, Care Plan Follow-up, Risk, etc.
- Align with Risks and Needs updates
- Internal configuration only

### **Other Recipient Pages**
**Sprint:** 18 (Discovery)
**Purpose:** Improve various recipient-side portal pages
**Details:**
- Currently card-heavy, not well sectioned
- Long scrolls of care team, budgets, services info
- Better organization needed
- Clearer menu/navigation
- Contacts page main example (see Contact Uplift)
- Prescribed vs configurable dashboard
- UX cleanup for SAH changes

### **Query Invoice**
**Sprint:** 20 (Discovery)
**Purpose:** Allow clients to ask questions about invoices
**Details:**
- Clarification without formal dispute
- Mark invoice with comment: "I don't recognize this charge"
- Notifies Trilogy staff for review
- Invoice-level (not per line-item)
- May resolve with coordinator explanation
- Step below formal dispute
- Portal UI: "Query" button on invoice
- Creates task for accounts support

### **Recipient Uplift**
**Sprint:** 18 (Design), 21 (Design)
**Purpose:** Broad improvements to recipient user experience
**Details:**
- Higher-level changes: navigation, capabilities
- Clearer menu structure for recipients
- Summary dashboard ("window into other pages")
- HCA signing tile added to dashboard
- Self-service features from survey feedback
- Mobile optimization (~40% users on mobile)
- Overlaps with Other Recipient Pages

### **Recontract Agreement**
**Sprint:** 21 (Discovery/Ops) - **Must-do this quarter**
**Purpose:** All existing clients sign new HCA
**Details:**
- SAH mandates HCP clients transition to new HCA by November
- Generate new agreements
- Send portal invites to all active clients or reps
- Track who has signed, send reminders
- Must have correct Contact Data
- E-signature capability in portal
- Complete by end October so 1 Nov all clients agreed

### **Rep Type**
**Sprint:** 21 (Discovery)
**Purpose:** Distinguish Representative vs Supporter
**Details:**
- Representative: Makes decisions on behalf of client
- Supporter: Assists client (limited authority)
- Add field/attribute to contact records
- Affects HCA signing (need to know who is legal rep)
- May ingest from My Aged Care
- Every contact marked: Representative, Supporter, or neither
- Ties to Contact Data cleanup

### **Risks Needs Care Plan**
**Sprint:** 17-18 (Dev)
**Purpose:** Update Risks and Needs to meet Strengthened Quality Standards
**Details:**
- Add new fields/options
- Tag high-risk items
- Link needs to goals
- Client Assessment Questionnaire populates data
- Indicator flag for risk factors
- Satisfy compliance requirements
- Feed into AI features and prioritization
- Early-mid August implementation
- Already scoped, just code tickets

### **Service Confirmation**
**Sprint:** 20 (Discovery)
**Purpose:** Confirm services delivered
**Details:**
- Clients/staff acknowledge scheduled service occurred
- Booking service = implicit confirmation in Trilogy model
- Explicit confirmation for some cases
- UI prototype in Figma
- Send prompt after visit: "Did service X occur? Yes/No"
- Ties to auto-approving invoices
- Integration with scheduling/booking calendar
- Link confirmation status to invoice approval logic
- Reduce billing disputes

### **Supplier & Recontracting**
**Sprint:** 19 (Data/Ops) - **Critical: 100% by November**
**Purpose:** Recontract all existing suppliers under new terms
**Details:**
- Every provider signs updated agreements by November
- New pricing structures
- 100% recontracted or offboarded (else bills held)
- Identify all active suppliers, send contracts, track responses
- Not-recontracted invoices → "verification with compliance" queue
- May automate email to provider
- Add field: "Recontracted = Y/N" on supplier profiles
- Already underway in parallel with other tasks

### **Supplier Data**
**Sprint:** 17 (Operations), 18 (Design/Dev)
**Purpose:** Data migration/cleanup for suppliers ahead of SAH
**Details:**
- Tied to Supplier Onboarding project
- Import supplier lists, ABNs, bank details
- New attributes: service categories, agreed rates under new codes
- Map suppliers to services they offer under new scheme
- Load government-approved service categories and prices
- Must be done pre-1 November
- Runs in parallel to billing changes

### **Supplier Onboarding**
**Sprint:** 17-18 (Design/Dev) - **Go-live: 1st September 2025**
**Purpose:** Enable new suppliers to register online
**Details:**
- Portal = source of truth for supplier info
- Registration form with ABN lookup
- Creates supplier in MYOB/CRM automatically
- Eliminates Zoho forms process
- Must-do (first on list)
- "Every supplier can now originate from portal"
- After 1 Sep: all new providers through portal only
- Ties to recontracting: new suppliers must onboard via portal
- Streamlines provider registration

### **Supplier Recontract**
**Sprint:** 22 (Operations)
**Purpose:** Process for re-signing existing suppliers
**Details:**
- Automated/semi-automated approach
- Electronic signature collection at scale (hundreds of suppliers)
- Possibly via Supplier Portal or special page
- Fallback: CRM's existing form system (DocuSign)
- No supplier services after Nov 1 without new agreement signed
- No explicit portal UI described - may use existing tools

### **Update Care Plan Webhook**
**Sprint:** 18 (Dev)
**Purpose:** Notify other systems when Care Plan updated
**Details:**
- Webhook to update Zoho CRM when care plan changes
- Quick integration task
- Keeps data in sync across platforms
- Trigger audit log
- Behind-the-scenes technical enhancement
- Push notification when care plan changed (goals, services, etc.)

### **Update Questionnaire**
**Sprint:** 19 (Design)
**Purpose:** Revise client intake/assessment questionnaire for SAH
**Details:**
- Capture all necessary SAH data
- Update as Risks and Needs change
- New questions: representative info, existing equipment, etc.
- Map responses to Care Plan
- Align with government assessment form changes
- Pat (clinical) involved in crafting questions
- Before new clients onboard under SAH (ideally by Oct)

### **Utilisation Rate**
**Sprint:** 17 (Discovery), 20 (Dev)
**Purpose:** Display client budget utilization percentage
**Details:**
- Show how much of budget used so far
- Flag clients under/over target
- Target: 90-100% utilization
- Prioritize clients during transition
- Dashboard metric: progress bar or percentage
- Calculate current services vs new budget
- "Quick one – a four-hour quick one"
- Identify low-utilization clients by late September
- Alert coordinators post-launch for unused funds
- Calculation on existing data

---

## Key Dependencies & Risks

### Critical Dependencies
1. **Budget V2 → Everything else** - Most features depend on new budget structure
2. **Contact Data → HCA signing** - Must have correct contacts before agreements
3. **Supplier Recontracting → Billing** - No payment to unrecontracted suppliers
4. **API Availability** - Government API access required for claims; CSV fallback exists
5. **Government Policy** - Final SAH rules may affect implementation

### Major Risks
1. **API Not Ready** - CSV fallback prepared for claims
2. **Supplier Recontracting** - Not all suppliers may recontract in time
3. **Data Migration** - 11,000+ client budgets must convert correctly
4. **Contact Accuracy** - Wrong contacts = wrong people signing agreements
5. **Training Time** - 30 days to train care partners on new budgets (post-29 Sep)

---

## Confidence Levels (Team Vote)

**Collections V1:** 5/5 - Everyone confident
**Budget V2:** High priority, hard deadline set
**Utilisation Rate:** Quick implementation expected
**Supplier Onboarding:** Essentially complete

---

## Must-Do Items (Non-Negotiable)

1. **Budget V2** - 29th September deadline
2. **Supplier Onboarding** - 1st September go-live
3. **Collections V1** - Required for November
4. **Recontract Agreement** - All clients by November
5. **Supplier & Recontracting** - 100% by November
6. **Claim & Bill Claim CSV** - Ready by 29th September

---

## Nice-to-Have Items

1. **Documents** - Document Library feature
2. **Contact Uplift** - UI polish
3. **Dispute Statement** - If time permits
4. **AI Care Plan** - Exploratory only

---

## Team Allocation Highlights

- **3-4 developers** for API Testing Round 1
- **Data team** (Marco, Gus) handling claims transformations
- **Bruce, Erin, Cara** did initial amendments discovery
- **Romy** and design team on Client HCA UI/UX
- **Pat (clinical)** involved in questionnaire updates
- **~200-250 budgets per care partner** for review

---

## Key Quotes from Meeting

- **"Finished" definition:** "Not just dev done, but data migrated, fully tested, and handed over to ops"
- **On suppliers:** "100% of suppliers recontracted or offboarded, otherwise bills will be held"
- **On timeline:** "We have to contact every [client] because their budget's being converted to Support at Home"
- **On testing:** "Full month of October for testing claims in a test environment"
- **On auto-approve:** "Auto-approved by default after 48 hours unless the client explicitly rejects it"

---

## Post-Implementation (Post Nov 1st)

- API Testing Round 2 validates live integration
- Digital Statements generated end of November
- Collections activities begin with first client contributions
- Dispute Invoice/Statement features deployed
- AI Care Plan remains in exploratory phase
- Collections V2 and advanced features next quarter

---

## Success Criteria

✅ All client budgets converted by 29 Sep
✅ All suppliers onboarded via portal by 1 Sep
✅ 100% suppliers recontracted by 1 Nov
✅ All clients signed new HCA by 1 Nov
✅ Claims process tested and operational
✅ Collections system live for November contributions
✅ Portal ready for SAH program launch

---

*This summary synthesizes the BRP roadmap, transcript discussions, and feature requirements for the Support at Home transition planning. All dates and dependencies should be continuously monitored as the program approaches go-live.*
