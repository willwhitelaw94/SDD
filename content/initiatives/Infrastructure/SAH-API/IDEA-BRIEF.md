---
title: "SaH API Integration"
epic_code: SAH-API
jira: TP-432
linear: https://linear.app/trilogycare/project/sah-api-sh-api-tp-432-eb3287dd6238
status: in_progress
---

# SaH API Integration

## Problem Statement

As Trilogy Care, we need to leverage the Services Australia API to:
- Submit claims for Support at Home services
- Lodge entry/departure records (ACER)
- Retrieve budget and payment information
- Sync care recipient data

Currently using CSV uploads which took **15 hours** for a single claim run. API integration is critical for scaling.

## Business Context

- **Production deadline**: First week of April 2026
- **Practice runs**: Feb-March 2026
- **Current state**: CSV via Databricks (temporary)
- **Target state**: Direct API integration from Portal

## Key APIs

| API | Priority | Cadence | Status |
|-----|----------|---------|--------|
| Invoice API | 10/10 | Real-time | In Progress |
| Claim API | 10/10 | Daily | In Progress |
| Budget API | 10/10 | Daily | TBD |
| Care Recipient Summary | 10/10 | Daily | TBD |
| Entry/Departure API | 10/10 | On HCA signed | In Progress |
| Payment Statement API | 10/10 | Daily | TBD |
| Individual Contribution | 6/10 | Weekly | TBD |
| Service List API | 2/10 | Monthly | TBD |

## Dependencies

- PRODA authentication (done)
- Classification workflow (risk - Khoa away)
- HCA Epic (ACER lodgement trigger)

## Success Metrics

- Claim lodgement < 1 hour (vs 15 hours CSV)
- Zero manual data entry for claims
- Real-time budget visibility
- Automated ACER on HCA signing

## Related Documentation

- [Claims SaH Research](./context/claims-sah-research.md)
- [Services Australia Developer Docs](/developer-docs/reference/services-australia-api)
- [Termination Domain](/features/domains/termination)

## Open Questions

See [claims-sah-research.md](./context/claims-sah-research.md) Section 13.
