---
title: "Service Booking"
---


**Epic Code**: APA  
**Created**: 2026-01-14

## Problem Statement (What)

- Users face friction when attempting to book services from suppliers - Current booking mechanism lacks flexibility for managing supplier relationships on budget items - Cannot easily add or modify supplier assignments without triggering full budget resubmission - Rate card updates create cascading workflows that burden users

## Possible Solution (How)

### Approach - Create lightweight supplier booking workflow for budget plan items - Separate supplier relationship management from rate card change operations - Implement atomic supplier add/remove operations - Design workflows that don't force budget resubmission for supplier changes ### Before/After - **Before**: Supplier changes trigger budget recalculation; cumbersome workflow; high friction - **After**: Simple supplier selection; atomic operations; seamless booking experience

## Benefits (Why)

- Reduces workflow complexity for supplier management - Allows flexible supplier assignment at service level - Minimizes unnecessary budget resubmission cycles - Improves user experience during service planning

## Owner (Who)

**Steven Boge** - Product Manager

## Other Stakeholders (Accountable / Consulted / Informed)

Role Name Responsible Accountable Consulted Informed ----------------------------------------------------------- Product Steven Boge X Engineering Lead TBD X Budget/Finance TBD X Care Coordinator TBD X

## Assumptions & Dependencies, Risks

### Assumptions
- Assumption: Supplier relationship and rate card updates can be decoupled - Assumption: Budget rebalance engine can handle selective supplier updates - Dependency: Rate card management system is available and stable - Dependency: Budget plan structure supports supplier-level granularity

### Risks
Risk Impact Probability Mitigation -------------------------------------- Rate card cascade on supplier change High High Implement event separation and selective updates Data consistency issues High Medium Comprehensive validation and audit logging User confusion about when resubmission is needed Medium Medium Clear UI guidance and workflow documentation

## Estimated Effort

**T-Shirt Size**: L (4-6 sprints) Breakdown: - Discovery & Design: 1 sprint - Backend Workflow Implementation: 2 sprints - Frontend UI Development: 1.5 sprints - Testing & Integration: 1 sprint

## Proceed to PRD?

**YES** - Feature has clear requirements and solid technical foundation. Reason: Problem is well-understood; technical approach is validated; business value is clear.
