---
title: "TP 2478 SVF Supplier Service Verification Features: Idea Brief"
description: "Supplier Management > Supplier Onboarding > TP 2478 SVF Supplier Service Verification Features"
---


**Epic Code**: Supplier Service Verification Features
**Created**: 2026-01-14

## Problem Statement (What)

- Suppliers lack sufficient verification of service delivery capabilities under Support at Home reforms
- Current compliance tracking does not provide clear visibility into supplier service status
- Manual verification processes create bottlenecks and are inconsistent
- Compliance officers spend excessive time validating unverified service statuses
- Expired or unverified services can cause bill payment holds, delaying critical care delivery

## Possible Solution (How)

Implement unified compliance module for supplier service verification
- Create automated workflows for document expiry reminders and verification triggers
- Develop supplier self-service portal for document management and compliance updates
- Integrate bill hold triggers when services are unverified
- Establish audit trails and compliance reporting

**Before**: Manual verification; unclear service status; manual reminder systems; payment delays

**After**: Automated verification; clear compliance status; self-service capabilities; streamlined billing

## Benefits (Why)

- Improves compliance accuracy and regulatory adherence
- Reduces manual verification workload for compliance teams
- Prevents payment delays from unverified services
- Enhances supplier visibility into compliance requirements
- Provides comprehensive audit trails for regulatory bodies

## Owner (Who)

**Steven Boge**
- Product Manager

## Other Stakeholders (Accountable / Consulted / Informed)

Role Name Responsible Accountable Consulted Informed ----------------------------------------------------------- Product Steven Boge X Engineering Lead TBD X Compliance Officer TBD X Billing/Finance TBD X

## Assumptions & Dependencies, Risks

### Assumptions

- Assumption: Suppliers are capable of self-managing documents
- Assumption: Compliance criteria are well-documented and standardized
- Dependency: Document management system must support uploads and expiry tracking
- Dependency: Billing system can implement payment holds based on compliance flags

### Dependencies

- [Dependencies to be defined]

### Risks

Risk Impact Probability Mitigation -------------------------------------- Supplier resistance to compliance requirements High Medium Clear communication and training resources Service disruption from verification holds High Low Staged rollout with grace periods Document format/acceptance disputes Medium Medium Provide clear acceptance criteria and examples
- [Risks to be identified]

## Estimated Effort

**T-Shirt Size**: L (4-6 sprints) Breakdown:
- Discovery & Compliance Workflow Design: 1 sprint
- Self-Service Portal Development: 1.5 sprints
- Verification Engine & Bill Holds: 1.5 sprints
- Testing, Training & Launch: 1.5 sprints

## Proceed to PRD?

**YES**
- Feature has clear requirements and strong business justification. Reason: Compliance requirements are well-defined; user needs validated; technical approach understood.
