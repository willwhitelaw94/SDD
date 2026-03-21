---
title: "Gate 3: Architecture"
navigation: false
---

# Gate 3: Architecture Gate

**Status**: :icon{name="circle-dotted" color="gray"} **PENDING**

**Key Question**: "Will the structure hold?"

Validates the design and spec are technically feasible before committing to implementation.

**Generated**: YYYY-MM-DD

---

## Technical Feasibility

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Architecture approach clear | ⏳ Pending | |
| 2 | Existing patterns leveraged | ⏳ Pending | |
| 3 | No impossible requirements | ⏳ Pending | |
| 4 | Performance considered | ⏳ Pending | |
| 5 | Security considered | ⏳ Pending | |

## Data & Integration

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Data model understood | ⏳ Pending | |
| 2 | API contracts clear | ⏳ Pending | |
| 3 | Dependencies identified | ⏳ Pending | |
| 4 | Integration points mapped | ⏳ Pending | |
| 5 | DTO persistence explicit | ⏳ Pending | No ->toArray() into ORM |

## Implementation Approach

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | File changes identified | ⏳ Pending | |
| 2 | Risk areas noted | ⏳ Pending | |
| 3 | Testing approach defined | ⏳ Pending | |
| 4 | Rollback possible | ⏳ Pending | |

## Resource & Scope

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Scope matches spec | ⏳ Pending | Not over-engineering |
| 2 | Effort reasonable | ⏳ Pending | |
| 3 | Skills available | ⏳ Pending | |

## Laravel & Cross-Platform Best Practices

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | No hardcoded business logic in Vue | ⏳ Pending | Backend-powered, dynamic |
| 2 | Cross-platform reusability | ⏳ Pending | Vue, React Native, API |
| 3 | Laravel Data for validation | ⏳ Pending | No Request in controllers |
| 4 | Model route binding | ⏳ Pending | No int $id parameters |
| 5 | No magic numbers/IDs | ⏳ Pending | Using Model constants |
| 6 | Common components pure | ⏳ Pending | Zero hardcoded logic |
| 7 | Use Lorisleiva Actions | ⏳ Pending | With AsAction trait |
| 8 | Data classes anemic | ⏳ Pending | No business logic in DTOs |
| 9 | Migrations schema-only | ⏳ Pending | Data ops use Operations/Seeders |

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect/Tech Lead | | | ⏳ Pending |

---

## Next Steps

Run `/speckit-plan` to create technical plan, then validate against this gate.

**Reference**: [.tc-wow/gates/03-architecture.md](/.tc-wow/gates/03-architecture.md)
