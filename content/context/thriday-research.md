---
title: "Thriday Research Document"
created: 2026-03-01
topic: "Thriday - Australian Fintech/Accounting Platform"
sources_searched:
  web:
    - https://www.thriday.com.au/
    - https://www.thriday.com.au/features/accounting-software
    - https://www.thriday.com.au/roadmap
    - https://news.microsoft.com/en-au/features/thriday-rescues-tired-aussie-business-owners-from-financial-admin-with-all-in-one-platform/
    - https://www.thriday.com.au/blog-posts/innovation-technology-and-ai-an-interview-with-microsoft-and-thriday
    - https://finovate.com/tyro-acquires-sme-financial-management-platform-thriday/
    - https://www.smartcompany.com.au/business-advice/tyro-thriday-acquisition-banking-payments-accounting/
    - https://taxleopard.com.au/blogs/accounting/top-3-thriday-alternatives-in-2024/
    - https://stockhead.com.au/tech/new-bookkeeping-platform-thriday-says-ai-is-on-its-way-to-save-you-from-taxes-and-accountants/
  local_files:
    - /Users/williamwhitelaw/Herd/financial-ledger/Thriday-Trilogy_Care[50046].pdf
---

# Thriday Research Document

## Executive Summary

Thriday is an Australian fintech platform founded in 2020 by Michael Nuciforo and Ben Winford that combines business banking, automated bookkeeping, invoicing, and tax services into a single platform aimed at sole traders and small-to-medium enterprises (SMEs). Its core value proposition is eliminating financial admin by unifying banking, accounting, and tax into one AI-powered system -- something no other Australian platform does natively.

The platform is powered by an AI engine called "Luca" (named after Luca Pacioli, the inventor of double-entry accounting) that automatically categorises transactions, reconciles receipts, forecasts tax obligations, and generates financial reports. Thriday is built on Microsoft Azure's serverless, event-driven architecture, uses machine learning for transaction categorisation, and leverages Microsoft cognitive services for computer vision (receipt scanning) and speech recognition.

A significant development: in December 2025, Australian payments company Tyro Payments acquired Thriday, with the deal completing in January 2026. The majority of Thriday's team, including CEO Michael Nuciforo, joined Tyro. This positions the combined entity to offer an integrated banking, payments, accounting, and tax platform for SMEs. Separately, a 2024 pitch deck from Thriday specifically targeted Trilogy Care as a potential partner, proposing "business-in-a-box" capabilities for Trilogy Care's contractor workforce.

---

## 1. What is Thriday?

Thriday is a Melbourne-based fintech company that describes itself as "the financial operating system of a business." It is:

- **An authorised representative of a bank** (Regional Australia Bank Ltd, Representative No. 1297601)
- **A registered tax agent** (No. 26262416)
- **An AI-powered all-in-one platform** combining banking + accounting + tax

**Founded:** 2020
**Headquarters:** Melbourne, Australia
**Team Size:** ~40 staff across Australia, South Africa, India, Philippines, and Europe
**Funding:** $9 million raised to date
**Acquisition:** Acquired by Tyro Payments (ASX-listed) in December 2025, completed January 2026

### Key Milestones

| Date | Milestone |
|------|-----------|
| 2020 | Founded by Michael Nuciforo and Ben Winford |
| 2020 | Joined Microsoft for Startups program |
| 2022 (Aug) | Public launch after achieving ISO/IEC 27001 certification |
| 2023 | Won FinTech Awards (2023 and 2024) |
| 2024 | Partnered with NAB to launch "NAB Bookkeeper" |
| 2024 | Surpassed 3.5 million AI-categorised transactions |
| 2025 (Dec) | Acquired by Tyro Payments |
| 2026 (Jan) | Acquisition completed; team joined Tyro |

---

## 2. Core Features

### 2.1 Banking

| Feature | Description |
|---------|-------------|
| **Transaction Accounts** | Up to 10 linked accounts (Revenue, Profit, Tax, Owner's Pay, OpEx, etc.) with $0 monthly fees |
| **Visa Debit Cards** | Up to 4 cards per account; physical, virtual, Apple Pay, Google Wallet |
| **Automatic Allocations** | Percentage-based income splitting (e.g., 5% to Profit, 15% to Tax, 50% to Owner's Pay, 30% to OpEx) |
| **Savings Interest** | 3.35% p.a. across all accounts, paid daily |
| **Payments** | PayTo, BPAY, bank transfers |
| **Banking Partner** | Regional Australia Bank Ltd |

### 2.2 Automated Bookkeeping / Accounting

| Feature | Description |
|---------|-------------|
| **AI Transaction Categorisation** | Luca AI automatically categorises all transactions using ML algorithms trained on 3.5M+ transactions |
| **Receipt Scanning** | Computer vision extracts receipt data and auto-matches to transactions |
| **Chart of Accounts** | Automatically maintained based on categorised transactions |
| **Cash Flow Reporting** | Real-time cash flow statements, P&L, balance sheets |
| **Invoicing** | Unlimited professional invoices with payment links, automated late-payment reminders (1, 7, 14 days overdue) |
| **Bill Management** | Upload, scan, and schedule bill payments |

### 2.3 Tax and BAS

| Feature | Description |
|---------|-------------|
| **Real-Time Tax Forecasting** | Predicted tax bill continuously updated as income/expenses flow |
| **GST Tracking** | Automatic GST calculation from categorised transactions and scanned receipts |
| **BAS Lodgement** | Automated BAS calculation and lodgement (on paid plans) |
| **Tax Return Lodgement** | Direct tax filing to ATO (on paid plans) |
| **Tax Agent Access** | Registered tax agents available for review and lodgement |
| **Deduction Identification** | Scanned receipts automatically identify eligible tax deductions |

### 2.4 Additional Services

- **ABN Registration** -- register for an ABN directly through the platform
- **Asset/Liability Registers** -- track business assets and liabilities
- **Savings Accounts** -- dedicated savings functionality
- **Card Controls** -- manage and lock/unlock cards

---

## 3. Technology Stack

Thriday has a publicly documented technology stack thanks to its Microsoft partnership. Key details:

### Cloud Infrastructure

| Component | Technology |
|-----------|------------|
| **Cloud Provider** | Microsoft Azure (Australian data centre regions) |
| **Architecture** | Serverless, event-driven |
| **Development Tools** | Azure DevOps, Visual Studio App Center |
| **Monitoring** | Azure Application Insights |
| **Security** | Microsoft Defender, Microsoft Sentinel |
| **Certification** | ISO/IEC 27001 (achieved pre-launch) |
| **Productivity** | Microsoft 365 with endpoint security |
| **CRM (planned)** | Microsoft Dynamics 365 |
| **Partner Support** | Microsoft Specialised Partner Arinco (identity management, DevOps, performance) |

### AI and Machine Learning

| Component | Technology |
|-----------|------------|
| **AI Engine** | "Luca" -- custom AI/ML engine |
| **ML Platform** | Azure Machine Learning |
| **Computer Vision** | Microsoft Cognitive Services (receipt/document scanning) |
| **Speech Recognition** | Microsoft Cognitive Services |
| **Generative AI** | OpenAI models (planned "Co-pilot" feature) |
| **Transaction Categorisation** | Custom ML models trained on 3.5M+ transactions |

### Integration Partners

| Partner | Integration |
|---------|-------------|
| **Space Invoices** | API-first invoicing infrastructure (white-label) |
| **NAB** | Core banking integration for NAB Bookkeeper |
| **Visa** | Debit card issuance and payment processing |
| **Regional Australia Bank** | Banking licence and account provision |
| **Microsoft** | Full-stack cloud, AI, and productivity |

### Key Architectural Observations

- **Serverless, event-driven** -- no traditional server management; scales automatically
- **Data geo-replication** planned across Azure regions for resilience
- **Real-time processing** -- transactions flow through and trigger categorisation, tax recalculation, and reconciliation in real-time
- **Background AI** -- Thriday prioritises invisible "helper functions" over flashy AI features; categorisation, formatting, tax classification happen silently
- **Mobile-first** -- native iOS and Android apps alongside web platform

---

## 4. AI Categorisation and Automated Reconciliation

### How the AI Works

1. **Transaction Ingestion** -- all transactions through Thriday bank accounts and Visa Debit cards are captured in real-time
2. **Vendor Recognition** -- Luca's ML models recognise vendors from transaction metadata (merchant name, category codes, amounts)
3. **Categorisation** -- transactions are assigned to the appropriate chart of accounts category based on vendor recognition and historical patterns
4. **Receipt Matching** -- when receipts are scanned, computer vision extracts line items, amounts, dates, and GST; these are matched to corresponding transactions
5. **Reconciliation** -- matched receipt-transaction pairs are automatically reconciled with no manual rules required
6. **Tax Calculation** -- as expenses and income are categorised, GST and income tax obligations are recalculated in real-time
7. **Reporting** -- cash flow statements, P&L, and balance sheets update automatically

### Key Technical Details

- **No manual rules** -- unlike Xero/MYOB where users create bank rules, Luca learns from the vendor data itself
- **3.5M+ transactions categorised** -- substantial training dataset
- **60% time reduction** -- users reported 60% drop in financial admin time within first 3 months
- **6.5 hours to 30 minutes** -- weekly financial admin time reduction
- **Background operation** -- AI operates invisibly; users see results not process

### Limitations of the AI

- Categorisation accuracy is not 100%; some users report errors
- Corrections require contacting Thriday support (users cannot fix their own data easily)
- Excessive reliance on AI makes error-spotting difficult
- GST/BAS handling described as "sometimes cumbersome" by reviewers

---

## 5. Pricing Model

| Plan | Monthly | Annual | Key Features |
|------|---------|--------|--------------|
| **Free (Banking)** | $0 | $0 | Unlimited invoices, up to 10 accounts, expense tracking, receipt scanning, 3.35% interest |
| **Time-Saver** | $29.95 | $299 | + Automated budget allocation, expense reconciling, accounting + tax calculations |
| **Done-for-You Tax** | $88 | $880 | + Tax preparation, cash flow/tax planning, human accountant support |
| **Done-for-You BAS + Tax** | $119 | $1,190 | + BAS lodgement, tax lodgement, human accountant support |

### Fee Structure

| Fee | Amount |
|-----|--------|
| Monthly account fee | $0 |
| ATM withdrawals (major AU) | Free |
| Interest rate | 3.35% p.a. |
| International purchase fee | 3.5% conversion |
| International payment received | $15 per transaction |

### Target Market

- **Primary:** Sole traders and micro-businesses (0-5 employees)
- **Secondary:** Small businesses up to 50 employees
- **Top customer cohorts:** Professional services (#1), Medical/care/health sector (#2)
- **NOT currently supported:** Companies/trusts (sole traders only, company sign-up is in development with 413 votes on their roadmap)

---

## 6. Differentiation from Xero / QuickBooks / MYOB

| Dimension | Thriday | Xero / QB / MYOB |
|-----------|---------|-------------------|
| **Banking** | Built-in business bank accounts with Visa debit cards | No banking; requires separate bank + bank feed connection |
| **Automation** | AI categorises transactions automatically; no rules needed | Requires manual bank rule creation; reconciliation is semi-manual |
| **Tax** | Registered tax agent; can lodge BAS and tax returns directly | Not tax agents; data exported to accountant/tax agent |
| **All-in-one** | Banking + accounting + tax in single platform | Accounting only; banking via feeds, tax via third-party |
| **Reconciliation** | Fully automated receipt-to-transaction matching | Manual or rule-based reconciliation |
| **Setup Complexity** | Very simple; sign up, get account, start transacting | Requires bank feed setup, chart of accounts config, rule creation |
| **Target Market** | Sole traders, micro-businesses | Sole traders through large enterprises |
| **Market Position** | Emerging challenger | Market leaders (Xero: 60%+ AU market share) |
| **Ecosystem** | Limited integrations; closed platform | Vast app marketplace (1,000+ integrations) |
| **Payroll** | Not available (planned; 275 votes on roadmap) | Full payroll capabilities |
| **Multi-entity** | Sole traders only (company support in development) | Supports companies, trusts, partnerships |
| **Accountant Access** | Limited; philosophy is "you shouldn't need an accountant" | Full accountant/bookkeeper collaboration tools |

### Thriday's Key Advantages

1. Zero-friction setup -- no separate bank account, no bank feeds, no rule configuration
2. Real-time tax forecasting built into the banking experience
3. Automatic income allocation to tax/profit/opex accounts
4. Receipt scanning with automatic reconciliation
5. Interest earned on all accounts (3.35% p.a.)

### Thriday's Key Disadvantages

1. Must use Thriday's bank account (locked into their banking)
2. Sole traders only (no company/trust structures yet)
3. No payroll module
4. No time tracker
5. Limited integrations / no app marketplace
6. Cannot accept online card payments for invoices
7. Difficult to correct AI errors without contacting support
8. Data retention policy: Thriday stores data for 7 years with no option to delete
9. Very limited compared to Xero/MYOB ecosystem for growing businesses

---

## 7. Business Banking Features

### Account Structure

Thriday provides a "Profit First" style banking setup:

- **Revenue Account** -- all income lands here
- **Profit Account** -- percentage automatically allocated
- **Owner's Pay Account** -- percentage automatically allocated
- **Tax Account** -- percentage automatically allocated
- **OpEx Account** -- percentage automatically allocated
- Up to **10 total accounts** with custom names and allocation percentages

### Banking Provider

- Accounts issued by **Regional Australia Bank Ltd** (ABN 21 087 650 360, AFSL/Australian Credit Licence 241167)
- Thriday operates as an **Authorised Representative** (No. 1297601)

### Cards

- Visa Debit cards (physical and virtual)
- Up to 4 cards per bank account
- Apple Pay and Google Wallet support
- Card controls (lock/unlock, spending limits)

### Payments

- Bank transfers
- BPAY
- Bill scanning and scheduled payments
- PayTo (completed)
- PayID (in planning, 31 votes)
- Osko payments (in planning, 189 votes)

---

## 8. API and Integration Capabilities

### Current Integrations

Thriday operates as a relatively **closed platform** compared to Xero/MYOB:

| Integration | Type | Details |
|-------------|------|---------|
| **NAB Bookkeeper** | White-label partnership | Thriday's engine powers NAB's bookkeeping product |
| **Space Invoices** | API integration | White-label invoicing infrastructure |
| **ATO** | Direct filing | BAS and tax return lodgement |
| **Visa** | Card network | Debit card issuance |
| **Regional Australia Bank** | Banking partner | Account provision and AFSL |

### API Availability

- **No public API** is documented or advertised
- Thriday's partnership model is B2B white-label (e.g., NAB Bookkeeper) rather than developer API access
- The platform does not appear to offer webhooks, REST APIs, or integration marketplace
- RCTI (Recipient Created Tax Invoice) capability mentioned in the Trilogy Care pitch deck -- invoices can be issued to Thriday accounts

### What This Means

For integration purposes, Thriday appears to operate as a **closed ecosystem**. Connecting to it would likely require a partnership arrangement (as proposed to Trilogy Care) rather than API integration. This is a significant architectural difference from Xero or MYOB, which offer extensive APIs and app marketplaces.

---

## 9. Reviews and User Feedback

### Quantitative Metrics (from Thriday's pitch deck and website)

| Metric | Score |
|--------|-------|
| **Google Reviews** | 4.9 stars (180+ reviews) |
| **Net Promoter Score (NPS)** | +62.7 |
| **Customer Effort Score (CES)** | 4.5 |
| **Product-Market Fit (PMF)** | 58% (from 1,309 responses: 58% "very disappointed" if unavailable) |

### Positive User Feedback Themes

> "Seriously, what a game changer! A significant time saver having all my financial and tax requirements at my fingertips." -- Google Review

> "Just moved from using Xero - things got so much simpler, especially as using the Profit First method got so much easier." -- Google Review

> "The platform is so intuitive and easy to use and has been a complete game-changer for managing my finances as a sole trader." -- Google Review

> "Really enjoying the simplicity and ease of use. It's also great to handle bookkeeping within a banking app - saves lots of time." -- Google Review

**Common praise:**
- Ease of setup and use
- Automatic income allocation (Profit First method)
- Time savings on financial admin
- All-in-one simplicity vs. juggling multiple tools
- Automatic tax calculations give peace of mind

### Negative User Feedback Themes

**Common criticism:**
- Must switch to Thriday's bank account (locked in)
- AI categorisation not always accurate; corrections are difficult
- Sole trader only -- no support for companies/trusts
- No payroll module
- No time tracking
- Cannot accept online card payments for invoices
- Limited mobile app functionality
- Difficult to get support as business grows
- Data retention: 7 years, no deletion option
- GST/BAS handling sometimes cumbersome

### Awards

- FinTech Awards Winner 2023
- FinTech Awards Winner 2024
- Finnies Finalist 2023
- Finnies Finalist 2024

---

## 10. Automated Reconciliation Deep-Dive

### The Reconciliation Flow

```
INCOME RECONCILIATION:
Invoice Sent --> Customer Pays --> Payment Hits Thriday Account
                                         |
                                    Luca AI matches payment to invoice
                                         |
                                    Invoice marked as "Paid"
                                         |
                                    Income categorised automatically
                                         |
                                    Tax obligations recalculated


EXPENSE RECONCILIATION:
Card Payment / Bill Payment --> Transaction Recorded
                                      |
                            Luca AI categorises by vendor/merchant
                                      |
                            User Scans Receipt (optional)
                                      |
                            Computer Vision extracts receipt data
                                      |
                            Receipt matched to transaction
                                      |
                            Reconciled -- GST extracted, deductions identified
                                      |
                            Tax forecast updated in real-time
```

### What Makes It Different

1. **No bank feed lag** -- because Thriday IS the bank, transactions appear instantly (not 24-48 hour feed delay)
2. **No manual rules** -- ML models categorise based on vendor data, not user-created rules
3. **Receipt auto-match** -- computer vision matches receipts to transactions without user intervention
4. **Real-time tax impact** -- every reconciled transaction immediately updates tax forecasts
5. **Proactive notifications** -- "10 new receipts reconciled... saving you $224.50 at tax time"

### Reconciliation Statistics (from pitch deck)

- Users reported **60% drop** in time spent on reconciliation, bill payment, and invoice chasing in the first 3 months
- Average SME goes from **6.5 hours/week** to **under 30 minutes/week** on financial admin

---

## 11. Trilogy Care Partnership Proposal (from PDF)

The file `/Users/williamwhitelaw/Herd/financial-ledger/Thriday-Trilogy_Care[50046].pdf` is a 13-slide commercial-in-confidence pitch deck from Thriday to Trilogy Care (2024).

### Proposal Summary

Thriday proposed integrating "business-in-a-box" capabilities into Trilogy Care's **contractor workflow** to streamline admin for contractors working with Trilogy Care.

### Proposed Contractor Flywheel

1. **RCTI invoices are issued to Thriday** -- Trilogy Care issues RCTIs to contractors' Thriday accounts
2. **Income is reconciled automatically** -- Luca categorises and allocates income
3. **Contractors earn interest on savings** -- 3.35% p.a.
4. **Contractors can spend money** -- Visa Debit card for business expenses
5. **Track cash flow and tax** -- real-time financial visibility
6. **Taxes are calculated and sorted** -- BAS and tax return lodgement

### Key Value Propositions for Trilogy Care

| Value | Description |
|-------|-------------|
| **INNOVATE** | AI automates banking, accounting, and tax for contractors |
| **ENGAGE** | Deliver value-added services that make a difference to contractors |
| **GROW** | Embedded solution can deliver new revenue streams |
| **INSIGHTS** | Customer insights including assets, cash flow, and tax positions |

### Relevance to Trilogy Care

- Thriday's **second-largest customer cohort** is the medical/care/health sector
- Contractors could sign up for Thriday, receive RCTIs from Trilogy Care, and have their financial admin fully automated
- This would reduce contractor friction and potentially improve retention

---

## 12. Tyro Acquisition (December 2025)

### Deal Overview

| Detail | Information |
|--------|-------------|
| **Acquirer** | Tyro Payments Ltd (ASX: TYR) |
| **Target** | Thriday |
| **Announced** | 15 December 2025 |
| **Completed** | January 2026 |
| **Price** | Undisclosed |
| **Team** | Majority of Thriday staff, including CEO Michael Nuciforo, joined Tyro |

### Strategic Rationale

- Tyro serves 76,000+ merchants across Australia with payment solutions
- Combining Thriday's banking/accounting/tax automation with Tyro's payment infrastructure
- Creates a more complete "financial operating system" for SMEs
- Accelerates development of integrated cash-flow management tools
- Reduces back-office tasks for Tyro's business customers

### Implications

- Thriday's technology will likely be integrated into or alongside Tyro's merchant platform
- The NAB Bookkeeper partnership may be affected (NAB transitioned branding)
- Future product direction is now under Tyro's strategic control
- This could expand Thriday's capabilities to include point-of-sale payments (Tyro's strength)

---

## Feature Roadmap (as of March 2026)

### In Development

| Feature | Community Votes |
|---------|----------------|
| Company sign-up (non-sole-trader) | 413 |
| Invoice reference numbers | 246 |
| Recurring invoices | 186 |
| Custom invoice fields | 53 |
| Custom invoice numbers | 35 |
| Tap to pay (contactless) | 19 |
| In-app card provisioning | 40 |

### In Planning

| Feature | Community Votes |
|---------|----------------|
| Payroll | 275 |
| Osko payments | 189 |
| Trip tracker | 131 |
| AI assistant (Co-pilot) | 58 |
| Tax audit insurance | 47 |
| Push notifications | 41 |
| PayID | 31 |
| Locked accounts | 22 |
| Time tracker | 17 |

---

## Synthesis

### Key Takeaways

1. **Thriday is genuinely innovative** in combining banking, accounting, and tax into a single AI-powered platform. No other Australian product does this natively.

2. **The AI approach is pragmatic** -- background ML categorisation rather than flashy chatbots. Their engine "Luca" processes transactions, receipts, and invoices silently and delivers results.

3. **The closed-ecosystem trade-off is real** -- by owning the banking layer, Thriday eliminates bank-feed lag and enables instant reconciliation, but this locks users into their banking platform.

4. **The Tyro acquisition changes the trajectory** -- Thriday is no longer independent. Its future direction is now tied to Tyro's merchant-focused strategy, which may or may not align with previous partnership proposals (like the Trilogy Care pitch).

5. **Sole trader limitation is significant** -- the platform does not yet support companies, trusts, or partnerships, though company sign-up is the most-voted feature on their roadmap (413 votes).

6. **The tech stack is solid and modern** -- Azure serverless, event-driven architecture, ML-powered categorisation, and plans for generative AI integration. The Microsoft partnership provides enterprise-grade infrastructure.

7. **The Trilogy Care pitch is directly relevant** -- Thriday specifically proposed a contractor financial management solution for Trilogy Care's workforce, which could automate RCTI processing, expense tracking, and tax lodgement for contractors.

### Open Questions

1. [ ] Post-Tyro acquisition: Is the Trilogy Care partnership proposal still viable?
2. [ ] How does the Tyro acquisition affect Thriday's white-label / partnership model?
3. [ ] What is Thriday's API capability for RCTI integration with Trilogy Care's portal?
4. [ ] Timeline for company structure support (currently sole trader only)?
5. [ ] How would contractor onboarding work in practice?
6. [ ] What are the data sharing / privacy implications of contractors using Thriday?
7. [ ] Does the "insights" value proposition (sharing contractor financial data with Trilogy Care) raise privacy concerns?

### Competitive Landscape Summary

| Platform | Type | AI | Banking | Tax Agent | Target |
|----------|------|----|---------|-----------| -------|
| **Thriday** | All-in-one | Strong (Luca) | Built-in | Yes | Sole traders |
| **Xero** | Accounting | Basic (rules) | Via feeds | No | All businesses |
| **MYOB** | Accounting | Basic | Via feeds | No | AU/NZ businesses |
| **QuickBooks** | Accounting | Moderate | Via feeds | No | All businesses |
| **MYOB Solo** | Simplified | Basic | Via feeds | No | Sole traders |
| **Hnry** | Tax + Pay | Moderate | Via feeds | Yes | Contractors |
| **Rounded** | Invoicing | Basic | No | No | Freelancers |

---

## Recommended Next Steps

- **Evaluate post-acquisition viability** -- contact Thriday/Tyro to understand if the Trilogy Care partnership proposal is still on the table
- **Assess contractor needs** -- determine if Trilogy Care's contractor workforce would benefit from Thriday's automated financial management
- **Compare with alternatives** -- evaluate Hnry (contractor-focused) and MYOB Solo as alternatives
- **Consider integration architecture** -- if pursuing, understand how RCTI issuance would flow from TC Portal to Thriday
- **Review privacy implications** -- the "Insights" value proposition involves sharing contractor financial data back to Trilogy Care

---

*Research compiled: 2026-03-01*
*Sources: Web search, Thriday website, Thriday-Trilogy Care pitch deck (PDF), Microsoft case studies, industry reviews*
