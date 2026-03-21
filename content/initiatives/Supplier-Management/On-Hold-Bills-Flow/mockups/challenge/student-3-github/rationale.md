---
title: "GitHub Patterns Rationale for OHB Cockpit"
---

# Why GitHub Patterns Work for the OHB Bill Processor Cockpit

_Student: GitHub Gary | Paradigm: GITHUB | Motto: "Review, approve, ship"_

---

## The Core Metaphor: Bills Are Pull Requests

A GitHub pull request and an on-hold bill share the same fundamental shape:

1. **Something arrives** (a PR is opened / a bill is submitted)
2. **Multiple checks must pass** (CI checks / on-hold reason validation)
3. **Multiple reviewers weigh in** (code reviewers / department owners)
4. **A readiness verdict is reached** (merge-ready / ready to approve)
5. **A terminal action is taken** (merge, close / approve, reject, hold)

This is not a superficial analogy. The structural similarity means every UX pattern GitHub has refined over 15 years of pull request management translates directly to bill processing.

---

## Pattern-to-Feature Mapping

### PR Review Workflow --> Multi-Issue Diagnosis (US1)

GitHub's review workflow handles the exact problem OHB faces: multiple independent assessments that must converge before an action can be taken. In GitHub, three reviewers can work in parallel -- one approves, one requests changes, one is pending. The PR page shows all three states simultaneously.

For OHB, three departments (Care, Compliance, Accounts) can work in parallel on their respective issues. The bill page shows all department statuses simultaneously. The processor does not need to check each department separately -- the consolidated view shows exactly who has resolved, who is pending, and who is blocking.

### CI Status Checks --> Traffic-Light Checklist

GitHub's status checks are the single best existing UI pattern for "a list of things that must pass before you can proceed." The visual language is immediately understood:

- Green check = this passed (COMPLETE)
- Red X = this failed (BLOCKING)
- Yellow circle = running (IN_PROGRESS)
- Grey circle = waiting (AWAITING)

Bill processors looking at their checklist will see the same pattern. No learning curve. No ambiguity. The "merge box" summary -- "2 of 5 checks passing" -- tells you instantly whether this bill is close to resolution or deeply stuck.

### Labels --> Department Routing (US3)

GitHub labels solve the categorisation problem that department routing introduces. When a bill has issues spanning Care (pink label), Compliance (orange label), and Accounts (blue label), the coloured pills on the bill row create an instant visual fingerprint. A processor scanning 50 bills can immediately see:

- Bills with only Care labels = route to Care only
- Bills with 3 department labels = complex multi-department issue
- Bills with no labels = fresh, undiagnosed

This is faster than reading text. Colour recognition happens in under 100ms.

### Timeline --> Activity Audit Trail

Every bill action needs to be traceable: who diagnosed what, when it was routed, when it was resolved, what communications were sent. GitHub's timeline does this naturally by interleaving events and comments into a single chronological stream.

The alternative -- separate "activity", "comments", and "history" tabs -- forces users to reconstruct the narrative from fragments. GitHub's approach gives you the complete story in one scroll.

### Batch Actions --> High-Volume Processing

At 5-6K bills per day, single-bill operations are not enough. Processors need to:

- Bulk-assign 20 bills to themselves at shift start
- Bulk-approve 50 all-clear bills after department resolution
- Bulk-send Day 3 reminders for 30 overdue bills

GitHub's checkbox-select + floating action bar is the proven pattern for this. Select, act, confirm. The interaction cost is O(1) regardless of selection size.

---

## Why GitHub Over Other Paradigms

### vs. Linear (Minimalism)
Linear optimises for individual contributor flow. GitHub optimises for **collaborative review workflows**. OHB is inherently collaborative -- processors, departments, and suppliers all interact with the same bill. GitHub's review model handles this better than Linear's solo-focused triage.

### vs. Notion (Flexibility)
Notion gives you a blank canvas and lets you build your own system. GitHub gives you an **opinionated workflow** that has been battle-tested at scale. Bill processing is not a creative exercise -- it is a structured process. An opinionated system reduces decision fatigue and enforces consistency across 50+ processors.

### vs. Superhuman (Speed)
Superhuman optimises for keyboard speed on a single-item triage workflow (email). GitHub optimises for **batch operations and parallel reviews**. OHB needs both: fast single-bill processing AND efficient batch operations for queue management. GitHub covers both modes.

---

## The "Merge Readiness" Insight

The single most powerful GitHub pattern for OHB is the **merge readiness box**. In GitHub, this box sits at the bottom of every PR and answers one question: "Can I merge this?"

It aggregates:
- Required reviews (all approved? any requesting changes?)
- Required checks (all passing? any failing?)
- Merge conflicts (clean? conflicting?)
- Branch protection (all rules satisfied?)

For OHB, the equivalent "approval readiness box" aggregates:
- All BLOCKING reasons resolved?
- All department tasks complete?
- Communication type determined?
- Cadence requirements met?

This single UI element replaces the mental calculation processors currently do: scanning through reasons, checking department statuses, evaluating whether the bill is ready. The box does the calculation and presents the verdict. Green = approve. Red = not yet. Amber = needs attention.

That is the GitHub advantage: **a system designed around convergent decision-making at scale.**
