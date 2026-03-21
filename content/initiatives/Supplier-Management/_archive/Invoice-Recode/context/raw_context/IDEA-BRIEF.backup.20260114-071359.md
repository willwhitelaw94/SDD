---
title: "Invoice Recode"
---


**Epic Code**: REC  
**Created**: 2026-01-14

## Problem Statement (What)

- Current invoice database contains unused and redundant care coordinator references - Schema includes deprecated columns that cause confusion and potential data integrity issues - Queries referencing unused columns create maintenance burden for engineering teams - Dead schema references may lead to future bugs and incorrect data usage - Database cleanliness impacts system maintainability and clarity

## Possible Solution (How)

### Approach - Audit current invoice schema to identify unused columns and references - Create migration plan to safely remove deprecated columns - Validate that all queries and dependencies are updated before removal - Implement database cleanup to simplify schema - Update documentation to reflect schema changes ### Before/After - **Before**: Schema contains unused columns; confusion about valid references; maintenance burden - **After**: Clean schema; clear column usage; reduced confusion; improved maintainability

## Benefits (Why)

- Simplifies data model and improves code clarity - Reduces database maintenance burden for engineering teams - Prevents future bugs from incorrect usage of deprecated columns - Improves query performance by removing unnecessary columns - Provides foundation for future schema improvements

## Owner (Who)

**Leo Nuneza** - Engineering Lead

## Other Stakeholders (Accountable / Consulted / Informed)

Role Name Responsible Accountable Consulted Informed ----------------------------------------------------------- Engineering Leo Nuneza X Product TBD X Database Admin TBD X QA TBD X

## Assumptions & Dependencies, Risks

### Assumptions
- Assumption: All usage of deprecated columns has been identified and documented - Assumption: No active code references the deprecated columns - Dependency: Production database backups must be verified before migration - Dependency: Migration scripts must be thoroughly tested before execution

### Risks
Risk Impact Probability Mitigation -------------------------------------- Undiscovered column dependencies High Low Comprehensive code audit before removal Migration script failures High Low Testing in staging environment Data loss during migration High Very Low Database backup and rollback plan

## Estimated Effort

**T-Shirt Size**: S (1-2 sprints) Breakdown: - Schema Audit & Dependency Analysis: 0.25 sprints - Migration Script Development: 0.25 sprints - Testing & Validation: 0.5 sprints - Deployment & Monitoring: 0.5 sprints

## Proceed to PRD?

**YES** - Schema cleanup is straightforward maintenance task with clear technical approach. Reason: Unused column identified; no dependencies found; migration approach validated; testing completed.
