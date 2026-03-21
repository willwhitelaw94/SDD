---
title: "Technology"
description: "Data Hub, AI enablement, identity, and cloud rationalisation"
sidebar:
  order: 3
---

*Owner: Mike*

## Strategic Context

Technology is expected to **underwrite 30%+ annual growth while slashing manual effort** across Finance, Care and Growth. The focus is on building a **secure, cloud-first "single source of truth" and an AI-enabled developer platform** that can be exploited by every function.

Key drivers:
- Need for a unified **Data Hub**
- Robust **identity layer**
- Rationalised SaaS estate
- Step-change in analytics & automation capability

---

## FY26 Objectives

| KPI | FY25 Baseline | FY26 Target | Why it matters |
|-----|---------------|-------------|----------------|
| % enterprise data in **Data Hub** | < 5% | **≥ 80%** | Enables analytics, AI assistants & compliance |
| Average **SaaS apps / FTE** | 11.2 | **≤ 6.0** | Cut licence spend & simplify support |
| **Time-to-provision** new app/API | 8 weeks | **< 2 weeks** | Speeds product & growth experiments |
| **Security posture** | Baseline | **All high-severity remediated < 30 days** | Meet ACQSC / ISO27001 obligations |

---

## Strategic Pillars

### Data Hub & Knowledge Graph
*Consolidate data → insights*

- Stand up **Azure "Data Hub"** with canonical schemas
- Ingest CRM, MYOB, Aircall & website logs
- Expose via the **Trilogy Graph API** for dev & analytics teams

### AI-powered Experience
*Augment staff & clients*

- Pilot **Trilogy Chat** (RAG on Trilogy Corpus & KB) for internal Q&A
- Embed **document intelligence & search** layers to automate bill capture and ticket triage

### Identity & Access Modernisation
*Secure, seamless auth*

- Implement central **Identity Management** (Cloudflare gateway → Azure AD B2C) across Portal, mobile and extensions
- Enforce MFA & role-based least-privilege by default

### Cloud & SaaS Rationalisation
*Reduce toil & cost*

- Audit AWS/Azure spend; retire idle workloads
- Migrate low-code apps to managed PaaS
- De-dupe overlapping SaaS; "turn on key features" in core suites before buying new tools

### Security & Resilience
*"Zero regrets" posture*

- Deploy **SIEM & routine penetration testing** with automated alerting
- Implement infrastructure-as-code & immutable backups

### People & Ways-of-Working
*Right roles, right skills*

Form three verticals:
- **Applications**
- **Data & Intelligence**
- **Infrastructure**

Staffed by engineers, analysts, testers.

---

## Reference Architecture

```
Edge → Identity → Micro-front-ends (Portal, Chat, Mobile, Extensions)
         ↓
    Azure (Data Hub, Intelligence, Compute)
    AWS (client-facing portal workloads)
         ↓
    Common Graph API (abstracts data access)
    Power BI / Power Apps (rapid internal solutions)
         ↓
    Security & DevOps layers (CI/CD pipelines, IaC, monitoring)
```

---

## Capability Roadmap

| Quarter | Milestone | Headcount Impact |
|---------|-----------|------------------|
| **Q1** | Data Hub MVP live (CRM + finance feeds) | +1 Data Engineer |
| **Q2** | Trilogy Chat beta (internal) | +1 AI Engineer |
| **Q3** | SaaS rationalisation complete; SIEM operational | +1 Security Ops (transfer) |
| **Q4** | External Graph API & analytics self-service launched | No net add (re-skill) |

---

## Success Measures

1. **≥ 80% of business reporting powered by Data Hub** by Q4
2. **≥ 50% reduction in duplicate SaaS subscription cost** YoY
3. **Employee sat > 8/10** for tech tooling & support (annual survey)
4. **Mean time to detect & contain security incidents < 30 min**
