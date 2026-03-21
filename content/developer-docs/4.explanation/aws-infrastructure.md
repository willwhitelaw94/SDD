---
title: "AWS Architecture"
description: "Cloud infrastructure and services powering TC Portal"
---

TC Portal is hosted on AWS in the Sydney (ap-southeast-2) region.

---

## Architecture Overview

```
                                    ┌─────────────────────────────────────────┐
                                    │              VPC - Sydney               │
                                    │         Availability Zone 1             │
                                    │                                         │
┌──────┐      ┌─────────────┐      │      ┌─────────┐     ┌──────────────┐  │
│ User │ ───▶ │ CloudFront  │ ─────┼────▶ │   EC2   │────▶│ Aurora MySQL │  │
└──────┘      └─────────────┘      │      └────┬────┘     └──────────────┘  │
                                    │           │                            │
                                    │           ├─────────▶ Amazon S3        │
                                    │           │                            │
                                    │           └─────────▶ Lambda           │
                                    │                                         │
                                    │  ┌────────────┐  ┌──────────────────┐  │
                                    │  │ CloudWatch │  │ IAM / Security   │  │
                                    │  │  (Logging) │  │    Services      │  │
                                    │  └────────────┘  └──────────────────┘  │
                                    └─────────────────────────────────────────┘
```

---

## Core Services

### Compute

| Service | Purpose |
|---------|---------|
| **EC2** | Application servers running Laravel |
| **Lambda** | Serverless PDF generation |

### Database & Storage

| Service | Purpose |
|---------|---------|
| **Aurora MySQL** | Primary relational database |
| **Amazon S3** | File storage (documents, uploads) |
| **ElastiCache (Redis)** | Caching, sessions, queues |

### Networking & CDN

| Service | Purpose |
|---------|---------|
| **CloudFront** | CDN for static assets |
| **VPC** | Network isolation |
| **Route 53** | DNS management |

### Security & Monitoring

| Service | Purpose |
|---------|---------|
| **IAM** | Access management and roles |
| **CloudWatch** | Logging and monitoring |
| **Secrets Manager** | Secure credential storage |

---

## Environment Tiers

| Environment | Purpose | Provisioning |
|-------------|---------|--------------|
| **Production** | Live customer traffic | Auto-scaling |
| **Staging** | Pre-release testing | Single instance |
| **Development** | Feature testing | On-demand |

---

## Data Flow

1. **User Request** → CloudFront (CDN)
2. **CloudFront** → EC2 (Application)
3. **EC2** → Aurora MySQL (Data)
4. **EC2** → S3 (Files)
5. **EC2** → Lambda (PDF generation)
6. **Response** → User

---

## Related

- [GitHub Actions](/developer-docs/how-to/github-actions) - CI/CD pipelines
- [Laravel Forge](/features/tools/forge) - Server management
- [AWS Lambda](/features/tools/aws-lambda) - Serverless functions
