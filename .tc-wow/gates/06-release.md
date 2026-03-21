# Gate 6: Release Gate

**Transition**: Release → Completed
**Linear Transition**: **Release** → **Completed**
**meta.yaml**: `status: completed`

**Key Question**: "Is it approved for production?"

Verifies the feature has passed all reviews and is ready for production deployment. Includes Product Review and Business Stakeholder Review (UAT).

---

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| QA Gate (Gate 5) passed | Yes | Linear/PR |
| Feature on staging | Yes | Staging environment |
| All prior gates passed | Yes | Gate logs |

---

## Part 1: Product Review

Product Owner validates feature meets requirements.

### Checks

| Check | Pass Criteria |
|-------|---------------|
| **Delivers intended business/user value** | Feature solves the stated problem |
| **User story and AC confirmed complete** | All acceptance criteria verified |
| **No critical UX or content inconsistencies** | UI/UX matches expectations |
| **Analytics events verified** | Events firing in reporting dashboard (PostHog, etc.) |
| **Meets global site standards** | SEO, performance, accessibility standards met |
| **Linked documentation reviewed** | PRD, Figma, test evidence all attached and reviewed |
| **QA test results accepted** | QA gate output reviewed, known issues accepted |

### Sign-off

| Check | Pass Criteria |
|-------|---------------|
| **Product Owner approves** | Feature approved for Business Review / UAT |

---

## Part 2: Business Stakeholder Review (UAT / Final Acceptance)

Business stakeholders validate feature in real-world context.

### Checks

| Check | Pass Criteria |
|-------|---------------|
| **Aligns with business goals** | Feature meets business objectives and compliance requirements |
| **Content accuracy validated** | Copy, links, policies, legal disclaimers all correct |
| **CRM/integrations verified** | Form submissions, CRM integrations work end-to-end |
| **Meets accessibility standards** | WCAG compliance confirmed |
| **Meets branding standards** | Visual design matches brand guidelines |
| **Site performance acceptable** | Performance meets targets for target markets |
| **Exceptions documented** | All deviations from spec documented and approved |

### Sign-off

| Check | Pass Criteria |
|-------|---------------|
| **Business Stakeholder approves** | Feature approved for production release |

---

## Pre-Release Checklist

Final checks before deployment:

| Check | Pass Criteria |
|-------|---------------|
| **Feature flags configured for production** | Pennant flags set correctly |
| **Environment variables ready** | All production env vars configured |
| **Database migrations ready** | Migrations tested, rollback plan exists |
| **Monitoring/alerting configured** | Nightwatch, error tracking ready |
| **Rollback plan documented** | How to revert if issues arise |
| **Release notes prepared** | Changelog, user communications ready |
| **Deployment window confirmed** | Timing agreed with stakeholders |

---

## Gate Actions

### On Pass
- Approve for production deployment
- Create release tag
- Update changelog
- Notify stakeholders
- Schedule deployment

### On Fail (Product Review)
- Return to development or QA
- Document specific issues
- Re-run from appropriate gate after fixes

### On Fail (UAT)
- Document stakeholder concerns
- Determine if blocker or deferrable
- Either fix and re-review, or document exception

---

## Output

Gate check summary:

```markdown
## Release Gate Check
**Date**: YYYY-MM-DD
**Feature**: [Feature Name]
**Status**: PASS / FAIL

### Product Review
- [x] Delivers intended business/user value
- [x] User story and AC confirmed complete
- [x] No critical UX or content inconsistencies
- [x] Analytics events verified
- [x] Meets global site standards
- [x] Documentation reviewed
- [x] QA results accepted
- [x] **Product Owner approved**

### Business Stakeholder Review (UAT)
- [x] Aligns with business goals and compliance
- [x] Content accuracy validated
- [x] CRM/integrations verified end-to-end
- [x] Meets accessibility standards
- [x] Meets branding standards
- [x] Site performance acceptable
- [x] Exceptions documented and approved
- [x] **Business Stakeholder approved**

### Pre-Release
- [x] Feature flags configured
- [x] Environment variables ready
- [x] Database migrations ready
- [x] Monitoring configured
- [x] Rollback plan documented
- [x] Release notes prepared
- [x] Deployment window confirmed

### Approvals
| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | [name] | YYYY-MM-DD | Approved |
| Business Stakeholder | [name] | YYYY-MM-DD | Approved |
| Tech Lead | [name] | YYYY-MM-DD | Approved |

**Ready for Production**: YES / NO
```

---

## Integration

Referenced by:
- `/trilogy-ship` - Called after gate passes for deployment
