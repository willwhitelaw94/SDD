---
title: "Business: Threads"
description: "Business context, outcomes, and stakeholder alignment for the Threads unified communication feature"
---

# Business: Threads

## Executive Summary

Care coordinators lose approximately **$1 million fortnightly** in unclaimable care management activities due to disconnected communication tools and broken tagging workflows. Only **3% of emails** and **34% of calls** are properly tagged with a TCID, meaning the vast majority of care activity goes uncaptured for revenue purposes. Threads eliminates manual tagging by unifying all communication (email, calls, notes) into package-linked timelines, making activity capture automatic rather than opt-in.

## Business Problem

### Current State
- Emails arrive in Outlook, calls are logged in Aircall, internal notes live on packages, SMS is siloed
- Each channel requires **separate manual TCID tagging** to attribute activity to a client/package
- Coordinators must copy-paste TCIDs from the portal into Aircall notes and Outlook email tagging apps
- Email tagging must happen *before* sending — no retroactive editing possible
- The Outlook TCID tagging app placement varies by version (desktop vs online), sometimes hidden in dropdowns
- Multi-client emails require comma-separated TCIDs — time-consuming and error-prone

### Pain Points (from Oct 2025 workshop — 17 coordinators)
- **Revenue leakage**: ~$1M/fortnight from untagged activities
- **Email tagging compliance**: Only 3% of emails tagged with TCID in a 2-week audit
- **Call tagging compliance**: 66% of calls untagged (Aug 2025 baseline)
- **TCID entry friction**: Forgetting to enter TCID is the #1 barrier; it's not mandatory in Aircall
- **Transferred calls**: Confusion about whether to overwrite or keep previous tags/TCIDs
- **No unified view**: Coordinators context-switch between 4+ tools to understand a single client conversation
- **Workload concerns**: New documentation requirements (15 min/month direct care per client) add burden without better tooling

### Opportunity
Threads solves the tagging problem structurally: when communication lives inside package-linked threads, activity capture becomes **automatic**. Instead of asking coordinators to manually tag every email and call, Threads assigns activity to packages through the "Assign to Package" flow — one action that attributes all past and future thread activity.

## Business Objectives

### Primary Goals
1. **Eliminate manual TCID tagging** for emails and calls by making package attribution inherent in the Threads workflow
2. **Capture >90% of care management activities** that are currently untagged, recovering the ~$1M/fortnight revenue gap
3. **Provide a unified communication timeline** so coordinators see all client context (emails, calls, notes) in one place

### Secondary Goals
4. Reduce coordinator context-switching between Outlook, Aircall, Portal, and SMS tools
5. Enable AI summarisation of thread history for faster handover between coordinators
6. Support the government-mandated 15 min/month direct care management tracking per client
7. Create a foundation for automated CMA reporting to Service Australia

### Non-Goals
- Replacing Aircall as the call platform (Threads displays call data, doesn't make calls)
- Full SMS integration (Phase 2)
- Automated thread-to-package assignment via AI (Phase 3)
- Real-time collaborative editing of replies

## Success Metrics & KPIs

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Email activity capture rate | 3% tagged with TCID | >90% attributed to packages | Threads package assignment rate vs total email volume |
| Call activity capture rate | 34% tagged | >90% attributed to packages | Threads with linked calls assigned to packages |
| Revenue from CMA claims | ~$1M/fortnight missed | <$100K/fortnight missed | Finance reporting on claimable vs actual activities |
| Coordinator context-switching | 4+ tools per conversation | 1 tool (Threads) | User survey / time-motion study |
| Time-to-context for inherited threads | 5+ minutes reading history | <30 seconds via AI summary | User survey post-launch |
| Thread-to-package assignment rate | N/A (new) | 90% within 24 hours | System metric |
| Coordinator satisfaction | Baseline survey pre-launch | +20% improvement | Post-launch survey |

## Stakeholder Analysis

| Stakeholder | Role | Interest | RACI |
|-------------|------|----------|------|
| Romy Blacklaw | Innovation & Transformation Lead | Primary sponsor, drove CMA workshops, owns tagging improvement | **Accountable** |
| Sian H | Operations Lead | Organised initial CMA training sessions, owns coordinator workflows | **Responsible** |
| Patrick Hawker | Clinical Lead | Clinical activity representation in tagging, compliance | **Consulted** |
| Charlotte Morrow | Team Leader | User advocate, surfaced UX pain points in workshop | **Consulted** |
| Beth Poultney | Designer | Figma designs for Threads, contacts page uplift | **Responsible** |
| Will W | Product / Tech Lead | Design approval, technical oversight | **Responsible** |
| Care Partners / Coordinators | End users (17 attended workshop) | Daily users, need less friction in activity capture | **Informed** |
| Mike's Team (Analytics) | Data & Reporting | CMA compliance analytics, revenue reporting | **Consulted** |
| Service Australia | Government regulator | Mandates 15 min/month direct care, quarterly funding model | **Informed** |

## Business Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Coordinators don't adopt Threads (stick to Outlook) | Revenue gap persists | Medium | Phase rollout, remove "Email and SMS" nav, training program |
| Email integration infrastructure not ready | Can't ingest/send emails from Portal | High | Scope Phase 1 to read-only email display if sending blocked |
| Aircall integration delayed (Calls Uplift dependency) | Timeline missing call cards | Medium | Phase 2 for calls; Phase 1 focuses on email + notes |
| AI summarisation quality insufficient | Feature underused, no time savings | Low | Human review of summaries, iterative prompt tuning |
| Support at Home quarterly funding model changes | Shifts CMA requirements | Low | Design for flexible activity categorisation |
| Coordinator workload increases rather than decreases | Pushback, low adoption | Medium | User testing during design, simplify assign-to-package flow |

## ROI Analysis

### Investment
- Development: Full-stack feature (models, migrations, controllers, Vue pages, email integration)
- Design: Complete (Figma designs mature)
- Training: Coordinator onboarding program

### Expected Returns
- **$1M/fortnight** in recovered CMA revenue (primary)
- Reduced coordinator time per conversation (~30% less context-switching)
- Compliance with Service Australia 15 min/month direct care requirement
- Foundation for AI-powered care management (summarise, generate replies, auto-assign)

### Payback Period
- Conservative: Revenue recovery begins within 2 weeks of go-live as coordinators assign threads to packages
- Full ROI within 1 quarter assuming 50%+ adoption rate

## Market Context

### Target Users
- **Primary**: Care Partners, Senior Care Partners, Care Coordinators (Internal) — ~50+ staff
- **Secondary**: Care Coordinators (External), Team Leaders
- **Downstream**: Analytics team, Finance (revenue reporting), Compliance

### Regulatory Context
- **Support at Home Program**: Quarterly "use it or lose it" funding model replacing accumulated Home Care Packages
- **Service Australia**: Mandates minimum 15 minutes/month direct care management per client
- **Revenue impact**: 10% of provider revenue comes from care management activity claims
- Accurate activity capture is not optional — it's a regulatory and financial requirement

### Timing
- CMA tagging workshops completed Oct 2025 — user pain points well-documented
- Nov 2025 was the tagging system implementation deadline — compliance still low
- Threads represents the **structural fix** that manual tagging process improvements cannot achieve

## Business Clarifications

### Session 2025-08-21 — Care Management Activities - AirCall/Portal Tagging (Leaders)
- 66% of calls untagged at baseline
- Government mandates 15 min/month direct care per client
- New workflow: categorise contacts as check-ins, assessments, interventions
- Portal note categories must align with AirCall tags
- Concerns about increased workload for coordinators with large caseloads

### Session 2025-08-22 — Care Management Activities (Staff Training)
- Direct vs Indirect activity definitions rolled out
- Multi-client call tag for coordinators discussing multiple clients
- Practice period → Nov 1st full implementation deadline
- Teams channel set up for feedback

### Session 2025-08-22 — Care Management Activity (Design)
- Contacts page uplift to consolidate all contact types
- Activity logs referenced for AI integration (conversation history)
- Long-term: AI-generated care management activities from Databricks data
- Missed care initiatives = highest business value

### Session 2025-10-29 — Tagging Care Management Activities Workshop
- ~$1M missed biweekly from untagged calls and emails
- Only 3% of emails tagged with TCID in 2-week audit
- Key user asks: mandatory TCID, typeahead search by client name, copy button for TCIDs
- Email tagging must happen before sending — no retroactive editing
- Outlook app placement varies by version — visibility problem
- Proposal: standardise tags with "direct"/"indirect" prefixes across platforms

### Fireflies Sources
- [Tagging Care Management Activities Workshop](https://app.fireflies.ai/view/Tagging-Care-Management-Activities-workshop::01K8HQRXGHKCSZPHMFVGVMVXYX) (Oct 29, 2025)
- [Care Management Activities - AirCall/Portal Tagging](https://app.fireflies.ai/view/::01K34FTCHJEBCFV3BWD4TMRB87) (Aug 21, 2025)
- [Care Management Activities (Tagging)](https://app.fireflies.ai/view/::01K37AZE7GVDJRDC9KTWE0XA7G) (Aug 22, 2025)
- [Care Management Activity](https://app.fireflies.ai/view/::01K35EXS7P7S6RBD9498GXMPB9) (Aug 22, 2025)

## Approval

- [ ] Business objectives approved
- [ ] Success metrics defined
- [ ] Stakeholders aligned
- [ ] Revenue impact validated by Finance
- [ ] Regulatory requirements confirmed
