---
title: "Feature Specification: Multi-Package Support for Restorative Care & End of Life"
---


**Feature Code**: TP-2432
**Initiative**: TP-1859 (Clinical And Care Plan)
**Epic**: TP-2432 - Multi-Package Support
**Created**: 2025-12-07
**Status**: Draft

---

## Overview

Enable clients to have multiple active service packages concurrently, with separate care planning, coordination, and invoicing for each package. This supports Trilogy Care's new restorative care and end-of-life care pathways, allowing clients to maintain their ongoing support package while receiving specialized clinical services.

**Core Business Need**: Clients participating in restorative care or end-of-life programs require distinct care management models, funding streams, and service coordination that cannot coexist within a single package structure.

---

## Problem Statement

### Current State
- Portal enforces one-to-one relationship between clients and packages
- Clients cannot simultaneously receive both:
  - Ongoing support (self-managed or with standard care coordinator)
  - Restorative care (fully coordinated, clinical oversight)
  - End-of-life care (fully coordinated)
- Results in forced package modifications or workarounds that break audit trails

### Scenarios Creating Demand

**Scenario 1: Restorative Care Concurrent with Ongoing Support**
- Client: Jane, receiving Level 7 Support at Home (self-managed)
- Gets approved for restorative care program
- Needs: Separate physiotherapy package with clinical coordination
- Current blocker: Cannot maintain both simultaneously

**Scenario 2: End-of-Life Care Package**
- Client: Robert, receiving Level 4 Support at Home
- Approved for end-of-life care
- Current package becomes dormant (not terminated)
- New EOL package becomes active
- If client survives 12+ weeks, original package can reactivate
- Current blocker: No way to model dormancy/reactivation

**Scenario 3: Cross-Provider Scenario**
- Client: Maria, has ongoing package with Provider A (doesn't offer restorative care)
- Gets approved for restorative care, comes to Trilogy for that service only
- Needs: Separate restorative care package with Trilogy, independent of other provider
- Current blocker: Would lose original package if flagged as Trilogy client

### Current Workarounds & Their Costs
- Manual care circle management across records
- Duplicate needs assessments, goals, risks
- Unclear invoicing accountability
- Lost audit trail on package modifications
- Unable to properly track Service Australia's "concurrent packages" model

---

## User Stories & Scenarios

### User Story 1: Create Restorative Care Package

**As a** Care Coordinator (Romy, Jill)
**I want to** establish a separate restorative care package for a client already in our system
**So that** I can manage specialized clinical services independently from their ongoing package

**Acceptance Criteria:**
- Can create new package for existing client without modifying existing package
- New package can be assigned to different care partner (clinical specialist)
- New package can have different coordination settings (fully coordinated)
- Existing package remains untouched and fully active
- Both packages appear linked in system (user can see relationship)

**Happy Path Scenario:**
1. Navigate to client "Jane Recipient" profile
2. See existing package: "Level 7 Support at Home"
3. Click "Add Another Package" or "Create Restorative Care Package"
4. System shows: "Jane already has 1 active package"
5. Fill form:
   - Package Type: Restorative Care
   - Coordination: Fully Coordinated
   - Care Partner: Dr. Sarah (Clinical)
   - Care Coordinator: [Clinical Coordinator]
   - Funding Stream: Restorative Care (Services Australia)
6. Confirm creation
7. Both packages now visible on client dashboard (selectable)

**Alternative Scenario: End of Life Package Creation**
- Same flow but Package Type = "End of Life"
- Care Partner required but different specialization
- Original package shows as "Dormant" (not active for billing)

---

### User Story 2: Manage Separate Care Plans per Package

**As a** Care Coordinator
**I want to** create separate care plans for restorative care and ongoing support
**So that** each plan reflects the distinct clinical and service goals

**Acceptance Criteria:**
- Can view needs/goals/risks separately per package
- Each package has independent care plan document
- Restorative care plan marked as such (for printing/delivery to Services Australia)
- Ongoing plan remains unchanged while restorative plan is created
- Care plan exports distinguish between package types

**Scenario:**
1. Open client "Jane Recipient"
2. Select "View Package": Level 7 Support at Home
3. See current care plan (personal care, domestic assistance, transport)
4. Switch to other package: "Restorative Care"
5. Care plan section shows: "No care plan yet"
6. Click "Create Care Plan"
7. Assess needs specific to restorative care:
   - Physiotherapy
   - Wound care
   - Pain management
8. Create distinct goals for restorative pathway
9. Print generates: "Restorative Care Plan - Jane Recipient"
10. Original ongoing plan unaffected

---

### User Story 3: Route Services & Invoicing to Correct Package

**As a** Care Coordinator/Finance
**I want to** ensure bills are charged to the correct package/funding stream
**So that** we maintain funding compliance and accurate financial tracking

**Acceptance Criteria:**
- When creating budget plan items, can assign to specific package context
- Bill creation interface shows which package bill applies to
- Cannot mix services across packages in single bill (unless explicitly allowed)
- Service duplication prevention:
  - If physiotherapy billed to restorative, cannot also bill physiotherapy to ongoing (without exception)
  - Exceptions can be documented
- Invoice generated shows package context clearly
- Services Australia submission correctly attributes funding

**Scenario:**
1. Create bill for Jane from physio supplier
2. Bill amount: $1,500
3. System shows: "Jane has 2 active packages"
4. Asks: "Which package is this for?"
5. Options:
   - Level 7 Support at Home (Ongoing)
   - Restorative Care
6. Select: Restorative Care
7. System checks: "Jane doesn't have physiotherapy in her ongoing budget - good"
8. Bill routed to restorative care funding
9. Invoice shows coordination loading (clinical) vs standard loading

---

### User Story 4: Terminate One Package Without Affecting Other

**As a** Care Coordinator
**I want to** end a restorative care package while maintaining ongoing support
**So that** when the program concludes, the client's regular support continues uninterrupted

**Acceptance Criteria:**
- Can terminate restorative care package independently
- Ongoing package status unchanged
- Can set cessation date for one package only
- Bills for terminated package have 30-day deadline
- Other package billing continues normally
- Care circle and existing goals preserved

**Scenario:**
1. Open Jane's restorative care package
2. Click "Manage Package" → "Terminate Package"
3. Set cessation date: 2025-12-31
4. Confirm: "This will end only the Restorative Care package"
5. Warning: "Ongoing Level 7 package will remain active"
6. Confirm termination
7. Restorative care package shows "TERMINATED"
8. Bills must be submitted by 2025-12-30
9. Ongoing package unaffected - continues normal service delivery

---

### User Story 5: View Unified Client Dashboard with Multiple Packages

**As a** Care Coordinator
**I want to** see all of a client's packages in one place and switch between them
**So that** I have complete visibility into their care without navigating away

**Acceptance Criteria:**
- Client dashboard shows list/tabs of all packages
- Can clearly see which packages are active, dormant, or terminated
- Quick switching between packages without page reload
- Timeline shows events from all packages (with package identifier)
- Care circle shared or distinguished as needed
- Statement/dashboard summary aggregates key metrics

**Scenario:**
1. Go to Jane's profile
2. See section: "Jane's Packages (2 active)"
3. Package 1: "Level 7 Support at Home" (Active since 2024-01-15)
4. Package 2: "Restorative Care" (Active since 2025-11-01)
5. Click Package 1 → view its budget, bills, timeline
6. Click Package 2 → switch context, view its budget, bills, timeline
7. Timeline tab shows all events across both packages
8. Statement section: options for "Combined" or "Per-Package" view

---

## Functional Requirements

### FR-1: Multiple Package Records
- System must support multiple packages per client (has-many relationship)
- Remove database constraints enforcing one-to-one relationship
- Each package maintains independent: budgets, bills, needs, goals, risks, care plans
- Packages can be linked/related (for audit and relationship tracking)

### FR-2: Package Type Classification
- Introduce package types: STANDARD, RESTORATIVE_CARE, END_OF_LIFE
- Type determines:
  - Coordination model (fully coordinated vs self-managed)
  - Care management billing rules
  - Funding stream options
  - Care planning requirements
  - Service overlap prevention rules

### FR-3: Care Partner Assignment
- Support multiple care partners per client (across packages)
- Can assign different care partner to each package
- Care partner per package is independent:
  - Package 1: John (standard support)
  - Package 2: Dr. Sarah (clinical specialist)
- UI must make package-partner association clear

### FR-4: Package Context Awareness
- All package-specific operations require explicit package selection
- System maintains "active package" context for session
- Package context shown in breadcrumbs/headers throughout UI
- Switching packages updates all contextual displays

### FR-5: Care Plan Separation
- Each package has independent care plan
- Restorative care and end-of-life packages require separate needs assessment
- Print/export of care plans shows package type
- Services Australia submissions correctly attribute care plans to packages

### FR-6: Budget & Invoicing per Package
- Budget plans created/managed per package
- Bills routed to specific package when created
- Cannot bill across packages without explicit authorization
- Funding reconciliation tracked per package
- Statements generated per package (or combined with clear attribution)

### FR-7: Service Non-Duplication
- System prevents same service appearing in both packages without exception
- Example:
  - If "Physiotherapy" billed to Restorative package, cannot bill "Physiotherapy" to Ongoing package
  - Can document exceptions: "Exception approved: Dual physio due to [reason]"
- Validation occurs at bill creation time

### FR-8: Independent Termination
- Can terminate one package while others remain active
- Termination applies only to selected package
- Other packages unaffected in status, billing, or functionality
- Terminated package has 30-day bill submission deadline (standard)
- Other packages continue normal operations

### FR-9: End-of-Life Package Dormancy
- When EOL approved, original package transitions to "DORMANT" (not TERMINATED)
- EOL package becomes active
- If client passes or 12 weeks elapses, EOL can end
- Original dormant package can reactivate via urgent support plan review
- System shows dormancy status clearly (not confused with termination)

### FR-10: Cross-Provider Support
- Clients can have packages with different providers
- Trilogy Care can manage one package (e.g., restorative) while other provider manages another
- No assumption of single-provider relationship
- Funding and billing tracked independently per package

### FR-11: Interim Tag-Based Filtering
- Re-enable package tags UI (currently missing)
- Support filtering by package type tags
- Allow staff to identify restorative care and EOL packages in lists
- Tags can be added/removed for workflow flagging

### FR-12: Unified Visibility Without Losing Package Context
- Timeline view can show events across packages (with package identifier)
- Care circle can show all shared contacts (or package-specific subsets - TBD with design)
- Dashboard summarizes all packages but allows drilling into specific package details
- No loss of information, all data accessible

---

## Data Model

### New/Modified Entities

**Package Entity - NEW FIELDS**
```
- package_type: ENUM(STANDARD, RESTORATIVE_CARE, END_OF_LIFE)
- linked_package_id: BIGINT FK (references another Package for relationships)
- is_active: BOOLEAN (false for dormant/terminated)
- primary_care_partner_id: BIGINT FK (existing, but now independent per package)
- created_at: TIMESTAMP (add if missing, for timeline tracking)
- tags: JSON array (for workflow flagging)
```

**Remove Constraints**
- `packages.recipient_id` UNIQUE → Remove (allow multiple)
- `packages.care_recipient_id` UNIQUE → Remove (if exists, allow multiple)

**Care Partner Assignment** (many-to-many)
- New table: `package_care_partners`
- `package_id` FK, `care_partner_id` FK, `role_type` ENUM
- Allows: Multiple partners per package, role distinction

**Package-Specific Needs**
- `package_needs.package_id` FK (already exists)
- No changes needed, queries just need package filter

**Package-Specific Budget Plans**
- `budget_plans.package_id` FK (already exists)
- No changes needed, existing structure supports

**Service Duplication Exceptions**
- New table: `service_duplication_exceptions`
- `package_id`, `service_type`, `reason`, `approved_by`, `approval_date`
- Allows documented exceptions to non-duplication rule

---

## Success Criteria

### Functional Success
1. **Multiple Packages Supported**: Clients can have 2+ active packages without data loss or corruption (testable: create 2 packages for same client, verify both accessible and independent)
2. **Restorative Care Workflow**: Care coordinator can create restorative care package for existing client in under 2 minutes (testable: time-box user task in production)
3. **Service Non-Duplication Enforced**: System prevents duplicate services across packages and documents exceptions (testable: attempt to bill same service to 2 packages, system blocks with exception flow)
4. **Independent Termination**: Can terminate one package while others remain active with full functionality (testable: terminate restorative care, verify ongoing package operations unchanged)

### Operational Success
5. **Financial Accuracy**: All invoices correctly attributed to packages with >99.5% accuracy (testable: audit bill routing against Services Australia submissions)
6. **Care Plan Compliance**: Restorative care and EOL care plans meet Services Australia requirements (testable: submit to Services Australia, track approval)
7. **Staff Efficiency**: Care coordinators report equal or better efficiency managing multiple packages vs. previous workarounds (testable: measure time per client task)

### User Experience Success
8. **Package Visibility**: Users can identify which package they're viewing in <1 second on any screen (testable: navigation test with stakeholders)
9. **Context Clarity**: No confusion between packages; billing routed correctly on first attempt 95% of the time (testable: invoice creation tasks, error rate tracking)
10. **Unified View Completeness**: Timeline, dashboard, and reports show all packages with clear attribution (testable: generate reports, verify completeness)

---

## Assumptions

1. **Package Type is Core**: Package type (STANDARD vs RESTORATIVE vs EOL) is the primary driver of behavior differences
2. **Services Australia Model Valid**: Services Australia expects/accepts multiple package records per client (confirmed in meeting)
3. **Care Partner Specialization**: Clinical packages will have different care partners than ongoing packages (confirmed need)
4. **Funding Streams Separate**: Restorative care and EOL have distinct Services Australia funding streams from ongoing support (confirmed)
5. **Concurrent is Norm for Restorative**: Restorative care packages will almost always run concurrent with ongoing (not sequential) (confirmed from Romy's scenarios)
6. **Cross-Provider Supported**: System architecture already supports managing clients with multiple providers (no additional work needed)

---

## Scope & Boundaries

### In Scope
- ✅ Multiple package records per client
- ✅ Package type differentiation
- ✅ Independent care planning per package
- ✅ Independent budget/invoicing per package
- ✅ Multiple care partner support
- ✅ Service non-duplication enforcement
- ✅ Package termination (independent)
- ✅ End-of-life dormancy modeling
- ✅ Tag-based filtering for workflow
- ✅ Unified client dashboard with package switching
- ✅ Care plan print/export per package

### Out of Scope (Future)
- ❌ Automatic cross-package funding allocation
- ❌ Predictive service recommendations across packages
- ❌ Automated care plan merging/comparison tools
- ❌ Real-time cross-package analytics dashboard
- ❌ Mobile-first package management (desktop-first in Phase 1)

### Dependencies
- **Services Australia API**: Must support multiple packages in sync (assumed working based on current integration)
- **Care Coordinator Training**: Staff training on new package model (separate initiative)
- **Finance/Invoicing Process Update**: Workflow changes for multi-package billing (owner: Finance team)

---

## Key Concerns & Open Questions

[NEEDS CLARIFICATION: Care Circle Behavior]
- **Question**: When a client has multiple packages, should the care circle be shared across both, or managed separately per package?
- **Impact**: Affects UI complexity and data governance
- **Options**:
  - A: Shared care circle (contact appears on both packages)
  - B: Separate per package (contact added independently to each)
  - C: Hybrid (some contacts shared, some per-package)
- **Recommendation**: Option A (shared) is simpler initially, can refine later

[NEEDS CLARIFICATION: Statement/Reporting Format]
- **Question**: How should financial statements be presented with multiple packages?
- **Impact**: Affects finance reconciliation and client reporting
- **Options**:
  - A: Combined statement showing all packages with clear sections
  - B: Separate statement per package (multiple documents sent)
  - C: Toggle-able view (user selects combined or separate)
- **Recommendation**: Option C (toggle) gives flexibility

[NEEDS CLARIFICATION: Cross-Package Timeline]
- **Question**: Should timeline show events from all packages or only active package?
- **Impact**: Affects visibility and context awareness
- **Options**:
  - A: All events, with package label (busy but complete)
  - B: Active package only (simple but less visibility)
  - C: Toggle between all/current (flexible)
- **Recommendation**: Option C (toggle) for flexibility

---

## Implementation Notes

### Architectural Recommendation
- **Approach**: Multiple Package Records (not segmented single package)
- **Rationale**: Cleaner separation, aligns with Services Australia model, supports future multi-package scenarios
- **Phased Rollout**:
  - Phase 1: Database changes + model refactoring
  - Phase 2: UI package selector + context awareness
  - Phase 3: Integration testing + client rollout

### Interim Solution (0-2 days)
While full implementation in progress, support immediate client needs:
1. Re-enable package tags UI
2. Add "Restorative Care Check-in" note type for care management tracking
3. Create Trilogy Care as supplier for care management invoicing
4. Document manual workflow for staff

### Technical Debt Addressed
- Fixes terminated package history issue (Anthony's concern in meeting)
- Provides foundation for future multi-provider scenarios
- Establishes clear package typing for regulatory compliance

---

## Success Metrics for Validation

Post-launch measurement:
1. **Functionality**: Can create/manage 2+ packages per client without errors
2. **Compliance**: Restorative care and EOL packages meet Services Australia requirements
3. **Efficiency**: Staff time to manage multi-package clients ≤ original workaround time
4. **Accuracy**: >99.5% bills routed to correct package
5. **Adoption**: 100% of new restorative/EOL clients use multi-package model by [date]

---

## Related Documentation

- Meeting Transcript: `.claude/INITIATIVES/urgent-need-for-two-packages-for-one-client-in-portal-2fac6f4e-746b.pdf`
- Current Architecture: Domain Package model, Funding structure, Care coordination
- Services Australia Integration: Existing PRODA sync, funding stream sync
