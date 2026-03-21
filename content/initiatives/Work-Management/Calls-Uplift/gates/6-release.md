---
title: "Gate 6: Release"
navigation:
  icon: rocket
---

# Gate 6: Release Gate

**Status**: :icon{name="circle-dotted" color="gray"} **PENDING**

**Key Question**: "May this enter the city?"

Final approval for production deployment including Product Review and UAT.

---

## Product Review

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Delivers intended business/user value | ⏳ Pending | Solves stated problem |
| 2 | User story and AC confirmed complete | ⏳ Pending | All criteria verified |
| 3 | No critical UX or content issues | ⏳ Pending | Matches expectations |
| 4 | Analytics events verified | ⏳ Pending | PostHog events firing |
| 5 | Meets global site standards | ⏳ Pending | SEO, performance, a11y |
| 6 | Documentation reviewed | ⏳ Pending | Spec, design, test evidence |
| 7 | QA results accepted | ⏳ Pending | Gate 5 output reviewed |

## Business Stakeholder Review (UAT)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Aligns with business goals | ⏳ Pending | Compliance met |
| 2 | Content accuracy validated | ⏳ Pending | Copy, links, policies |
| 3 | CRM/integrations verified | ⏳ Pending | End-to-end flow works |
| 4 | Meets accessibility standards | ⏳ Pending | WCAG compliance |
| 5 | Meets branding standards | ⏳ Pending | Visual design correct |
| 6 | Site performance acceptable | ⏳ Pending | Meets targets |
| 7 | Exceptions documented | ⏳ Pending | Deviations approved |

## Pre-Release

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Feature flags configured | ⏳ Pending | Pennant flags ready |
| 2 | Environment variables ready | ⏳ Pending | Production vars set |
| 3 | Database migrations ready | ⏳ Pending | Tested, rollback plan exists |
| 4 | Monitoring configured | ⏳ Pending | Nightwatch, error tracking |
| 5 | Rollback plan documented | ⏳ Pending | How to revert |
| 6 | Release notes prepared | ⏳ Pending | Changelog ready |
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

Run `/trilogy-ship` to complete final review and validate against this gate.

**Reference**: [.tc-wow/gates/06-release.md](/.tc-wow/gates/06-release.md)
