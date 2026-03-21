---
title: "Idea Brief: AI Invoice Classification (AIC)"
description: "Budgets And Finance > AI Invoice Classification"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: AIC | **Created**: 2026-01-14

---

## Problem Statement (What)

Care coordinator bills page throws SQL ambiguity errors when sorting by recipient name, causing application failures.

**Pain Points:**
- Query joins bills and packages tables, both containing care_coordinator_id columns
- Column ambiguity causes application failures and poor user experience
- Sorting capability is disabled, limiting data analysis and reporting
- Technical debt impacts billing operations and coordinator workflow

**Current State**: SQL errors on sorting, limited query capability, poor user experience.

---

## Possible Solution (How)

Fix SQL ambiguity by properly qualifying column references in queries:

- **Column Disambiguation**: Update all bill-related queries to use explicit table aliases
- **Query Validation**: Implement column disambiguation for shared column names across joined tables
- **Future Prevention**: Add query validation to catch similar ambiguity issues
- **Testing**: Test all sorting and filtering capabilities after fix

```
// Before (Current)
1. SQL errors on sorting
2. Limited query capability
3. Poor user experience
4. Technical debt

// After (With AIC)
1. Queries work reliably
2. Full sorting capability
3. Stable operations
4. Clean code
```

---

## Benefits (Why)

**User/Client Experience:**
- Enables proper sorting and filtering on care coordinator bills page
- Improves user experience for care coordinators managing billing

**Operational Efficiency:**
- Reduces support incidents related to sorting failures
- Provides foundation for additional billing query enhancements

**Business Value:**
- Stability — reliable query execution
- Quality — demonstrates commitment to technical debt reduction
- Foundation — enables future billing enhancements

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — |
| **A** | — |
| **C** | — |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Care coordinator column references are correctly mapped in both tables
- No other queries have similar ambiguity issues

**Dependencies:**
- Query testing must cover all sort and filter combinations
- Staging environment must have representative billing data

**Risks:**
- Fix introduces new query issues (MEDIUM impact, LOW probability) → Comprehensive testing of all affected queries
- Performance degradation (LOW impact, LOW probability) → Query performance profiling before deployment
- Incomplete ambiguity fixes (MEDIUM impact, LOW probability) → Code review focusing on column qualifications

---

## Success Metrics

- Zero SQL ambiguity errors on bills page
- All sort/filter combinations working correctly
- No performance regression in query execution
- Zero related support tickets post-deployment

---

## Estimated Effort

**S (Small) — 1-2 sprints**

- Sprint 0.25: Issue analysis & root cause
- Sprint 0.5: SQL query fix implementation
- Sprint 0.5: Testing & query validation
- Sprint 0.25: Deployment & monitoring

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Complete code audit for all affected queries
2. Prepare migration scripts and rollback plan
3. `/speckit.specify` — Create detailed technical specification
