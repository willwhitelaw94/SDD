---
title: "TP 3587 STR Supplier Self Termination: Idea Brief"
description: "Supplier Management > Supplier Onboarding > TP 3587 STR Supplier Self Termination"
---


**Epic Code**: Supplier Self
**Created**: 2026-01-14

## Problem Statement (What)

- Suppliers have no way to independently terminate their profile within the Portal
- Manual termination requests must be processed by staff via offline channels (Zoho)
- Inactive suppliers may remain "active" in the system, appearing in search results
- Staff face operational bottlenecks processing manual termination requests
- No clear compliance/data integrity controls for supplier lifecycle management

## Possible Solution (How)

Enable suppliers to independently deactivate their profile within the Portal
- Create controlled termination workflow with confirmation and cooling-off period
- Implement automatic compliance notification to Trilogy Care staff
- Design reactivation pathway for suppliers who wish to resume operations
- Establish audit trails for all termination actions

**Before**: Manual process via Zoho; incomplete supplier lifecycle; compliance gaps

**After**: Self-service termination; clear deactivation status; automatic notifications

## Benefits (Why)

- Improves supplier experience with self-service capabilities
- Reduces manual staff workload for supplier offboarding
- Ensures data integrity with inactive suppliers removed from searches
- Provides clear audit trail for compliance purposes
- Enables quick reactivation for returning suppliers

## Owner (Who)

**Steven Boge**
- Product Manager

## Other Stakeholders (Accountable / Consulted / Informed)

Role Name Responsible Accountable Consulted Informed ----------------------------------------------------------- Product Steven Boge X Engineering Lead TBD X Compliance Officer TBD X Supplier Relations TBD X

## Assumptions & Dependencies, Risks

### Assumptions

- Assumption: Suppliers have authority to terminate their own accounts
- Assumption: No outstanding payments/obligations need to be cleared
- Dependency: Zoho sync can accommodate portal-initiated terminations
- Dependency: Reactivation workflow aligns with onboarding requirements

### Dependencies

- [Dependencies to be defined]

### Risks

Risk Impact Probability Mitigation -------------------------------------- Accidental termination by supplier Medium Medium Confirmation flow and cooling-off period Outstanding payment/obligation issues High Medium Validation checks before termination Reactivation complexity Medium Low Clear process documentation and support
- [Risks to be identified]

## Estimated Effort

**T-Shirt Size**: M (2-4 sprints) Breakdown:
- Workflow Design & Requirements: 0.5 sprints
- Portal Development: 1.5 sprints
- Integration & Testing: 0.75 sprints
- Launch & Communications: 0.25 sprints

## Proceed to PRD?

**YES**
- Feature scope is clear with good technical feasibility. Reason: User story is straightforward; compliance approach defined; integration points identified.
