---
title: "Release Plan: Enhanced Bulk Actions"
---

**Spec**: [spec.md](../spec.md)
**Plan**: [plan.md](../plan.md)
**Test Plan**: [test-plan.md](./test-plan.md)
**Created**: 2026-02-04
**Target Release**: TBD
**Status**: Draft

---

## Overview

This release plan covers the full release workflow for Enhanced Bulk Actions, including:
1. Release Notes (stakeholder-friendly)
2. Communication Plan (who, when, how)
3. Training Materials (resources to create)
4. Release Gate Checklist (Gate 6)
5. Post-Release Tasks

---

## 1. Release Notes

### What's New: Enhanced Bulk Actions

Staff users can now perform bulk operations on table data with improved visibility, safety, and efficiency. The new Gmail-style floating action bar makes bulk operations intuitive and safe.

#### Floating Action Bar

A bottom-anchored action bar appears when you select items, showing:
- Clear selection count ("12 selected")
- Quick access to common actions
- "Select all X items" for cross-page selection (up to 1000 items)

**How it works:**
- Select items using checkboxes
- Use Shift+click to select ranges
- Action bar slides up with your options
- Press Escape or click X to clear selection

**Who benefits:** All staff users working with tables (Packages, Suppliers, etc.)

---

#### Bulk Tag Management

Add or remove tags from multiple items at once, directly from the bulk actions menu.

**How it works:**
- Select items in any taggable table
- Click "Add Tags" or "Remove Tags" in the action bar
- Choose tags from the selector (shows item counts for Remove)
- Confirm to apply changes

**Who benefits:** Staff managing package/supplier categorization

---

#### Enhanced Safety Features

All bulk actions now require confirmation before execution, with undo capability for reversible actions.

**How it works:**
- Confirmation dialog shows action, count, and consequences
- After execution, toast notification appears with "Undo" button
- Undo available for 10 seconds after reversible actions

**Who benefits:** All staff users (prevents accidental bulk operations)

---

#### Selection Enhancements

- **Shift+Click**: Select ranges of consecutive rows
- **Cmd/Ctrl+A**: Select all visible rows
- **Escape**: Clear selection
- **Row highlighting**: Teal tint on selected rows

---

#### Sticky Table Headers

Table headers now stay visible when scrolling through long tables, keeping column names and the "select all" checkbox accessible.

---

### Bug Fixes

*None - this is a new feature release*

### Improvements

- Selection count visible without opening dropdown
- Actions grouped by category (Tags, Export, Edit, Danger)
- Destructive actions visually distinguished (red styling)
- Keyboard shortcuts for power users

---

### Technical Notes

<details>
<summary>For developers</summary>

- **Database migrations**: Yes (BulkActionUndo table for undo tokens)
- **Breaking changes**: None
- **Dependencies updated**: None
- **Feature flag**: `enhanced-bulk-actions` (Pennant)
- **New API endpoints**:
  - `POST /api/v1/bulk-actions/tags` (add/remove)
  - `POST /api/v1/bulk-actions/tags/present` (get tags on selection)
  - `POST /api/v1/bulk-actions/undo`

</details>

---

## 2. Communication Plan

### Overview

| Field | Value |
|-------|-------|
| **Release Date** | TBD |
| **Release Type** | Feature |
| **Impact Level** | Medium |
| **Affected Users** | All staff users |

---

### Stakeholder Notifications

| Who | When | Channel | Message Type |
|-----|------|---------|--------------|
| Product Team | Before release | Teams | Heads up |
| Support Team | Before release | Email + Training | Feature brief |
| Staff Users | After release | In-app announcement | Feature announcement |
| Leadership | After release | Email | Summary |

---

### Pre-Release (2-3 Days Before)

#### Internal Team

- [ ] Notify Product Owner release is ready
- [ ] Brief Support team on new bulk actions features
- [ ] Prepare Help Center article draft
- [ ] Update internal documentation
- [ ] Prepare rollback plan

#### Support Team Brief

```markdown
## Support Team Brief: Enhanced Bulk Actions

**Release Date:** [TBD]

**What's changing:**
Staff can now use a floating action bar for bulk operations with:
- Clear selection counts
- Shift+click range selection
- Bulk tag add/remove
- Confirmation dialogs for all actions
- 10-second undo for reversible actions

**Common questions to expect:**
1. "Where did the old bulk actions dropdown go?"
   → It's now in the floating bar at the bottom when items are selected

2. "How do I select a range?"
   → Click first item, then Shift+click last item in range

3. "Can I undo a bulk delete?"
   → Only reversible actions (tags) have undo. Destructive actions require confirmation.

**Known limitations:**
- Cross-page selection limited to 1000 items
- Undo only available for tag operations
```

---

### Release Day

#### During Deployment

- [ ] Post in #releases channel
- [ ] Monitor error rates (Nightwatch)
- [ ] Verify feature flag is enabled
- [ ] Watch for elevated support tickets

#### After Deployment

- [ ] Confirm successful deployment
- [ ] Run smoke tests on key flows
- [ ] Verify selection count appears on staging/production
- [ ] Test bulk tag add on real data

---

### Post-Release (Same Day + Following Week)

#### Same Day

- [ ] Publish Help Center article
- [ ] Send in-app announcement (if enabled)
- [ ] Close related Linear tickets
- [ ] Update feature flag to 100% rollout (if gradual)

#### Next Day

- [ ] Review error logs for new exceptions
- [ ] Check PostHog for feature usage metrics
- [ ] Gather initial feedback from Support

#### First Week

- [ ] Brief leadership on adoption metrics
- [ ] Document any edge cases discovered
- [ ] Plan follow-up improvements (if needed)

---

### Communication Templates

#### Teams/Slack Announcement

```markdown
:rocket: **Enhanced Bulk Actions is now live!**

Staff users can now perform bulk operations with improved visibility and safety.

**What's new:**
- Floating action bar with selection count
- Shift+click to select ranges
- Bulk Add/Remove Tags
- Confirmation dialogs for all actions
- 10-second undo for reversible actions

**Learn more:** [Link to Help Center article]

Questions? Reach out to #product-support
```

#### In-App Announcement (if applicable)

```markdown
**New: Enhanced Bulk Actions**

Select items in tables to see a new floating action bar. Use Shift+click to select ranges, add/remove tags in bulk, and undo mistakes within 10 seconds.
```

---

## 3. Training Materials

### Required Materials

| Material | Owner | Status |
|----------|-------|--------|
| Help Center Article | PM | [ ] Draft |
| Feature Walkthrough Video (Loom) | PM | [ ] Not started |
| Internal Wiki Update | Dev | [ ] Not started |
| Support Team Cheat Sheet | PM | [ ] Not started |

### Help Center Article Outline

1. **Introduction** - What are Enhanced Bulk Actions?
2. **Selecting Items**
   - Single click selection
   - Shift+click range selection
   - Keyboard shortcuts (Cmd+A, Escape)
3. **Using the Floating Action Bar**
   - Selection count
   - Quick actions
   - More dropdown
4. **Bulk Tag Management**
   - Adding tags to multiple items
   - Removing tags from multiple items
5. **Confirmation & Undo**
   - Confirmation dialogs
   - Undo for reversible actions
6. **Tips & Tricks**
   - Cross-page selection
   - Sticky headers

### Video Script Outline

```
0:00 - Introduction to bulk actions
0:30 - Selecting items (single, shift+click, keyboard)
1:00 - The floating action bar
1:30 - Bulk tag management demo
2:00 - Confirmation dialogs and undo
2:30 - Tips and keyboard shortcuts
3:00 - Summary
```

---

## 4. Release Gate Checklist

**Gate 6: Release Gate** — "Is it approved for production?"

### Prerequisites

| Artifact | Required | Status |
|----------|----------|--------|
| QA Gate (Gate 5) passed | Yes | [ ] |
| Feature on staging | Yes | [ ] |
| All prior gates passed | Yes | [ ] |

---

### Part 1: Product Review

Product Owner validates feature meets requirements.

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Delivers intended business/user value | Bulk actions are faster/safer | [ ] |
| User story and AC confirmed complete | 12 user stories verified | [ ] |
| No critical UX or content inconsistencies | UI matches design.md | [ ] |
| Analytics events verified | PostHog events firing | [ ] |
| Meets global site standards | Accessibility, performance | [ ] |
| Linked documentation reviewed | spec.md, plan.md reviewed | [ ] |
| QA test results accepted | test-plan.md passed | [ ] |
| **Product Owner approves** | Feature approved for UAT | [ ] |

---

### Part 2: Business Stakeholder Review (UAT)

Business stakeholders validate feature in real-world context.

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Aligns with business goals | Improves staff efficiency | [ ] |
| Content accuracy validated | Labels, messages correct | [ ] |
| Meets accessibility standards | WCAG 2.1 AA | [ ] |
| Site performance acceptable | No lag on bulk operations | [ ] |
| Exceptions documented | Any deviations approved | [ ] |
| **Business Stakeholder approves** | Feature approved for release | [ ] |

---

### Part 3: Pre-Release Checklist

Final checks before deployment.

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Feature flag configured | Pennant flag ready | [ ] |
| Environment variables ready | All env vars set | [ ] |
| Database migrations ready | BulkActionUndo table tested | [ ] |
| Monitoring/alerting configured | Nightwatch, Sentry ready | [ ] |
| Rollback plan documented | Feature flag disable plan | [ ] |
| Release notes prepared | This document complete | [ ] |
| Communication plan ready | Templates and timeline set | [ ] |
| Deployment window confirmed | Timing agreed | [ ] |

---

### Approvals

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | | | [ ] Pending |
| Business Stakeholder | | | [ ] Pending |
| Tech Lead | | | [ ] Pending |

---

### Gate Result

**Release Gate Status:** PENDING

- [ ] Product Review passed
- [ ] UAT passed
- [ ] Pre-release checklist complete
- [ ] All approvals received

**Ready for Production:** NO

---

### Gate Actions

**On Pass:**
- Approve for production deployment
- Create release tag
- Update changelog
- Notify stakeholders
- Run `/trilogy-ship`

**On Fail (Product Review):**
- Return to development or QA
- Document specific issues
- Re-run from appropriate gate after fixes

**On Fail (UAT):**
- Document stakeholder concerns
- Determine if blocker or deferrable
- Either fix and re-review, or document exception

---

## 5. Post-Release Tasks

### Immediate (Day 0)

- [ ] Execute Teams announcement
- [ ] Publish Help Center article
- [ ] Enable feature flag for all users
- [ ] Monitor error rates

### Short-term (Week 1)

- [ ] Review PostHog metrics
- [ ] Gather support feedback
- [ ] Document any issues found
- [ ] Leadership summary (if needed)

### Documentation Updates

| Domain | File | Update |
|--------|------|--------|
| Infrastructure | `features/domains/tables.md` | Add bulk actions section |
| Ways of Working | Skills reference | Update with new patterns |

Run `/trilogy-docs-feature enrich tables` after release to update domain documentation.

---

## 6. Rollback Plan

If critical issues arise post-release:

1. **Immediate**: Disable `enhanced-bulk-actions` feature flag in Pennant
2. **Assessment**: Review error logs and user reports
3. **Communication**: Post in #releases that feature is temporarily disabled
4. **Fix**: Address issues in hotfix branch
5. **Re-release**: Follow abbreviated release process

**Feature flag command:**
```php
// Disable for all users
Feature::deactivate('enhanced-bulk-actions');

// Enable for specific users/orgs for testing
Feature::activate('enhanced-bulk-actions', $user);
```

---

## Context Updated

✓ Created release-plan.md with Release Gate (Gate 6) checklist
✓ Includes communication plan, training materials checklist, and rollback plan
