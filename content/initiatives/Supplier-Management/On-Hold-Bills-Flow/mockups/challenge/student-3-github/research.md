---
title: "GitHub Pattern Research for OHB Bill Processor Cockpit"
---

# GitHub Pattern Research for OHB Bill Processor Cockpit

_Student: GitHub Gary | Paradigm: GITHUB | Motto: "Review, approve, ship"_

---

## Pattern 1: Pull Request Review Workflow

**What it is:** GitHub's pull request review process is a multi-stage approval pipeline where code changes move through states -- draft, review requested, changes requested, approved, merged -- with multiple reviewers able to work in parallel. Each reviewer independently assesses the changes and leaves a verdict.

**How it works in GitHub:**
- Author opens a PR (draft or ready for review) and requests specific reviewers
- Each reviewer sees a diff of all changes and can leave inline comments, suggestions, or a review verdict
- Review verdicts: Approve (green check), Request Changes (red X), Comment (grey dot)
- All reviews appear in a consolidated timeline alongside CI checks
- The "merge box" at the bottom aggregates all signals: required reviews met, all checks passing, no conflicts
- Branch protection rules enforce that specific conditions must pass before merging is allowed
- Draft PRs signal "not ready yet" -- reviewable but not mergeable

**Relevance to OHB:**
Each bill is a "pull request" moving through review. On-hold reasons are like review checks -- each must pass (resolve) before the bill can be "merged" (approved). Department routing maps to requesting reviews from specific teams. The merge readiness box becomes the "ready to approve" summary that aggregates all issue statuses.

**Source:** [GitHub Code Review](https://github.com/features/code-review), [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)

---

## Pattern 2: CI Status Checks and Merge Readiness

**What it is:** GitHub Actions and status checks provide automated validation that runs against every PR. Results appear as a vertical checklist of pass/fail indicators, and required checks must pass before merging.

**How it works in GitHub:**
- Each workflow run displays a status icon: green check (success), red X (failure), yellow circle (in progress), grey circle (pending)
- The PR's "Checks" tab shows detailed output for each check
- The merge box aggregates all checks into a single readiness summary
- Required checks block merging when failing -- the merge button is disabled with a clear explanation
- Checks can be re-run individually if they fail
- Matrix builds show multiple parallel check results (e.g., test on Node 18, 20, 22)

**Relevance to OHB:**
The traffic-light checklist maps directly to CI status checks. Each on-hold reason is a "check" that must pass (COMPLETE/green) or be addressed. BLOCKING reasons are required checks -- they prevent approval. WARNINGS are optional checks -- informational but not blocking. The merge readiness box becomes the bill resolution summary: "3 of 5 checks passing. 2 blocking issues remain."

**Source:** [About Status Checks - GitHub Docs](https://docs.github.com/articles/about-status-checks), [How to Configure Status Checks in GitHub Actions](https://oneuptime.com/blog/post/2026-01-26-status-checks-github-actions/view)

---

## Pattern 3: Issue Labels, Milestones, and Categorisation

**What it is:** GitHub uses coloured labels to categorise issues and PRs, milestones to group related work toward a target, and assignees to indicate ownership. This creates a scannable visual language across lists.

**How it works in GitHub:**
- Labels are coloured pills with text -- `bug` (red), `enhancement` (blue), `help wanted` (green), `wontfix` (grey)
- Multiple labels can be applied to a single issue, creating a visual fingerprint
- Milestones group issues toward a deadline with a progress bar showing completion percentage
- Assignees appear as avatar circles on the right side of issue rows
- Labels, milestones, and assignees are all filterable from the issues list
- Label colours are customisable with hex values

**Relevance to OHB:**
On-hold reason categories (Care, Compliance, Accounts) map to label colours. Each reason on a bill gets a department-coloured label. The bills index becomes a GitHub Issues list where you can filter by label (department), milestone (cadence day), and assignee (processor). The visual density of labels on each row instantly communicates how many departments are involved.

**Source:** [GitHub Issues - Project Planning](https://github.com/features/issues), [Using Labels and Milestones - GitHub Docs](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work)

---

## Pattern 4: Timeline and Activity Feed

**What it is:** Every GitHub issue and PR has a chronological timeline that interleaves comments, events, status changes, review actions, and cross-references into a single narrative thread. This creates a complete audit trail.

**How it works in GitHub:**
- Events are displayed chronologically with actor avatars, timestamps, and descriptions
- Event types include: comments (with markdown), status changes, label additions/removals, assignee changes, cross-references, commits, review submissions
- Each event has a distinct visual treatment -- comments get full boxes, status changes are inline with icons
- Cross-references automatically link related issues and PRs
- Reactions (emoji) provide lightweight acknowledgement without creating noise
- "Collapse outdated" hides resolved review threads to reduce visual clutter

**Relevance to OHB:**
Bill activity needs a timeline: "AI diagnosed Missing ABN at 9:15am", "Routed to Compliance at 9:16am", "Jane (Compliance) resolved Missing ABN at 2:30pm", "Day 3 reminder sent at 5:00pm". The GitHub timeline pattern provides the visual language for this -- each event type gets a distinct icon and colour, creating a scannable history without requiring a separate "activity" page.

**Source:** [Activity Feed Design - GetStream](https://getstream.io/blog/activity-feed-design/), [Salesforce Activity Timeline](https://github.com/salesforce-ux/design-system/tree/master/ui/components/activity-timeline)

---

## Pattern 5: Batch Selection and Bulk Actions

**What it is:** GitHub's issues list supports checkbox-based multi-selection with bulk action dropdowns. Users select multiple items and apply the same operation to all of them simultaneously.

**How it works in GitHub:**
- Each row in the issues list has a checkbox on the left
- A "select all" checkbox in the header selects all visible items
- Shift+click selects a range of checkboxes between two clicked items
- When items are selected, a floating action bar appears with bulk operations: assign, label, milestone, close
- Selected count is displayed prominently
- GitHub's open-source `check-all` library powers the checkbox interaction

**Relevance to OHB:**
Bill processors often need to perform the same action on multiple bills: assign 15 bills to a processor, bulk-approve 30 all-clear bills, or send batch Day 3 reminders. The checkbox + floating action bar pattern is the fastest way to handle batch operations. Select bills, choose action, confirm. The pattern scales from 2 bills to 200.

**Source:** [GitHub check-all Library](https://github.com/github/check-all), [Bulk Actions UX - Eleken](https://www.eleken.co/blog-posts/bulk-actions-ux), [Batch Operations UX - HForge](http://www.hforge.org/batch-operations-in-ux-why-doing-things-in-bulk-quietly-saves-hours/)
