---
title: "Gate 5: QA"
navigation: false
---

# Gate 5: QA Gate

**Status**: :icon{name="circle-dotted" color="gray"} **PENDING**

**Key Question**: "Does it actually work?"

Verifies the feature is stable, meets acceptance criteria, and is ready for product review.

**Generated**: YYYY-MM-DD
**Environment**: Staging

---

## Functional Validation

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Feature works as described | ⏳ Pending | Matches ticket description |
| 2 | Acceptance criteria met | ⏳ Pending | All AC from spec verified |
| 3 | UI matches approved design | ⏳ Pending | Visual comparison to mockups |
| 4 | Field validation works | ⏳ Pending | Required fields, format, errors |
| 5 | Success messages display | ⏳ Pending | Confirmation feedback |
| 6 | Error states handled | ⏳ Pending | Graceful handling, helpful messages |

## Regression & Integration

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Regression check passed | ⏳ Pending | Related areas unaffected |
| 2 | Link integrity confirmed | ⏳ Pending | All navigation links work |
| 3 | Data integrity maintained | ⏳ Pending | No data corruption or loss |

## Cross-Browser & Device Testing

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Chrome tested | ⏳ Pending | Desktop + mobile |
| 2 | Safari tested | ⏳ Pending | Desktop + mobile |
| 3 | Firefox tested | ⏳ Pending | Desktop + mobile |
| 4 | Responsive on top 3 screen sizes | ⏳ Pending | 1920px, 768px, 375px |

## Quality & Performance

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Accessibility check | ⏳ Pending | WCAG 2.1 AA basic pass |
| 2 | Performance acceptable | ⏳ Pending | No visible lag, no layout shift |
| 3 | No console warnings or 404s | ⏳ Pending | Browser console clean |

## Issue Management

| # | Description | Severity | Status |
|---|-------------|----------|--------|
| 1 | | Sev ? | |

### Severity Reference

| Severity | Description | Gate Impact |
|----------|-------------|-------------|
| Sev 1 - Critical | Feature unusable, data loss, security issue | BLOCKS gate |
| Sev 2 - Major | Core functionality broken, no workaround | BLOCKS gate |
| Sev 3 - Moderate | Functionality impaired, workaround exists | BLOCKS gate |
| Sev 4 - Minor | Cosmetic, minor UX issue | Document & proceed |
| Sev 5 - Trivial | Edge case, future enhancement | Document & proceed |

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Tester | | | ⏳ Pending |

---

## Next Steps

1. Move ticket to "Ready for Product Review"
2. Tag Product Owner for review
3. Pass Gate 6 (Release) before deploying to production

**Reference**: [.tc-wow/gates/05-qa.md](/.tc-wow/gates/05-qa.md)
