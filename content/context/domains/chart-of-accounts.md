---
title: "MYOB Chart of Accounts (GL Codes)"
description: "General Ledger account codes as configured in MYOB, including account class, type, and description."
---

Last updated: 2026-03-06

## Assets

| Account | Class | Description | Active | Post Option | Cash Account |
|---------|-------|-------------|--------|-------------|--------------|
| 1000 | CASHASSET | Cash at Bank #7750 | Yes | Detail | Yes |
| 1002 | CASHASSET | NAB Savings #0381 | No | Summary | No |
| 1010 | CASHASSET | Ezy Collect Clearing Account | Yes | Detail | Yes |
| 1020 | CASHASSET | Incoming payment Clearing Account | Yes | Detail | Yes |
| 1030 | CASHASSET | Customer Contra Clearing Account | Yes | Detail | Yes |
| 1111 | DEPOSIT | Clearing: Monthly Claims | Yes | Detail | Yes |
| 1121 | DEPOSIT | Cash In Transit Clearing Account | Yes | Detail | No |
| 1122 | DEPOSIT | Clearing: Monthly Claims (Old- DNU) | No | Summary | No |
| 1200 | AR | Claim Receivable-Inactive | No | Summary | No |
| 1210 | AR | Client Contributions Receivable | Yes | Summary | No |
| 1211 | AR | Provision for Doubtful Debts | No | Summary | No |
| 1300 | WAREHOUSE | Inventory | No | Summary | No |
| 1410 | OTHERCURAS | Care management Pool-GC Held | Yes | Detail | No |
| 1420 | OTHERCURAS | Restorative care pathway-GC Held | Yes | Detail | No |
| 1430 | OTHERCURAS | End of life pathway-GC Held | Yes | Detail | No |
| 1440 | OTHERCURAS | Assistive technology-AT-GC Held | Yes | Detail | No |
| 1450 | OTHERCURAS | Assistive tech-Specified Needs-GC Held | Yes | Detail | No |
| 1460 | OTHERCURAS | Home modifications-HM- GC Held | Yes | Detail | No |
| 1490 | OTHERCURAS | S@H Quarterly Budget-GC Held | Yes | Detail | No |
| 1510 | OTHERCURAS | GST Paid on Client Expenses | Yes | Summary | No |
| 1700 | WIP | Work In-Progress | No | Summary | No |
| 1800 | WAREHOUSE | Standard Cost Variance | No | Summary | No |
| 1900 | FIXEDASSET | FA Accrual | No | Summary | No |
| 2530 | AP | Supplier Payments in Dispute | Yes | Detail | No |
| 4000 | OTHERCURAS | Sales | No | Summary | No |
| 9405 | OTHERCURAS | Claim Receivable | Yes | Summary | No |
| 9406 | OTHERCURAS | Unspent Funds (old) | No | Summary | No |
| 9407 | OTHERCURAS | Monthly Claim Receivable (old) | No | Summary | No |
| 9705 | RELCURAS | Accounts Receivable XERO | No | Summary | No |
| 9899 | AR | Rejected Claim Pending SA Refund | Yes | Detail | No |
| 9999 | AR | Government Held Accounts | Yes | Detail | No |

## Liabilities

| Account | Class | Description | Active | Post Option |
|---------|-------|-------------|--------|-------------|
| 1500 | AP | Accounts Payable | Yes | Summary |
| 1600 | OTHCURLIAB | PO Accrual | No | Summary |
| 2200 | TAXESPAY | GST Collected | Yes | Summary |
| 2300 | TAXESPAY | GST Output Tax Adjustments | No | Summary |
| 2400 | TAXESPAY | GST Paid | Yes | Summary |
| 2410 | OTHCURLIAB | Care management Pool | Yes | Detail |
| 2420 | OTHCURLIAB | Restorative care pathway | Yes | Detail |
| 2430 | OTHCURLIAB | End of life pathway | Yes | Detail |
| 2440 | OTHCURLIAB | Assistive technology-AT | Yes | Detail |
| 2450 | OTHCURLIAB | Assistive tech-Specified Needs | Yes | Detail |
| 2460 | OTHCURLIAB | Home modifications-HM | Yes | Detail |
| 2470 | OTHCURLIAB | Commonwealth unspent TC Held | Yes | Detail |
| 2480 | OTHCURLIAB | Voluntary contributions | Yes | Detail |
| 2490 | OTHCURLIAB | S@H Quarterly Budget | Yes | Detail |
| 2500 | TAXESPAY | GST Input Tax Adjustments | No | Detail |
| 2510 | AP | Supplier Over/Double Payment | No | Detail |
| 2520 | AP | Supplier Payments Bounced | Yes | Summary |
| 2540 | AP | AP Suspense Account | Yes | Detail |
| 3800 | RETEARN | Retained Earnings | No | Summary |
| 3900 | NETINCOME | YTD Net Income | No | Summary |
| 8530 | STLOANS | NAB Trade Finance | No | Detail |
| 9050 | TCCORP | Corp - Trilogy Care Loan (Cash) | No | Detail |
| 905A | TCCORP | Corp - NAB Trade Finance | Yes | Detail |
| 905B | TCCORP | Corp - Shareholders | Yes | Detail |
| 905C | TCCORP | Corp - Debtor (PMF) Clearance | Yes | Detail |
| 905D | TCCORP | Corp - Monthly Jnls | Yes | Detail |
| 905E | TCCORP | Corp - Expenses | Yes | Detail |
| 905F | TCCORP | Corp - GST | Yes | Detail |
| 905G | TCCORP | Corp - Other | Yes | Detail |
| 9200 | OTHCURLIAB | Other Deposits (to sort) | No | Summary |
| 9700 | OBXERO | Accounts Payable XERO | No | Summary |
| 9710 | OBXERO | Accounts Payable (XERO Ledger) | No | Summary |
| 9715 | OBXERO | XERO Ledger Offsets | No | Summary |
| 9750 | OTHCURLIAB | Savvy Care Pty Ltd | No | Summary |
| 9799 | OBXERO | Opening Balances Contra | No | Summary |
| 9805 | OTHCURLIAB | Services Australia Funds to return | No | Summary |
| 9810 | AP | Consumer Held Funds | No | Summary |
| 9898 | AP | Terminating Client Balances | Yes | Detail |
| 9978 | OTHCURLIAB | Provision for Consumer Write off | Yes | Summary |
| 9998 | AP | Client Balance | Yes | Detail |

## Income

| Account | Class | Description | Active | Post Option |
|---------|-------|-------------|--------|-------------|
| 4100 | SALES | Care Management- General | Yes | Detail |
| 4110 | SALES | Care Management- EOL | Yes | Summary |
| 4120 | SALES | Care Management- RC | Yes | Summary |
| 4200 | SALES | Platform Fee- Quarterly Care Budget | Yes | Detail |
| 4300 | SALES | Care Coordination Fee Collected | Yes | Detail |
| 4400 | SALES | Platform Fee- AT-HM | Yes | Detail |
| 4500 | SALES | Platform Fee - End of Life Pathway (EOLP) | Yes | Detail |
| 4600 | SALES | Platform Fee -Restorative Care Pathway (RCP) | Yes | Detail |
| 4700 | SALES | Platform Fee -HCP Unspent Fund | Yes | Detail |

## Expenses

| Account | Class | Description | Active | Post Option |
|---------|-------|-------------|--------|-------------|
| 5000 | COGS | Cost of Goods Sold | No | Summary |
| 5100 | COGS | Care Coordination Fee Paid | Yes | Detail |
| 5200 | COGS | Purchase Price Variance | No | Summary |
| 6110 | EXOTHER | Collection Fees Account | Yes | Summary |
| 6200 | EXOTHER | Co- Contribution Bad Debts | Yes | Summary |
| 6300 | EXOTHER | Unrecoverable Client Exp.-Care | Yes | Summary |
| 6400 | EXOTHER | Unrecoverable Client Exp.-Accounts | Yes | Summary |
| 6500 | EXOTHER | Unrecoverable Client Exp.-Q&A | Yes | Summary |
| 6600 | EXOTHER | Unrecoverable Client Exp.-Compliance | Yes | Summary |
| 6700 | EXOTHER | Unrecoverable Client Exp.-BD | Yes | Summary |
| 6800 | EXOTHER | Unrecoverable Client Exp.-IT&DEV | Yes | Summary |
| 6900 | EXOTHER | Unrecoverable Client Exp.- General | Yes | Summary |
| 9101 | EXOTHER | Adjustments and Rounding | Yes | Detail |
| 9102 | EXOTHER | HCP ITF Bad Debts Written Off | Yes | Summary |
| 9103 | EXBANK | Bank Fees | Yes | Summary |
| 9104 | EXOTHER | Other Corporate Expenses | Yes | Summary |

## Account Class Reference

| Class Code | Description |
|------------|-------------|
| AR | Accounts Receivable |
| AP | Accounts Payable |
| CASHASSET | Cash & Cash Equivalents |
| DEPOSIT | Deposits/Clearing |
| OTHERCURAS | Other Current Assets |
| RELCURAS | Related Party Current Assets |
| WAREHOUSE | Inventory/Warehouse |
| WIP | Work In Progress |
| FIXEDASSET | Fixed Assets |
| STLOANS | Short-Term Loans |
| OTHCURLIAB | Other Current Liabilities |
| TAXESPAY | Taxes Payable |
| RETEARN | Retained Earnings |
| NETINCOME | Net Income (YTD) |
| TCCORP | Trilogy Care Corporate Intercompany |
| OBXERO | Opening Balances (XERO migration) |
| SALES | Sales/Revenue |
| COGS | Cost of Goods Sold |
| EXOTHER | Other Expenses |
| EXBANK | Bank Expenses |
