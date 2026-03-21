---
title: "Shipping Your First Feature"
description: "The end-to-end workflow for picking up a ticket and getting it to production"
---

> This is the most important page for new developers. Everything else is detail — this is how value actually gets shipped.

---

## How We Work

Everything we build starts as a Linear ticket. Linear is our single source of truth for what's being worked on, who's working on it, and where it's at. Each team has its own prefix — `DUC-123`, `FUE-456`, etc. — so you always know which squad owns a piece of work.

You don't need to manually drag tickets across a board. Our GitHub integration moves them for you as you push code, open PRs, and merge. Your job is to write great code — Linear tracks the rest.

---

## The Workflow

### 1. Pick up a ticket

Find your assigned ticket in Linear, or grab one from the current cycle. Read the description, check acceptance criteria, and look at linked specs or designs.

### 2. Copy the branch name from Linear

In the ticket detail view, click the **Copy git branch name** button (the branch icon in the top-right toolbar). Linear generates a branch name from your name, the ticket ID, and title — e.g. `tim/duc-123-add-provider-search`.

This naming convention is what links your branch to the ticket. Don't make up your own branch name.

```bash
git checkout dev
git pull origin dev
git checkout -b tim/duc-123-add-provider-search
```

### 3. Build it

Write your code, write your tests. Push early, push often. Your first push moves the ticket to **In Progress** automatically.

```bash
git push -u origin tim/duc-123-add-provider-search
```

### 4. Open a PR

When you're ready for feedback, open a PR against `dev`. The ticket ID in your branch name automatically links the PR to the Linear ticket.

- **No reviewer assigned yet?** Ticket stays at **In Progress**
- **Assign a reviewer?** Ticket moves to **In Review**

If you include `preview` in the PR title, a preview environment will be provisioned automatically at `pr-{number}.preview.trilogycare.dev` so reviewers can test the feature live.

### 5. Review and QA

Once the PR is approved and ready to merge, the ticket moves to **QA**. This is where final checks happen before merging.

### 6. Merge and ship

Merge into `dev`. The ticket moves to **Dev Released**. Your feature is now on its way to production.

---

## Linear Status Automation

You don't touch ticket statuses — they move automatically based on your git and PR activity:

| Action | Linear Status |
|--------|---------------|
| Push to branch for the first time | In Progress |
| Create a draft PR | In Progress |
| Create a PR with no reviewer assigned | In Progress |
| Create a PR with a reviewer assigned | In Review |
| PR approved and ready to merge (not yet merged) | QA |
| PR merged into `dev` | Dev Released |

---

## Preview Environments

Adding `preview` to your PR title spins up a live environment on Forge:

- **URL:** `pr-{number}.preview.trilogycare.dev`
- **Database:** Fresh seeded database per PR
- **Auto-teardown:** Environment is destroyed when the PR is closed or `preview` is removed from the title

This is useful for design reviews, QA, and stakeholder demos.

---

## Quick Reference

```text
Linear ticket
    |
    v
Copy branch name ──> git checkout -b tim/duc-123-feature-name
    |
    v
Push code ──────────> Linear: In Progress
    |
    v
Open PR ────────────> Linear: In Progress / In Review
    |
    v
PR approved ────────> Linear: QA
    |
    v
Merge to dev ───────> Linear: Dev Released
```

---

## Related

- [Linear](/ways-of-working/linear) — How we use Linear for project management
- [Pull Request Manifesto](/ways-of-working/team-practices/14-pull-request-manifesto) — Code review philosophy
- [Definition of Done](/ways-of-working/team-practices/08-definition-of-done) — Quality checklist
- [Local Development Setup](/developer-docs/tutorials/01-local-development) — Set up your environment
