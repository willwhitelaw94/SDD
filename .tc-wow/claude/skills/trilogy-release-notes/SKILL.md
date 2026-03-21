---
name: trilogy-release-notes
description: >-
  Generate multi-audience release notes by comparing main vs staging on tc-portal via GitHub API,
  reading actual code diffs, and creating a PR on tc-docs. Use before deploying staging to production.
  Triggers on: release notes, what's in staging, staging diff, prepare release notes, deployment summary.
metadata:
  version: 1.0.0
  type: agent
---

# Trilogy Release Notes Skill

Generate comprehensive, multi-audience release notes by analysing the actual code diff between `main` and `staging` on `Trilogy-Care/tc-portal`, then publishing them as a PR on `Trilogy-Care/tc-docs`.

## Purpose

This skill reads what is about to go to production (changes in `staging` not yet in `main`) and produces release notes for four distinct audiences:

1. **Business View** — CEO, CFO, Managers, Stakeholders
2. **End User View** — Recipients, Coordinators, Suppliers, Staff
3. **Support View** — Customer Service, Non-Technical Internal Teams
4. **Technical View** — Developers, QA

## When to Use

```bash
/trilogy-release-notes                        # Full flow: analyse staging, generate notes, create PR
/trilogy-release-notes --dry-run              # Generate notes to stdout without creating a PR
/trilogy-release-notes --version 2.0.37       # Explicitly set version instead of auto-detecting
```

## Prerequisites

1. **`gh` CLI** installed and authenticated with access to `Trilogy-Care/tc-portal` and `Trilogy-Care/tc-docs`
2. **`gh` access to `Trilogy-Care/tc-docs`** — the skill clones tc-docs into a temp directory automatically. No local clone required.

Verify prerequisites before proceeding:

```bash
gh auth status
gh api repos/Trilogy-Care/tc-portal --jq '.full_name'
gh api repos/Trilogy-Care/tc-docs --jq '.full_name'
```

If any check fails, **stop and inform the user** what is missing. Do not proceed without all three passing.

## Execution Flow

### 1. Verify Prerequisites

Run the three prerequisite checks above. If `gh` is not installed, tell the user:

> `gh` CLI is required. Install with `brew install gh` then authenticate with `gh auth login`.

### 2. Fetch Branch Comparison

Compare `main` against `staging` to find what staging has that main does not:

```bash
gh api repos/Trilogy-Care/tc-portal/compare/main...staging \
  --jq '{
    total_commits: .total_commits,
    files_changed: (.files | length),
    commits: [.commits[] | {sha: .sha[0:7], message: (.commit.message | split("\n")[0]), author: .commit.author.name}],
    files: [.files[] | {filename: .filename, status: .status, additions: .additions, deletions: .deletions, changes: .changes}]
  }'
```

The direction is `main...staging` — this shows commits in staging that are not in main (what is about to be deployed).

### 3. Identify Pull Requests

Extract merged PRs from commit messages:

```bash
gh api repos/Trilogy-Care/tc-portal/compare/main...staging \
  --jq '[.commits[].commit.message | capture("#(?P<pr>[0-9]+)") | .pr] | unique | .[]'
```

For each PR number, fetch details:

```bash
gh api repos/Trilogy-Care/tc-portal/pulls/{PR_NUMBER} \
  --jq '{number: .number, title: .title, body: .body, labels: [.labels[].name], user: .user.login, html_url: .html_url}'
```

### 4. Fetch Actual Code Diffs

**Do not rely on PR titles or commit messages.** Read the actual patches to understand what changed.

**For small releases (< 50 files):**

```bash
gh api repos/Trilogy-Care/tc-portal/compare/main...staging \
  --jq '.files[] | {filename: .filename, status: .status, patch: .patch}'
```

**For truncated patches** (patch field is null for files > ~300 lines of diff):

```bash
gh api repos/Trilogy-Care/tc-portal/pulls/{PR_NUMBER}/files \
  --jq '.[] | select(.filename == "{FILENAME}") | {filename: .filename, patch: .patch}'
```

**For very large releases (> 100 files), prioritise high-signal files:**

| Priority | File Pattern                    | Why                        |
| -------- | ------------------------------- | -------------------------- |
| 1        | `database/migrations/`          | Schema changes             |
| 2        | `routes/`                       | New endpoints, permissions |
| 3        | `app/Http/Controllers/`         | Business logic             |
| 4        | `app/Actions/`, `app/Services/` | Core logic                 |
| 5        | `resources/js/Pages/`           | UI changes                 |
| 6        | `config/`                       | Feature flags, settings    |
| 7        | `app/Enums/`                    | New statuses, types        |

**Skip low-signal files:** tests (unless needed for context), CSS-only changes, IDE config, lock files.

### 5. Analyse Changes

Read the diffs and categorise each change:

| Category          | What to Look For                                                    |
| ----------------- | ------------------------------------------------------------------- |
| **New Features**  | New controllers, pages, routes, migrations creating tables          |
| **Enhancements**  | Modified controllers/actions, new columns on existing tables        |
| **Bug Fixes**     | Small targeted changes, error handling improvements                 |
| **Permissions**   | Middleware changes, policies, role/permission seeders               |
| **Feature Flags** | Pennant features, config toggles, conditional rendering             |
| **Integrations**  | Webhook handlers, API clients, third-party service code             |
| **UI Changes**    | Vue component additions/modifications, new pages                    |
| **Data/Schema**   | Migrations, seeders, enum changes                                   |
| **Mobile App**    | API endpoints under `api/v1/`, mobile auth, mobile-only controllers |

**Feature flag detection** — Search diffs for:

- `Feature::` or `Features::` (Laravel Pennant)
- `pennant` in config files
- `PostHog` or `posthog` references
- Conditional rendering gated by feature checks

When a feature is behind a feature flag, it means the code is deployed but **not yet visible to users** until the flag is turned on. This distinction is critical — stakeholders must understand that a feature-flagged item is not yet live even though the code has been released. Mark every feature-flagged change with a 🚩 flag icon so it's immediately obvious.

**Permission detection** — Search diffs for:

- `Permission::create` or permission seeders
- Middleware like `->middleware('permission:...')`
- Policy class changes
- `can()`, `authorize()`, `hasPermission()` calls

**Mobile app detection** — Search diffs for:

- Controllers or routes under `app-modules/api/` or `TrilogyCare\Api\`
- Route files like `api/v1/routes/`
- Data classes in API module namespaces
- PR titles containing "mobile", "app", or "API" in a mobile context

> **⚠️ MOBILE APP SUPPRESSION (remove this section when the mobile app is publicly released)**
>
> The Trilogy Care mobile app is **under active development but not yet released to users**. Any changes
> related to the mobile app (mobile API endpoints, mobile auth, mobile-specific controllers, API type
> packages for the mobile app) must be handled carefully:
>
> - **Title:** Do NOT include mobile app references in the release notes title
> - **TL;DR:** Do NOT mention the mobile app in the TL;DR bullet points
> - **Business View:** OMIT entirely — do not include mobile app changes
> - **End User View:** OMIT entirely — do not include mobile app changes (users cannot access a mobile app that doesn't exist yet)
> - **Support View:** OMIT entirely — support staff have nothing to support for an unreleased app
> - **Technical View:** INCLUDE but group all mobile-related PRs together at the **bottom** of the Change Log under a clearly marked section (see Technical View template below)
> - **Links table:** Mobile-related PRs can still appear in the Links table at the bottom

### 6. Calculate Release Stats & Top Contributor

**All stats must be dynamically calculated from the API response. Nothing is hardcoded.**

#### Release stats

From the branch comparison (step 2), compute:

- **PR count:** Number of unique PRs identified in step 3
- **Files changed:** From the comparison response: `.files | length`
- **Lines added:** Sum all file additions: `[.files[].additions] | add`
- **Lines removed:** Sum all file deletions: `[.files[].deletions] | add`

These populate the stat cards in the Technical View.

#### Top contributor

For each PR fetched in step 3, you already have `.user.login`, `.additions`, and `.deletions` from the PR detail response. Aggregate per author:

```bash
# From the PR details already fetched, build a tally per author:
# For each unique .user.login:
#   - count of PRs authored
#   - sum of .additions across their PRs
#   - sum of .deletions across their PRs
```

If needed, fetch per-PR line stats individually:

```bash
gh api repos/Trilogy-Care/tc-portal/pulls/{PR_NUMBER} \
  --jq '{author: .user.login, additions: .additions, deletions: .deletions}'
```

The top contributor is the author with the most PRs. In case of a tie, use the author with the highest total additions. Record:

- **GitHub username** (`.user.login` from the PR — never guess or hardcode)
- **Number of PRs** they authored
- **Total additions and deletions** across their PRs

This populates the "Top Contributor" card in the Technical View.

#### Biggest PR

From the PR details, find the PR with the highest total changes (`additions + deletions`). Exclude merge/chore PRs (titles containing "Staging > Dev", "Dev > Staging", "Main > Staging", or starting with "Chore/"). Record:

- **PR number and title**
- **Author** (`.user.login`)
- **Additions and deletions**

This populates the "Biggest PR" card in the Technical View.

### 7. Auto-Detect Version

```bash
gh api repos/Trilogy-Care/tc-portal/tags --jq '.[0].name'
```

If a tag like `v2.0.36` is found, suggest the next version (e.g., `2.0.37`). If no usable tag exists, omit the version field from frontmatter. The user can override via `--version`.

**Important:** The Technical View "Diff" button and the Links table must use **tag-to-tag comparison URLs** (e.g., `v2.0.36...v2.0.37`), not `main...staging`. The `main...staging` URL is ephemeral — it shows the live diff which changes over time. Tag-to-tag URLs are permanent and will always show the correct diff for this specific release. Use `{previous_tag}...v{new_version}` format.

### 8. Determine Dates

**Staging date:** Use the date of the most recent commit on the staging branch from the comparison. This is when the code landed on staging.

**Planned production release:** Calculate the next Wednesday from the staging date. Deployments are planned for every Wednesday.

- If the staging date is already a Wednesday, use the following Wednesday (the code needs QA time).
- If the staging date is Thursday–Tuesday, use the next upcoming Wednesday.

These dates appear at the top of the Technical View tab only. They do not appear in the page header or in other audience tabs.

### 9. Generate Release Notes

Create the markdown content following this exact structure.

**Title rules:**

- Format: `DD Mon YYYY — Concise Summary of Top Changes`
- The date is today's date (the date the skill runs / code was pushed to staging)
- After the em dash, summarise the 2-3 most significant _user-meaningful_ changes
- Every word must be specific and meaningful — no vague words like "Teams", "Updates", "Changes", "Improvements"
- Bad: `18 Feb 2026 — Teams, Billing & API` (vague, meaningless)
- Good: `18 Feb 2026 — Team Permissions, Automated Billing & Fee Exemptions` (specific, scannable)
- The title appears in a sidebar menu, so it must be immediately obvious what this release contains
- **Do NOT include mobile app references in the title** (see Mobile App Suppression rule in Step 5)

```markdown
---
title: "{DD Mon YYYY} — {2-4 word summary of top changes}"
description: "{One-line summary}"
date: YYYY-MM-DD
version: "{version}"
ticket: Multiple
category: release
impact: { high|medium|low }
---

{Impact badge — use the matching colour below} **GitHub Release:** [v{version}](https://github.com/Trilogy-Care/tc-portal/releases/tag/v{version})

## TL;DR

{A concise bullet-point summary of the key changes in this release.
Each bullet should be one sentence describing a single change and its value.
Plain language — a CEO should understand this without any technical background.
No jargon, no code references. Order by impact (most significant first).
Aim for 3-6 bullets depending on the size of the release.
Do NOT include mobile app changes (see Mobile App Suppression rule).

Example:

- **Team permissions** — Organisations can now assign fine-grained permissions to teams independently of individual user roles, closing a compliance and governance gap.
- **Automated weekly billing** — RC and EL care management bills are now created automatically every Monday, replacing a fully manual process.
- **Fee exemptions on bills** — TC and CC fees can now be marked as exempt on applicable bills, providing accurate fee representation.
- 🚩 **Budget plan API** — A new API endpoint supports creating budget plans programmatically (behind a feature flag — not yet visible to users).}

---

## What's New?

::tabs{default="Business View"}
:::tab{label="Business View"}
{Group changes by business domain. For each change, use these sections.
OMIT any mobile app changes entirely (see Mobile App Suppression rule in Step 5).

**Formatting rule:** Every bold section heading (e.g. **Why this matters**) MUST be
followed by a blank line before its content. This prevents the heading and content
from rendering on the same line.

### Headline

A single sentence framing the business outcome. Lead with the value, not the feature.
e.g. "Billing reconciliation is now automated" not "New billing export button added".

If the feature is behind a feature flag, prefix the heading with 🚩 and note that it's
being rolled out in phases.
e.g. `### 🚩 Budget Plan Automation`

**Why this matters**

Connect to business drivers — revenue, cost reduction, compliance, operational efficiency,
or strategic goals. Frame as decisions and outcomes, not features.
e.g. "Manual reconciliation was consuming 12+ hours per billing cycle across the finance team.
This eliminates that overhead and reduces error risk."

**What's changing**

A short paragraph describing the change in board-report language. Focus on capability gained,
risk mitigated, or process improved. No feature names or UI descriptions.

**Who's affected**

Which teams, roles, or business units are impacted. Frame in terms of organisational structure.
e.g. "Finance team leads and anyone involved in monthly billing sign-off."

**Action required**

What leadership or managers need to do — communicate to teams, adjust processes, schedule
training, or simply be aware. If no action needed, say "No action required — this is
available immediately."

Feature flags: 🚩 "This capability has been deployed but is not yet visible to users. It is
being rolled out in phases and will be activated for each organisation individually as part
of the rollout plan. No action is required until activation."

Permissions: "Restricted to Admin users" or "Available to the Finance team"}
:::

:::tab{label="End User View"}
{Group changes by user-facing area. For each change, use these sections.
OMIT any mobile app changes entirely (see Mobile App Suppression rule in Step 5).
Do NOT tell users to open or navigate to a mobile app that hasn't been released.

**Formatting rule:** Every bold section heading (e.g. **Where to find it**) MUST be
followed by a blank line before its content. This prevents the heading and content
from rendering on the same line.

### Headline

A friendly, plain-English summary of what's new. Write it like you'd tell a colleague.
e.g. "You can now download your billing statements directly from the portal."

If the feature is behind a feature flag, prefix the heading with 🚩 and make it clear
this isn't available yet.
e.g. `### 🚩 Budget Plan Management (Coming Soon)`

**Why we built this**

Connect back to user pain points or requests. Use "you" language.
e.g. "We heard from many of you that downloading statements one-by-one was tedious,
especially at end of month. This one's for you."

**What's changed**

Describe what looks or works differently in simple terms. Mention new buttons, screens,
or options they'll notice. Keep it conversational — no jargon.

**Where to find it**

Exact navigation path in the app so users can find the feature immediately.
Use inline code format: `Billing → Statements → Download All`
Do NOT use bold (\*\*) for navigation paths — bold renders as a heading-like element.
Inline code (backticks) renders as a clean, subtle label.

**How to use it**

Numbered step-by-step instructions. Keep steps short and scannable.

1. Go to **Billing → Statements**
2. Click **Download All** in the top right
3. Choose your date range and format
4. Your file will download automatically

If the change is a bug fix or background improvement with no user steps, replace this
with: "No steps needed — this works automatically."

Feature flags: 🚩 "This feature has been deployed but is not yet visible to you. It will
appear once your organisation has it switched on — no action needed from you until then."

Permissions: "You'll see this if you have the right access level — chat to your admin
if you think you should have access."}
:::

:::tab{label="Support View"}
{Group changes by likely support query topic. For each change, use these sections.
OMIT any mobile app changes entirely (see Mobile App Suppression rule in Step 5).

**Formatting rule:** Every bold section heading (e.g. **What's different**) MUST be
followed by a blank line before its content. This prevents the heading and content
from rendering on the same line.

### Headline

A clear, factual summary of what changed. Write it as a support briefing.
e.g. "Bulk billing statement downloads are now available."

If the feature is behind a feature flag, prefix the heading with 🚩 and note
that users won't see this until it's activated.
e.g. `### 🚩 Budget Plan Management (Not Yet Active)`

**Why this was changed**

Brief context so support staff understand the motivation. Helps them empathise with
users who ask about it.
e.g. "Users were requesting a way to download multiple statements at once rather than
one at a time. This was a top-requested feature from Q4 feedback."

**What's different**

Describe the change with enough detail that support can explain it to a user over the
phone. Include what the old behaviour was vs the new behaviour where relevant.

For feature-flagged changes, clearly state: "This change has been deployed but is not
yet active. Users will not see this until the feature flag is turned on for their
organisation."

**Where in the platform**

Navigation path and which screens are affected. Include the exact menu path so support
staff can walk users through it.

**How to help users**

Brief guidance on how support should handle queries about this change. Include any
important caveats or gotchas.

**Likely Q&A**
Anticipate 2-4 questions users are likely to ask, with ready-made answers:

> **Q: "I can't see the Download All button?"**
> A: Check if the feature has been enabled for their organisation (see feature flag
> note below). Also confirm they have the correct role assigned.

> **Q: "The export is missing some statements?"**
> A: The export only includes finalised statements. Draft or pending statements
> won't appear in the bulk download.

Include permission requirements inline with Q&A answers where relevant.

Feature flags: 🚩 "This feature has been deployed but is NOT yet active. The code is in
the system but users will not see it until the feature flag is turned on for their
organisation in PostHog. If a user asks about it, let them know it's coming soon."

Permissions: "Requires the `permission-name` role — check the user's assigned role if
they report they can't access it."}
:::

:::tab{label="Technical View"}

  <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
    <a href="https://github.com/Trilogy-Care/tc-portal/compare/{previous_tag}...{new_tag}" style="flex:0 0 auto;width:90px;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 8px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;text-decoration:none;color:#0969da;font-size:0.75rem;font-weight:600;letter-spacing:0.02em">View</a>
    <div style="flex:1;min-width:140px;padding:12px 16px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0">
      <div style="font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#15803d;margin-bottom:2px">Released to Staging</div>
      <div style="font-size:0.9375rem;font-weight:700;color:#14532d">{staging date}</div>
    </div>
    <div style="flex:1;min-width:140px;padding:12px 16px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe">
      <div style="font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#1d4ed8;margin-bottom:2px">Planned Production Release</div>
      <div style="font-size:0.9375rem;font-weight:700;color:#1e3a5f">{next Wednesday}</div>
    </div>
  </div>
  <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">
    <div style="flex:1;min-width:80px;text-align:center;padding:10px 8px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0">
      <div style="font-size:1.25rem;font-weight:800;color:#0f172a">{PR count}</div>
      <div style="font-size:0.6875rem;color:#64748b;font-weight:500">PRs</div>
    </div>
    <div style="flex:1;min-width:80px;text-align:center;padding:10px 8px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0">
      <div style="font-size:1.25rem;font-weight:800;color:#0f172a">{file count}</div>
      <div style="font-size:0.6875rem;color:#64748b;font-weight:500">Files</div>
    </div>
    <div style="flex:1;min-width:80px;text-align:center;padding:10px 8px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0">
      <div style="font-size:1.25rem;font-weight:800;color:#16a34a">+{additions}</div>
      <div style="font-size:0.6875rem;color:#64748b;font-weight:500">Added</div>
    </div>
    <div style="flex:1;min-width:80px;text-align:center;padding:10px 8px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca">
      <div style="font-size:1.25rem;font-weight:800;color:#dc2626">-{deletions}</div>
      <div style="font-size:0.6875rem;color:#64748b;font-weight:500">Removed</div>
    </div>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
    <div style="flex:1;min-width:200px;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;background:#faf5ff;border:1px solid #e9d5ff">
      <div style="font-size:1.25rem">👑</div>
      <div>
        <div style="font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#7c3aed;margin-bottom:1px">Top Contributor</div>
        <div style="font-size:0.875rem;font-weight:700;color:#581c87">{github username}</div>
        <div style="font-size:0.6875rem;color:#64748b">{N} PRs &middot; +{additions} / -{deletions}</div>
      </div>
    </div>
    <div style="flex:1;min-width:200px;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;background:#fff7ed;border:1px solid #fed7aa">
      <div style="font-size:1.25rem">🔥</div>
      <div>
        <div style="font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#c2410c;margin-bottom:1px">Biggest PR</div>
        <a href="https://github.com/Trilogy-Care/tc-portal/pull/{number}" style="font-size:0.875rem;font-weight:700;color:#7c2d12;text-decoration:none">#{number} — {title}</a>
        <div style="font-size:0.6875rem;color:#64748b">{author} &middot; +{additions} / -{deletions}</div>
      </div>
    </div>
  </div>
  ### Change Log

{One bold entry per PR with the PR number linking directly to GitHub. No headings
(avoids anchor IDs and TOC scroll). Minimal prose — bullet points only.
Each PR section includes every relevant technical detail from the diff.

Format:

**[#1234](https://github.com/Trilogy-Care/tc-portal/pull/1234) — PR Title** (TICKET-123)

- New `ClassName` enum with values: `VALUE_A`, `VALUE_B`
- Migration: added `column_name` nullable column on `table_name` table
- New action: `App\Actions\Domain\ActionName`
- New composable: `useComposableName`
- Route: `PATCH /api/resource/{id}/endpoint`
- Permission: `permission-slug` (Role Name only)
- Feature flag: `flagNameInCamelCase` (PostHog / Pennant)
- Controller method: `ControllerName@methodName`
- `ExistingClass::existingMethod()` updated to accept new param
- Removed: dead code / unused class / deprecated method

Every PR gets its own entry. No summarisation — list every changed file, class,
column, route, permission, and flag. Developers should be able to use this as a
complete technical reference for the release.

Use bold text (\*\*) not headings (###) to avoid generating anchor IDs.
The PR number inside the bold text links to the PR on GitHub.

**Feature flag marking:** If a PR introduces or modifies a feature that is behind a
feature flag, prefix the PR entry with 🚩 and add a `Feature flag` bullet point.

Example:
🚩 **[#1234](https://github.com/Trilogy-Care/tc-portal/pull/1234) — Budget Plan Creation API** (TP-3982)
<span style="display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:9999px;font-size:0.6875rem;font-weight:600;background:#fef3c7;color:#92400e">🚩 Behind feature flag — not yet visible to users</span>

- New action: `Domain\Budget\V2\Actions\BudgetPlan\CreateBudgetPlanAction`
- Feature flag: `budgetPlanCreation` (PostHog)
- Route: `POST /api/v1/budget/plans`

---

### Mobile App (Unreleased)

> ⚠️ **The Trilogy Care mobile app is under active development and has not been released
> to users.** The following changes are backend API infrastructure only. No user-facing
> mobile app exists yet. These are listed here for developer reference only.

{Group all mobile-app-related PRs here, at the bottom of the Change Log, using the
same per-PR format as above. This includes:

- Mobile auth endpoints
- Mobile API controllers and routes
- Mobile-specific data classes
- API type packages for the mobile app
- Any PR whose primary purpose is mobile app functionality}
  }
  :::
  ::

---

## Links

| Resource              | Link                                                                               |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Branch Comparison** | [main...staging](https://github.com/Trilogy-Care/tc-portal/compare/main...staging) |

{For each PR:}
| **PR #{number}** — {title} | [{author}](https://github.com/Trilogy-Care/tc-portal/pull/{number}) |
```

### Writing Guidelines Per Audience

| Aspect            | Business                                                                         | End User                                                                         | Support                                                                                                     | Technical                                       |
| ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Tone**          | Board-report, outcome-driven                                                     | Friendly, conversational, "you"-focused                                          | Helpful, briefing-style with Q&A                                                                            | Raw technical, no prose                         |
| **Jargon**        | None                                                                             | None                                                                             | Moderate (internal tool names OK)                                                                           | Full                                            |
| **Structure**     | Headline → Why this matters → What's changing → Who's affected → Action required | Headline → Why we built this → What's changed → Where to find it → How to use it | Headline → Why this was changed → What's different → Where in the platform → How to help users → Likely Q&A | Stats cards → Change Log (one entry per PR)     |
| **Feature flags** | 🚩 "Deployed but not yet visible — being rolled out in phases"                   | 🚩 "Deployed but not yet visible — will appear once switched on"                 | 🚩 "Deployed but NOT yet active — check PostHog flag status"                                                | 🚩 prefix + badge + exact flag name (camelCase) |
| **Permissions**   | "Restricted to Admin users" or "Available to the Finance team"                   | "Chat to your admin if you think you should have access"                         | "Requires `permission-name` — check user's assigned role"                                                   | Exact permission string, middleware, policy     |
| **Code refs**     | Never                                                                            | Never                                                                            | Never                                                                                                       | Always — every class, column, route, file path  |
| **Grouping**      | Business domain                                                                  | User-facing area                                                                 | Likely support query topic                                                                                  | One H3 per PR with link                         |
| **Key flavour**   | ROI, risk, compliance, strategic alignment                                       | Empathy, simplicity, step-by-step guidance                                       | Anticipated Q&A pairs, old vs new behaviour, troubleshooting                                                | Complete technical reference                    |

### Impact Level Decision

| Impact     | Criteria                                                                                |
| ---------- | --------------------------------------------------------------------------------------- |
| **High**   | New features, permission changes, breaking changes, schema changes affecting many users |
| **Medium** | Enhancements to existing features, moderate UI changes, new integrations                |
| **Low**    | Bug fixes only, minor UI tweaks, internal refactoring                                   |

### Impact Badge HTML

Use the matching badge at the top of the release notes (before the GitHub Release link):

**High:**

```html
<span
  style="display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:9999px;font-size:0.75rem;font-weight:600;background:#fee2e2;color:#991b1b"
  >&#x25cf; High Impact</span
>
```

**Medium:**

```html
<span
  style="display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:9999px;font-size:0.75rem;font-weight:600;background:#fef3c7;color:#92400e"
  >&#x25cf; Medium Impact</span
>
```

**Low:**

```html
<span
  style="display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:9999px;font-size:0.75rem;font-weight:600;background:#d1fae5;color:#065f46"
  >&#x25cf; Low Impact</span
>
```

Place the badge followed by `&ensp;` then the GitHub Release link.

### 10. Create PR on tc-docs

Skip this step if `--dry-run` is set. Instead, output the generated markdown to the conversation.

**Date for all naming:** Use today's date (the date the skill runs / code was pushed to staging). Do NOT use the hypothetical next Wednesday production date — that's only for the Technical View info cards inside the `.md` content.

**Naming conventions — all use ISO date (YYYY-MM-DD) for natural sort order:**

| Element         | Format                             | Example                            |
| --------------- | ---------------------------------- | ---------------------------------- |
| **File name**   | `YYYY-MM-DD-release-notes.md`      | `2026-02-18-release-notes.md`      |
| **Branch name** | `feature/release-notes-YYYY-MM-DD` | `feature/release-notes-2026-02-18` |
| **PR title**    | `Release Notes DD Month YYYY`      | `Release Notes 18 February 2026`   |

ISO date format (`YYYY-MM-DD`) ensures files sort chronologically by default. Nuxt Content renders
them in alphabetical order in the sidebar, so newer dates appear at the bottom. To make the **newest
release appear first** in the sidebar, prefix the filename with a descending sort number:

```
# Calculate sort prefix: 9999 minus the days since epoch (or a simpler approach)
# Use the format: {sort_prefix}.YYYY-MM-DD-release-notes.md
# Where sort_prefix = 99999999 - YYYYMMDD (as integer)
# e.g. 99999999 - 20260218 = 79739781
# This means newer dates get LOWER numbers → sort first
```

**Filename:** `{sort_prefix}.YYYY-MM-DD-release-notes.md`
e.g. `79739781.2026-02-18-release-notes.md`

This ensures the newest release always appears at the top of the sidebar dropdown, with the oldest
at the bottom just above the Archive folder.

#### Clone and clean up

```bash
# Clean up any previous temp directory
rm -rf /tmp/tc-docs-release

# Clone tc-docs fresh (shallow)
gh repo clone Trilogy-Care/tc-docs /tmp/tc-docs-release -- --depth 1
cd /tmp/tc-docs-release
```

#### Handle collisions

Before creating the branch or writing the file, check if they already exist. If a branch
or file with today's date already exists (e.g. a second staging push on the same day), append
a version suffix: `-v2`, `-v3`, etc.

```bash
# Determine the base slug
base="YYYY-MM-DD-release-notes"
suffix=""
version=1

# Check for existing files with today's date
while ls content/release/2.releases/*."${base}${suffix}.md" 2>/dev/null | grep -q .; do
  version=$((version + 1))
  suffix="-v${version}"
done

# Final names
filename="{sort_prefix}.${base}${suffix}.md"
branch="feature/release-notes-YYYY-MM-DD${suffix}"

# Check if remote branch exists too
if git ls-remote --heads origin "${branch}" | grep -q .; then
  version=$((version + 1))
  suffix="-v${version}"
  filename="{sort_prefix}.${base}${suffix}.md"
  branch="feature/release-notes-YYYY-MM-DD${suffix}"
fi

git checkout -b "${branch}"

# Write the file to content/release/2.releases/${filename}
```

The PR title also gets the suffix if applicable: `Release Notes 18 February 2026 v2`.

### 10.5. Archive Rotation

Before committing, check whether the new file pushes the release count over 10.

```bash
# Count .md files in 2.releases/ (exclude index.md and the archive/ directory)
count=$(ls content/release/2.releases/*.md 2>/dev/null | grep -v index.md | wc -l | tr -d ' ')
```

If `count > 10`:

1. List all release note files in `content/release/2.releases/` (excluding `index.md`)
2. Files use ISO date format (`YYYY-MM-DD`) — they sort chronologically by default
3. The **last** file alphabetically has the **highest** sort prefix number (oldest date)
4. Move that file to `content/release/2.releases/archive/` (keep the same filename)

```bash
# The oldest release has the highest sort prefix (largest number = oldest date)
oldest=$(ls content/release/2.releases/*.md | grep -v index.md | sort | tail -1)
git mv "${oldest}" "content/release/2.releases/archive/$(basename ${oldest})"
```

Include the archive move in the same commit and PR.

### 10.6. Commit, Push & Create PR

```bash
git add content/release/2.releases/
git add content/release/2.releases/archive/

git commit -m "docs: add release notes for {DD Month YYYY}"

git push -u origin "${branch}"

gh pr create \
  --repo Trilogy-Care/tc-docs \
  --title "Release Notes {DD Month YYYY}{ v2 if applicable}" \
  --body "$(cat <<'EOF'
## Summary
- Auto-generated release notes from `main...staging` comparison on tc-portal
- Covers {N} commits across {M} files changed
- Includes Business, End User, Support, and Technical views

## PRs Included
{List of PR links from tc-portal}

## Checklist
- [ ] Business View accuracy reviewed
- [ ] End User View accuracy reviewed
- [ ] Support View accuracy reviewed
- [ ] Technical View accuracy reviewed
- [ ] Version number confirmed
- [ ] Impact level confirmed

---
Generated with `/trilogy-release-notes`
EOF
)"
```

### 10.7. Clean Up

Remove the temp directory after the PR is created (or if any step fails):

```bash
rm -rf /tmp/tc-docs-release
```

### 11. Report to User

If running interactively, report the result. If running in CI (headless), skip this step.

```markdown
## Release Notes Created

**File:** `content/release/2.releases/{sort_prefix}.YYYY-MM-DD-release-notes.md`
**PR:** {PR URL on tc-docs}
**Version:** {version or "Not detected"}
**Impact:** {High|Medium|Low}

### Summary

- {N} commits analysed
- {M} files changed
- {P} pull requests included
- {F} feature flags detected
- {R} new permissions detected

### What to Review

1. Check each audience view for accuracy
2. Verify version number
3. Confirm impact level
4. Merge PR when satisfied

### PRs Included

{Bulleted list of PR titles with links}
```

## Edge Cases

### Very Large Releases (> 100 files)

1. GitHub API paginates at 300 files per compare request
2. Focus on high-signal files (see Step 4 priority table)
3. Group remaining changes under "Additional Changes" in each section
4. Note in output: "This is a large release. Some minor changes may need manual review."

### No Meaningful Changes

If comparison returns zero commits or only dependency changes:

1. Inform the user: "No user-facing changes detected between main and staging."
2. Offer to generate a minimal technical-only release note if desired.

### Rate Limiting

If GitHub API returns 403:

1. Check `gh api rate_limit` for remaining requests
2. Reduce individual file fetches, rely on compare endpoint inline patches
3. Inform the user if data is incomplete

### Feature Flags Without Clear Names

1. Note as "conditional feature rollout" in Business/End User/Support views
2. Reference exact code pattern and file location in Technical View
3. Flag for manual review in the PR description

## Options

| Flag              | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `--dry-run`       | Output release notes to the conversation without creating a PR |
| `--version {ver}` | Explicitly set version instead of auto-detecting               |

## Integration with Workflow

```
staging branch ready
    ↓
/trilogy-release-notes
    ├── Fetches main...staging diff via GitHub API
    ├── Reads actual code changes
    ├── Analyses features, fixes, permissions, flags
    ├── Generates 4-audience release notes
    ├── Creates PR on tc-docs
    └── Archives oldest release if > 10 exist
    ↓
Review & merge tc-docs PR
    ↓
/trilogy-ship (deploy staging to production)
    ↓
Post-release communication (using release notes as source)
```

## CI / Automation

This skill can run without human interaction in a GitHub Action or any CI environment.

### Headless execution

```bash
# Via Claude Code CLI
claude -p "/trilogy-release-notes" \
  --allowedTools "Bash(gh *),Bash(git *),Read,Write,Edit,Glob,Grep"

# Via GitHub Action
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    allowed_tools: "Bash(gh *),Bash(git *),Read,Write,Edit,Glob,Grep"
    prompt: Run the /trilogy-release-notes skill.
```

### Required secrets

| Secret              | Purpose                                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ANTHROPIC_API_KEY` | Claude API authentication                                                                                                                                                                                                |
| `GITHUB_TOKEN`      | Must have repo access to both `Trilogy-Care/tc-portal` (read) and `Trilogy-Care/tc-docs` (clone, push, create PR). In CI, use a PAT or fine-grained token with cross-repo access. Locally, `gh auth login` handles this. |

### CI behaviour

- `--dry-run` is **not** used in CI — the skill always creates the PR
- Step 11 (Report to User) is skipped — there is no interactive user
- All tool permissions are auto-approved via `--allowedTools`
- The `gh` CLI authenticates using the GitHub token available in the CI environment
