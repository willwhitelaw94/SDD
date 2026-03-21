---
title: "AWS ECS Deployment (tc-docs)"
description: "Architecture, CI/CD, and operational guide for the tc-docs Nuxt site on AWS ECS/Fargate"
---

TC Docs runs on **AWS ECS/Fargate** in the Chat-Prod account alongside the existing **Cloudflare Pages** deployment. Both targets are served from the same codebase — the Nuxt build mode is controlled by environment variables.

---

## Architecture Overview

```
                     ┌────────────────┐
  User ──────────▶   │  CloudFlare    │
                     │  (DNS + Proxy) │
                     └───────┬────────┘
                             │ HTTPS (Origin Cert)
              ┌──────────────▼──────────────────────┐
              │         VPC  ·  ap-southeast-2       │
              │                                      │
              │   ┌──────────────────────────────┐   │
              │   │  ALB  (tc-docs-prod-alb)     │   │
              │   │  :443 → Target Group :3000   │   │
              │   └──────────┬───────────────────┘   │
              │              │                       │
              │   ┌──────────▼───────────────────┐   │
              │   │  ECS Fargate Service         │   │
              │   │  (tc-docs-prod-service)      │   │
              │   │  ┌────────────────────────┐  │   │
              │   │  │  Nuxt 4 (node-server)  │  │   │
              │   │  │  Port 3000             │  │   │
              │   │  └────────────────────────┘  │   │
              │   └──────────────────────────────┘   │
              │                                      │
              │   Secrets Manager  ·  CloudWatch      │
              └──────────────────────────────────────┘
```

| Component | Resource Name | Details |
|-----------|--------------|---------|
| **AWS Account** | Chat-Prod `075540751014` | `ap-southeast-2` (Sydney) |
| **VPC** | `TcDocsVpc` | 2 AZs, public subnets only, no NAT Gateway |
| **ALB** | `tc-docs-prod-alb` | Internet-facing, HTTPS via CloudFlare Origin Cert |
| **ECS Cluster** | `tc-docs-prod-cluster` | Fargate, Container Insights v2 |
| **ECS Service** | `tc-docs-prod-service` | 1-3 tasks, circuit breaker with rollback |
| **Fargate Task** | `tc-docs-prod-task` | 256 CPU / 512 MB, Node 24 |
| **ECR** | `trilogycare/tc-docs-main` | DevOps account `967883357946` |
| **Secrets Manager** | `tc-docs/env` | Runtime secrets (TCID OAuth, Typesense, Studio) |
| **Domain** | `docs.trilogycare.com.au` | CloudFlare CNAME → ALB |

---

## Dual-Mode Build System

The same `nuxt.config.ts` serves both Cloudflare Pages and AWS ECS. Two environment variables control the build mode:

| Variable | Cloudflare Pages (default) | AWS ECS |
|----------|---------------------------|---------|
| `NITRO_PRESET` | `cloudflare-pages` | `node-server` |
| `CONTENT_DB_TYPE` | `d1` | `sqlite` |

The Dockerfile sets both:

```dockerfile
ENV NITRO_PRESET=node-server
ENV CONTENT_DB_TYPE=sqlite
```

Other conditional behaviour in `nuxt.config.ts`:
- **Sharp externals** are excluded from Cloudflare bundles but included for Node.js
- **IPX image caching** is enabled only on Node.js (`maxAge: 3600`)

---

## CI/CD Pipelines

Two separate GitHub Actions workflows handle build and deploy, following the same pattern as `tc-applications` and `tc-accounts`.

### Build Workflow (`build-aws.yml`)

**Triggers:** Push to `main` (matching app paths) or `workflow_dispatch`.

```
Checkout → npm ci → Typesense Index → ECR Login → Docker Build → Push
```

| Step | Details |
|------|---------|
| **Runner** | CodeBuild self-hosted (`codebuild-trilogy-care-organisation-build-*`) |
| **Typesense indexing** | Runs `npx tsx scripts/index-typesense.ts` before Docker build |
| **Docker build** | Multi-stage, passes `TYPESENSE_SEARCH_KEY` and `STUDIO_GITHUB_CLIENT_ID` as build args |
| **Tags** | `${{ github.sha }}` + `latest` |
| **ECR** | `967883357946.dkr.ecr.ap-southeast-2.amazonaws.com/trilogycare/tc-docs-main` |

### Deploy Workflow (`deploy-aws.yml`)

**Triggers:** Automatic on successful build (`workflow_run`) or `workflow_dispatch`.

```
Determine Env → ECR Login → Verify Image → Assume Role → ECS Force Deploy → Wait Stable
```

| Step | Details |
|------|---------|
| **Role assumption** | `sts assume-role` into `ChatProdDeploymentRole` in `075540751014` |
| **Deploy method** | `aws ecs update-service --force-new-deployment` |
| **Stabilisation** | Waits up to 40 min for `services-stable` |
| **Environment gate** | GitHub environment protection (`production`) |

---

## Dockerfile

Three-stage build optimised for small image size:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Stage 1: deps   │────▶│ Stage 2: builder │────▶│ Stage 3: runner  │
│  npm ci          │     │ NITRO_PRESET=     │     │ node:24-slim     │
│                  │     │   node-server     │     │ tini + curl      │
│                  │     │ npm run build     │     │ Non-root (nuxt)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

Key details:
- `NODE_OPTIONS="--max_old_space_size=4096"` prevents OOM during Nuxt build
- Runtime copies only `.output/`, `content/`, and `public/images/`
- Uses `tini` as init process for proper signal handling
- Runs as non-root user `nuxt`
- `curl` included for container health checks

---

## CDK Infrastructure

Infrastructure is defined with **AWS CDK v2** in `infra/cdk/`.

### File Structure

```
infra/cdk/
├── bin/app.ts                    # CDK app entry point
├── lib/
│   ├── environment-config.ts     # Per-environment config (accounts, sizing, certs)
│   └── tc-docs-stack.ts          # Main stack (VPC, ECS, ALB, secrets)
├── cdk.json
├── package.json
└── tsconfig.json
```

### Environment Config (`environment-config.ts`)

Centralised configuration following the `tc-applications` pattern:

```typescript
TcDocsEnvironmentConfig.getConfig('prod')
// → account, region, domainName, certificateArn, fargate sizing, etc.
```

### Stack Resources (`tc-docs-stack.ts`)

| Resource | Configuration |
|----------|--------------|
| **VPC** | 2 AZs, public subnets only, no NAT Gateway |
| **ECS Cluster** | Container Insights v2 enabled |
| **Task Definition** | 256 CPU / 512 MB, cross-account ECR pull |
| **ALB** | HTTPS listener with CloudFlare Origin Cert, HTTP→HTTPS redirect |
| **Security Groups** | ALB SG (80, 443 inbound), ECS SG (3000 from ALB only) |
| **Auto-scaling** | 1-3 tasks, scale on 70% CPU utilisation |
| **Health check** | `GET /api/auth/tcid/session` → 200 |

### Deploying CDK Changes

```bash
cd infra/cdk
npm install
npx cdk diff -c environment=prod    # Preview changes
npx cdk deploy -c environment=prod   # Apply changes
```

---

## Secrets Manager

The ECS task pulls runtime secrets from **Secrets Manager** secret `tc-docs/env`. Each key is injected as an environment variable.

| Secret Key | Purpose |
|------------|---------|
| `TYPESENSE_SEARCH_KEY` | Search API key (public, read-only) |
| `STUDIO_GITHUB_CLIENT_ID` | Nuxt Studio GitHub OAuth |
| `STUDIO_GITHUB_CLIENT_SECRET` | Nuxt Studio GitHub OAuth |
| `GITHUB_TARGET_BRANCH` | Studio target branch (`main`) |
| `NUXT_TCID_CLIENT_ID` | TCID OAuth client ID (empty = auth disabled) |
| `NUXT_TCID_CLIENT_SECRET` | TCID OAuth client secret |
| `NUXT_TCID_ISSUER_URL` | TCID issuer (`https://accounts.trilogycare.com.au`) |
| `NUXT_PUBLIC_APP_URL` | Public URL (`https://docs.trilogycare.com.au`) |

All of these variables are also documented in `.env.example` at the repo root, which serves as the canonical reference for local development.

**Important:** ECS tasks will fail to start if any referenced JSON key is missing from the secret. Add keys with empty string values rather than omitting them.

### Updating Secrets

```bash
aws secretsmanager put-secret-value \
  --secret-id tc-docs/env \
  --secret-string '{"TYPESENSE_SEARCH_KEY":"...","STUDIO_GITHUB_CLIENT_ID":"...","STUDIO_GITHUB_CLIENT_SECRET":"...","GITHUB_TARGET_BRANCH":"main","NUXT_TCID_CLIENT_ID":"...","NUXT_TCID_CLIENT_SECRET":"...","NUXT_TCID_ISSUER_URL":"https://accounts.trilogycare.com.au","NUXT_PUBLIC_APP_URL":"https://docs.trilogycare.com.au"}' \
  --region ap-southeast-2 \
  --profile chat-prod
```

After updating secrets, force a new deployment so tasks pick up the new values:

```bash
aws ecs update-service \
  --cluster tc-docs-prod-cluster \
  --service tc-docs-prod-service \
  --force-new-deployment \
  --region ap-southeast-2
```

---

## Local Development

For local development, copy `.env.example` to `.env` and fill in values as needed:

```bash
cp .env.example .env
npm run dev
```

Key variables from `.env.example`:

| Variable | Local Default | Notes |
|----------|--------------|-------|
| `NUXT_TCID_CLIENT_ID` | *(empty — auth disabled)* | Fill in to test TCID auth locally |
| `NUXT_TCID_CLIENT_SECRET` | *(empty)* | Get from tc-accounts admin |
| `NUXT_TCID_ISSUER_URL` | `https://accounts.trilogycare.com.au` | |
| `NUXT_PUBLIC_APP_URL` | `http://localhost:3000` | |
| `TYPESENSE_SEARCH_KEY` | *(placeholder)* | Get from Typesense Cloud dashboard |
| `STUDIO_GITHUB_CLIENT_ID` | *(placeholder)* | GitHub OAuth app for Nuxt Studio |
| `STUDIO_GITHUB_CLIENT_SECRET` | *(placeholder)* | |

When `NUXT_TCID_CLIENT_ID` is empty, authentication is completely disabled and all pages are public. This is the default for local development.

The registered OAuth redirect URIs for local dev are already configured in tc-accounts:
- `http://localhost:3000/api/auth/tcid/callback`

---

## SSL / TLS

Traffic flows: **User → CloudFlare (edge TLS) → ALB (CloudFlare Origin Cert) → ECS (HTTP :3000)**

| Layer | Certificate |
|-------|------------|
| **CloudFlare → User** | CloudFlare universal SSL (automatic) |
| **CloudFlare → ALB** | CloudFlare Origin Certificate in ACM (`e5a704bd-...`) |
| **ALB → ECS** | Plain HTTP on port 3000 (internal only) |

The Origin Certificate is shared across `tc-docs`, `tc-accounts`, and `tc-applications` — it's a wildcard cert for `*.trilogycare.com.au`.

**CloudFlare DNS** must have the CNAME record with **proxy enabled** (orange cloud) for the Origin Certificate to work. Accessing the ALB hostname directly will show an SSL error because the cert is only trusted by CloudFlare.

---

## Operational Runbook

### Manual Deploy

Trigger from GitHub Actions → `Docs: Deploy Nuxt to AWS ECS` → Run workflow → select `prod`.

### Force Redeploy (same image)

```bash
aws ecs update-service \
  --cluster tc-docs-prod-cluster \
  --service tc-docs-prod-service \
  --force-new-deployment \
  --region ap-southeast-2
```

### Check Service Health

```bash
# Service status
aws ecs describe-services \
  --cluster tc-docs-prod-cluster \
  --services tc-docs-prod-service \
  --region ap-southeast-2 \
  --query 'services[0].{status:status,running:runningCount,desired:desiredCount,deployments:deployments}'

# Recent events
aws ecs describe-services \
  --cluster tc-docs-prod-cluster \
  --services tc-docs-prod-service \
  --region ap-southeast-2 \
  --query 'services[0].events[0:5]'
```

### View Logs

```bash
# Tail recent logs
aws logs tail /ecs/tc-docs-app --follow --region ap-southeast-2

# Search for errors
aws logs filter-log-events \
  --log-group-name /ecs/tc-docs-app \
  --filter-pattern "ERROR" \
  --region ap-southeast-2
```

### ECS Exec (SSH into container)

```bash
aws ecs execute-command \
  --cluster tc-docs-prod-cluster \
  --task <task-id> \
  --container app \
  --interactive \
  --command "/bin/sh" \
  --region ap-southeast-2
```

### Rollback

Deploy a previous image tag:

1. Go to GitHub Actions → `Docs: Deploy Nuxt to AWS ECS` → Run workflow
2. Set **image_tag** to the commit SHA of the known-good build
3. Run

---

## Relationship to Cloudflare Pages

Both deployments serve the same content from the same codebase. They are **independent** — changes to AWS infrastructure do not affect Cloudflare Pages and vice versa.

| Aspect | Cloudflare Pages | AWS ECS |
|--------|-----------------|---------|
| **Workflow** | `deploy.yml` | `build-aws.yml` + `deploy-aws.yml` |
| **Preset** | `cloudflare-pages` | `node-server` |
| **Database** | D1 (edge SQLite) | SQLite (local file) |
| **Auth** | None | TCID OAuth (optional) |
| **Domain** | Cloudflare-assigned | `docs.trilogycare.com.au` |

---

## Related

- [GitHub Actions](/developer-docs/how-to/github-actions) - CI/CD overview for TC Portal
- [AWS Infrastructure](/developer-docs/explanation/aws-infrastructure) - TC Portal cloud services (EC2/Aurora)
