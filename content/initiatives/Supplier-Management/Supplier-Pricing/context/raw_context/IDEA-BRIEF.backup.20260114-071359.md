---
title: "Supplier Pricing"
---


**Epic Code**: PRI  
**Created**: 2026-01-14

## Problem Statement (What)

- Supplier pricing structures lack distinction between direct and indirect costs - Current pricing mechanism doesn't support supplier price list management - Portal pricing input is limited and doesn't capture full pricing complexity - Bill matching against supplier pricing is difficult without clear price structure - Budget planning lacks detailed pricing visibility and supplier-specific rates

## Possible Solution (How)

### Approach - Implement direct and indirect pricing model in the Portal - Create supplier price list management interface - Enable suppliers to maintain and update their own pricing information - Integrate pricing data into bill matching and budget calculations - Establish price cap validation to prevent pricing anomalies ### Before/After - **Before**: Limited pricing flexibility; manual price management; bill matching challenges - **After**: Comprehensive pricing model; supplier self-service; improved bill accuracy

## Benefits (Why)

- Supports more flexible and realistic pricing structures - Enables suppliers to manage their own price lists - Improves bill matching accuracy and speed - Provides better visibility for budget planning - Supports cost management and pricing validation

## Owner (Who)

**Steven Boge** - Product Manager

## Other Stakeholders (Accountable / Consulted / Informed)

Role Name Responsible Accountable Consulted Informed ----------------------------------------------------------- Product Steven Boge X Engineering Lead TBD X Finance TBD X Billing TBD X

## Assumptions & Dependencies, Risks

### Assumptions
- Assumption: Direct/indirect pricing model is well-defined by business - Assumption: Suppliers have systems capable of managing price lists - Dependency: Pricing business rules must be finalized - Dependency: Integration with budget and billing systems must be designed

### Risks
Risk Impact Probability Mitigation -------------------------------------- Pricing data inconsistency High Medium Validation rules and audit trails Supplier resistance to price transparency Medium Low Clear communication of benefits Bill matching complexity with new pricing Medium Medium Phased rollout and testing

## Estimated Effort

**T-Shirt Size**: L (4-6 sprints) Breakdown: - Discovery & Pricing Model Definition: 1 sprint - Design & UI Development: 1.5 sprints - Backend Implementation: 1.5 sprints - Integration, Testing & Launch: 1.5 sprints

## Proceed to PRD?

**YES** - Pricing model is well-defined with clear business requirements. Reason: Pricing structures are understood; integration points identified; supplier impact assessed.
