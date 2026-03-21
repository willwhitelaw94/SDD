---
title: Strategic Goals
description: What we're building toward - the outcomes that matter
---

The product mission tells us *why* we exist. These goals tell us *what* we're trying to achieve.

## Operational Efficiency

**Goal:** Do more with less through smarter workflows.

- Reduce labour costs by streamlining workflows
- Enable coordinators and care partners to manage more clients with less effort
- Automate repetitive tasks (billing, approvals, case notes)

**Why it matters:** Every hour saved on admin is an hour available for care. At scale, this is the difference between sustainable growth and burnout.

**Commercial impact:** Coordinator capacity directly affects margin. If one coordinator manages 50 clients vs 80 clients, that's a 60% efficiency gain. Traditional providers charge 30-40% fees partly because of admin overhead. Our target: industry-leading operational cost per client.

## Budget Utilisation

**Goal:** Maximise how much of each recipient's funding actually turns into care.

- Increase average budget utilisation rate to ≥75%
- Proactive engagement when utilisation drops
- Reduce unspent funds that "leak" at end of period

**Why it matters:** Every dollar not utilised is care not delivered. Low utilisation means recipients aren't getting the support they're entitled to. Under Support at Home, unutilised funding is increasingly use-it-or-lose-it.

**Commercial impact:** Utilisation drives revenue directly. Our management fee applies to *spent* funds, not allocated funds. A recipient with $50k budget at 60% utilisation generates less revenue than the same recipient at 85% utilisation. At 14,000+ clients, even a 5% lift in average utilisation is significant.

### Target: ≥75% Utilisation

| Utilisation Level | Status | Action |
|-------------------|--------|--------|
| **≥75%** | Healthy | Monitor, maintain |
| **50-75%** | Needs attention | Coordinator outreach |
| **<50%** | At risk | Urgent engagement |

**Common causes of low utilisation:**
- Recipient doesn't know what services they can access
- Services not available in their area
- Resistance to using "government money"
- Care needs have changed but budget hasn't been reviewed

**Product features driving utilisation:**
- Utilisation dashboards for coordinators
- Automated low-utilisation alerts
- "Spend your budget" nudges for recipients
- Service discovery and booking tools

See [Utilisation Rate](/features/domains/utilisation) for the technical domain.

## Customer Experience

**Goal:** A unified, delightful experience for everyone who touches the portal.

- Single portal for recipients, providers, and coordinators
- Mobile responsiveness and self-service features
- Improved timeliness, reliability, and communication

**Why it matters:** Care is stressful enough. The software shouldn't add friction. When the portal "just works," trust grows.

**Commercial impact:** Retention is cheaper than acquisition. Excellent UX drives NPS, which drives referrals. Five Good Friends grew 50% in FY24 partly through word-of-mouth. Self-service reduces support costs and coordinator workload.

## AI & Automation

**Goal:** Let AI handle the repetitive so humans can focus on judgement.

- AI-generated care plans and budgets
- Automated risk detection and incident management
- AI-summarised calls, meetings, and notes

**Why it matters:** AI isn't replacing care workers—it's giving them superpowers. Faster documentation, earlier warnings, better decisions.

**Commercial impact:** AI is our moat. Mable has scale, but we can out-innovate. Every AI feature that saves 10 minutes per client per week = 9 hours/year per client. At 14,000+ clients scaling to 80,000, that's transformational. AI-first competitors win on margin.

## Reduced SaaS Dependency

**Goal:** Own our core workflows and cut external costs.

- Bring key processes in-house to cut ~$450k+ annual software costs
- Replace reliance on Zoho, MYOB, and other third-party systems where possible

**Why it matters:** Every dollar saved on SaaS is a dollar invested in our own platform. And we control the roadmap.

**Commercial impact:** SaaS costs are direct margin erosion. Own the stack = own the margin. PlanCare built CareTaskr to control their destiny. Five Good Friends spun out Lookout Way as a revenue stream. Platform ownership creates optionality.

### Current SaaS Costs (2026 Estimates)

| Platform | Annual Cost | Replacement Priority |
|----------|-------------|---------------------|
| **Aircall** (Telephony) | ~$150k | High - exploring cheaper alternatives |
| **Office 365** | ~$100k | Low - keep |
| **MYOB/Xero** (Accounting) | ~$50k | Medium - ledger replacement is complex |
| **Employment Hero** | TBD | Low - not replacing soon |
| **Zoho CRM** | ~$150k+ | High - active replacement via Portal |

**Total addressable:** ~$450k+/year in SaaS that could be replaced or reduced.

### Replacement Strategy

Not everything should be built in-house. The decision framework:

| Factor | Build In-House | Keep SaaS |
|--------|----------------|-----------|
| Core to care delivery? | Yes | No |
| Competitive differentiator? | Yes | No |
| Integration pain high? | Yes | No |
| Roadmap control critical? | Yes | No |
| Specialised domain (payroll, ledger)? | No | Yes |

**Active replacements:**
- **Zoho CRM** → Portal lead management (in progress)
- **Aircall** → Exploring alternative telephony providers
- **Easy Collect** → Portal-native collections (future)

## Regulatory Agility

**Goal:** Adapt quickly when the rules change.

- Respond rapidly to Support at Home reforms and subsidy models
- Ensure compliance with Aged Care Quality Standards

**Why it matters:** Aged care regulation is evolving fast. The organisations that adapt quickly will win. Those that don't will struggle.

**Commercial impact:** Support at Home (Nov 2025) is a market reset. First-movers on compliance gain trust. Slow movers lose clients to those who "just work" with the new system. Australian Unity spent $30M integrating myHomecare—regulatory complexity is expensive for laggards.

## Data-Driven Decisions

**Goal:** Clean data in, actionable insights out.

- Capture validated data at the source
- Provide real-time insights on budget utilisation, risks, and service quality

**Why it matters:** You can't improve what you can't measure. Bad data leads to bad decisions. Good data is a competitive advantage.

**Commercial impact:** Data enables better care outcomes, which enables premium positioning. Clean data also enables AI features—garbage in, garbage out. Clients will pay more for providers who can demonstrate outcomes. Data is the foundation of enterprise sales.

### Product Metrics (Work in Progress)

::alert{type="warning"}
**Status:** We don't have great product metrics yet. This is an active gap we're working to close.
::

**What we need to measure:**

| Metric Type | Examples | Why It Matters |
|-------------|----------|----------------|
| **CSAT by feature** | Budget satisfaction, Invoice processing satisfaction | Know which features delight vs frustrate |
| **Time-on-task** | How long to process a bill, create a budget | Identify efficiency opportunities |
| **Adoption rates** | % of coordinators using feature X | Understand if features are landing |
| **Error rates** | Failed submissions, classification errors | Quality signals |

**Current state:**
- We've been sprinting on delivery, not measurement
- PostHog is integrated but underutilised for feature analytics
- Hiring a **Customer Success lead** to own this

**Target state:**
- Every major feature has a CSAT score
- Time-to-complete benchmarks for key workflows
- Dashboard showing feature health at a glance

Until we have these metrics, we're flying partially blind on what's working and what needs improvement.

## Risk Management & Safety

**Goal:** Catch problems before they become incidents.

- Proactive detection of falls, pressure injuries, and other health risks
- Incident auto-logging and escalation workflows

**Why it matters:** In aged care, early intervention saves lives. A fall detected early is a hospitalisation prevented.

**Commercial impact:** Incidents are expensive—legally, reputationally, and operationally. A single serious incident can cost $50k+ in investigation, remediation, and lost clients. Proactive risk detection is both a care imperative and a business one. It's also a sales differentiator.

## Compliance & Security

**Goal:** Trust by design, not afterthought.

- Ensure data integrity and secure handling of sensitive health information
- Maintain robust audit logs for AI and human decision-making

**Why it matters:** We handle some of the most sensitive data there is. Compliance isn't a checkbox—it's a foundation.

**Commercial impact:** A data breach would be catastrophic—regulatory fines, client exodus, reputational damage. Conversely, strong security posture is table stakes for enterprise clients and partnerships. As AI use grows, audit trails become mandatory for regulatory approval.

## Scalability

**Goal:** Build for 80,000 recipients, not just 14,000+.

- Handle growth from 14,000+ recipients to 80k+ under Support at Home
- Modular integrations to onboard new providers or partners easily

**Why it matters:** Support at Home will consolidate the market. We need to be ready for 7x growth without breaking.

**Commercial impact:** Fixed costs spread across more clients = better unit economics. HomeMade grew 95% in one year ($42M → $83M). The market rewards scale. Winners will emerge from Support at Home with 50k+ clients. Losers will struggle below 10k.

## Competitive Advantage

**Goal:** Be the best aged care platform in Australia.

- Build tech-enabled care that competitors can't match
- Drive retention, referrals, and higher client engagement

**Why it matters:** This isn't just about efficiency—it's about building something genuinely better for the people we serve.

**Commercial impact:** The market is consolidating around 2-3 major platforms. Mable raised $100M and is valued near $1B. Five Good Friends secured TPG backing. To compete, we need differentiation that's hard to copy—deep AI integration, superior UX, clinical outcomes. See \[Competitive Landscape]\(/context/1. Strategic/competitive-landscape/) for detailed competitor analysis.

---

## Time to Impact

Understanding the cost of building helps everyone make better decisions. Every feature has a cost, and we should think in terms of investment and return.

**See [Time to Impact](/overview/foundations/03-time-to-impact) for the full breakdown of development costs, cost-benefit thinking, and how to apply TTI in daily work.**

---

## How Goals Connect to Work

These goals aren't abstract. They should inform:

1. **Initiative prioritisation** - Does this move us toward a goal?
2. **Feature decisions** - Which goal does this serve?
3. **Trade-off discussions** - When goals conflict, which matters more right now?
4. **Success metrics** - How do we know we're making progress?

If work doesn't connect to a goal, question whether it should be done.
