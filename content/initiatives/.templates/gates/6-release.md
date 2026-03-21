---
title: "Gate 6: Release"
navigation: false
---

# Gate 6: Release Gate

**Status**: :icon{name="circle-dotted" color="gray"} **PENDING**

**Key Question**: "May this enter the city?"

Verifies the feature has passed all reviews and is ready for production deployment.

**Generated**: YYYY-MM-DD

---

## Part 1: Product Review

Product Owner validates feature meets requirements.

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Delivers intended business/user value | ⏳ Pending | Solves the stated problem |
| 2 | User story and AC confirmed complete | ⏳ Pending | All acceptance criteria verified |
| 3 | No critical UX or content inconsistencies | ⏳ Pending | UI/UX matches expectations |
| 4 | Analytics events verified | ⏳ Pending | PostHog events firing |
| 5 | Meets global site standards | ⏳ Pending | SEO, performance, accessibility |
| 6 | Linked documentation reviewed | ⏳ Pending | PRD, Figma, test evidence |
| 7 | QA test results accepted | ⏳ Pending | Gate 5 output reviewed |

## Part 2: Business Stakeholder Review (UAT)

Business stakeholders validate feature in real-world context.

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Aligns with business goals | ⏳ Pending | Business objectives and compliance |
| 2 | Content accuracy validated | ⏳ Pending | Copy, links, policies, legal |
| 3 | CRM/integrations verified | ⏳ Pending | End-to-end integration testing |
| 4 | Meets accessibility standards | ⏳ Pending | WCAG compliance confirmed |
| 5 | Meets branding standards | ⏳ Pending | Visual design matches brand |
| 6 | Site performance acceptable | ⏳ Pending | Performance meets targets |
| 7 | Exceptions documented | ⏳ Pending | All deviations approved |

## Pre-Release Checklist

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Feature flags configured for production | ⏳ Pending | Pennant flags set |
| 2 | Environment variables ready | ⏳ Pending | All production env vars |
| 3 | Database migrations ready | ⏳ Pending | Tested, rollback plan exists |
| 4 | Monitoring/alerting configured | ⏳ Pending | Nightwatch, error tracking |
| 5 | Rollback plan documented | ⏳ Pending | How to revert if issues |
| 6 | Release notes prepared | ⏳ Pending | Changelog, user comms |
| 7 | Deployment window confirmed | ⏳ Pending | Timing agreed |

---

## Approvals

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | | | ⏳ Pending |
| Business Stakeholder | | | ⏳ Pending |
| Tech Lead | | | ⏳ Pending |

---

## Next Steps

1. Approve for production deployment
2. Create release tag
3. Update changelog
4. Schedule deployment

**Reference**: [.tc-wow/gates/06-release.md](/.tc-wow/gates/06-release.md)
