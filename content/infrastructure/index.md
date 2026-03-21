---
title: Infrastructure
description: Platform infrastructure, hosting, and operational runbooks
icon: i-heroicons-server-stack
---

How our platforms are hosted, deployed, and operated. This section covers the infrastructure behind each project — not the application code, but the stuff that keeps it running.

---

## TC Docs

The documentation site you're reading right now. A Nuxt Content site deployed to both AWS and Cloudflare.

| Document | Description |
|----------|-------------|
| [AWS ECS Deployment](/infrastructure/aws-ecs-deployment) | Architecture, CDK stack, CI/CD pipelines, and operational runbook for ECS/Fargate |

---

## TC Portal

TC Portal infrastructure is managed via Laravel Forge and documented in the developer docs.

| Resource | Description |
|----------|-------------|
| [GitHub Actions](/developer-docs/how-to/github-actions) | CI/CD pipelines and Linear integration |
| [AWS Infrastructure](/developer-docs/explanation/aws-infrastructure) | EC2, Aurora, S3, Lambda, CloudFront |
| [Feature Flags](/developer-docs/how-to/feature-flags) | PostHog + Pennant for incremental rollouts |
