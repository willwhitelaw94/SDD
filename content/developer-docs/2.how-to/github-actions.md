---
title: GitHub Actions
description: CI/CD pipelines and automated workflows
---

We use [GitHub Actions](https://github.com/features/actions) for continuous integration and deployment.

A lot of the integrations between GitHub and Linear can be configured within Linear itself, having the ability to move tickets to QA/Done for example when a PR is approved and closed. However, the issue is these integrations are PR event driven, where we can only trigger status changes on things like opening a PR, merging a PR, or using commit linking magic words, not simple pushes by themselves.

That’s the problem, we wanted a way to move tickets to ‘In Progress’ when a developer creates their branch, not after they’ve spent days doing the development and finally open a PR for the first time, to achieve this we created a GitHub workflow in the [tc-portal]{.code} repo called [linear-branch-create.yml]{.code}

In theory this shouldn’t need to change but if for whatever reason we create a new team on Linear or an existing team decides to change their prefix eg Tims Duck Squad which has the ticket prefix “DUC” may one day change to something new, if these scenarios happen and we want to keep the automations, then we need to update [linear-branch-create.yml]{.code} The issue we have is if we have 6 teams in Linear, each team will have their own unique underlying state ID for ‘In Progress’ and for new teams we’ll need to configure this

### Steps

- We need to extract the teams state ID for ‘In Progress’ this can either be done using a CURL command or by changing a ticket in Linear to in progress and inspection the network requests payload, either works

```js
curl -X POST https://api.linear.app/graphql \
     -H "Content-Type: application/json" \
     -H "Authorization: YOUR_API_KEY" \
     -d '{"query":"query { workflowStates { nodes { id name team { key } } } }"}'
```

- Add the prefix and state ID into [linear-branch-create.yml]{.code} for the team prefix switch statement

v

---

## Overview

GitHub Actions automates our build, test, and deployment pipelines, triggered by events like pushes and pull requests.

```text
Push/PR → Build → Test → Deploy
```

---

## Workflows

### CI Pipeline (Pull Requests)

Runs on every pull request to ensure code quality.

| Step                | Description                              |
| ------------------- | ---------------------------------------- |
| **Checkout**        | Pull the code                            |
| **Setup**           | Install PHP, Node.js, dependencies       |
| **Lint**            | Code style checks (PHP CS Fixer, ESLint) |
| **Static Analysis** | PHPStan, TypeScript checks               |
| **Unit Tests**      | PHPUnit, Jest                            |
| **Build**           | Compile frontend assets                  |

### CD Pipeline (Deployment)

Runs on merge to main/staging branches.

| Step       | Description               |
| ---------- | ------------------------- |
| **Build**  | Compile production assets |
| **Deploy** | Push to Laravel Forge     |
| **Notify** | Slack notification        |

---

## Triggers

| Event              | Workflow    | Environment |
| ------------------ | ----------- | ----------- |
| PR opened/updated  | CI Pipeline | -           |
| Merge to `staging` | Deploy      | Staging     |
| Merge to `main`    | Deploy      | Production  |
| Manual dispatch    | Deploy      | Selected    |

---

## Secrets & Variables

Secrets are stored in GitHub and accessed via `${{ secrets.NAME }}`:

| Secret                  | Purpose                  |
| ----------------------- | ------------------------ |
| `FORGE_API_TOKEN`       | Laravel Forge deployment |
| `SLACK_WEBHOOK_URL`     | Deployment notifications |
| `AWS_ACCESS_KEY_ID`     | AWS service access       |
| `AWS_SECRET_ACCESS_KEY` | AWS service access       |

---

## Example Workflow

```yaml
name: CI

on:
  pull_request:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'

      - name: Install dependencies
        run: composer install --no-interaction

      - name: Run tests
        run: php artisan test
```

---

## Best Practices

### Do

- Keep workflows fast (cache dependencies)
- Use matrix builds for multiple PHP/Node versions
- Fail fast on linting errors
- Use environment protection rules

### Don't

- Store secrets in code
- Skip tests on "small" changes
- Deploy without CI passing

---

## Monitoring

Check workflow status:

- **GitHub** → Actions tab
- **Slack** → #deployments channel

---

## Linear - GitHub Integration

Linear provides built-in integrations with GitHub that trigger ticket status changes on PR events (opening, merging, commit linking). However, these are PR-driven and don't handle simple branch pushes.

### Branch Creation Automation

To move tickets to "In Progress" when a developer creates their branch (rather than waiting until they open a PR), we use the `linear-branch-create.yml` workflow.

### Configuration

Each Linear team has a unique state ID for "In Progress". When adding new teams or changing team prefixes, update `linear-branch-create.yml` with the team's prefix and state ID.

### Getting a Team's State ID

Use this cURL command to extract state IDs:

```bash
curl -X POST https://api.linear.app/graphql \
     -H "Content-Type: application/json" \
     -H "Authorization: YOUR_API_KEY" \
     -d '{"query":"query { workflowStates { nodes { id name team { key } } } }"}'
```

Alternatively, change a ticket to "In Progress" in Linear and inspect the network request payload.

### When to Update

Update the workflow when:

- A new team is created in Linear
- An existing team changes their ticket prefix (e.g., "DUC" changes to something new)

Add the prefix and corresponding "In Progress" state ID to the switch statement in `linear-branch-create.yml`.

---

## Related

- [AWS Infrastructure](/developer-docs/explanation/aws-infrastructure) - Infrastructure overview
- [Laravel Forge](/features/tools/forge) - Deployment target
- [Pull Request Manifesto](/overview/team-practices/01-pull-request-manifesto) - PR practices
