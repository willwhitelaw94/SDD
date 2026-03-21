---
title: "AI Invoice Classification"
---


**Epic Code**: AIC  
**Created**: 2026-01-14

## Problem Statement (What)

- Care coordinator bills page throws SQL ambiguity errors when sorting by recipient name - Query joins bills and packages tables, both containing care_coordinator_id columns - Column ambiguity causes application failures and poor user experience - Sorting capability is disabled, limiting data analysis and reporting - Technical debt impacts billing operations and coordinator workflow

## Possible Solution (How)

### Approach - Fix SQL ambiguity by properly qualifying column references in queries - Update all bill-related queries to use explicit table aliases - Implement column disambiguation for shared column names across joined tables - Add query validation to catch similar ambiguity issues in future - Test all sorting and filtering capabilities after fix ### Before/After - **Before**: SQL errors on sorting; limited query capability; poor user experience - **After**: Queries work reliably; full sorting capability; stable operations

## Benefits (Why)

- Enables proper sorting and filtering on care coordinator bills page - Improves user experience for care coordinators managing billing - Reduces support incidents related to sorting failures - Provides foundation for additional billing query enhancements - Demonstrates commitment to code quality and technical debt reduction

## Owner (Who)

**Leo Nuneza** - Engineering Lead

## Other Stakeholders (Accountable / Consulted / Informed)

Role Name Responsible Accountable Consulted Informed ----------------------------------------------------------- Engineering Leo Nuneza X Product TBD X Billing TBD X QA TBD X

## Assumptions & Dependencies, Risks

### Assumptions
- Assumption: Care coordinator column references are correctly mapped in both tables - Assumption: No other queries have similar ambiguity issues - Dependency: Query testing must cover all sort and filter combinations - Dependency: Staging environment must have representative billing data

### Risks
Risk Impact Probability Mitigation -------------------------------------- Fix introduces new query issues Medium Low Comprehensive testing of all affected queries Performance degradation Low Very Low Query performance profiling before deployment Incomplete ambiguity fixes Medium Low Code review focusing on column qualifications

## Estimated Effort

**T-Shirt Size**: S (1-2 sprints) Breakdown: - Issue Analysis & Root Cause: 0.25 sprints - SQL Query Fix Implementation: 0.5 sprints - Testing & Query Validation: 0.5 sprints - Deployment & Monitoring: 0.25 sprints

## Proceed to PRD?

**YES** - Bug fix is well-scoped with clear technical solution and test coverage. Reason: Root cause identified; fix approach validated; testing completed successfully.
