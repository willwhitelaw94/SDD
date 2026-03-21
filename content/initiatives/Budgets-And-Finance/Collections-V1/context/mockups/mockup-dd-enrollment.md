---
title: "Mockup: Direct Debit Enrollment Flow"
---


**Created**: 2025-12-23
**Status**: Approved

## Overview

Multi-step modal for setting up Direct Debit with optional monthly limit.

## Flow Summary

| Step | Name | Purpose |
|------|------|---------|
| 1 | Bank Account Details | BSB, Account Number, Account Name |
| 2 | Monthly Limit | Optional cashflow management |
| 3 | Review & Sign | Summary + Australian DD agreement |
| - | Success | Confirmation |

## Step 1: Bank Account Details

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Set Up Direct Debit                                           Step 1/3 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Enter your bank account details                                        │
│                                                                         │
│  BSB                                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 062-000                                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  Commonwealth Bank of Australia                                         │
│                                                                         │
│  Account Number                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 12345678                                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Account Name                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ John Doe                                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                                                                         │
│  [Cancel]                                              [Continue →]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Design Notes - Step 1

- BSB validates on blur (6-digit format)
- Bank name displays automatically after valid BSB
- Account Number: 6-9 digits
- Account Name: Must match bank records

## Step 2: Monthly Limit (Optional)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Set Up Direct Debit                                           Step 2/3 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Set a monthly debit limit (optional)                                   │
│                                                                         │
│  This helps you manage cashflow. If an invoice exceeds your limit,     │
│  you'll be notified to arrange alternative payment.                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ○ No limit - debit full invoice amount each month               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ● Set a monthly limit                                           │   │
│  │                                                                  │   │
│  │   Maximum monthly debit: $ [500.00        ]                     │   │
│  │                                                                  │   │
│  │   Your average invoice is $385/month                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                                                                         │
│  [← Back]                                              [Continue →]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Design Notes - Step 2

- Default selection: "No limit"
- Shows average invoice amount as guidance
- Limit applies per calendar month
- If invoice exceeds limit: notification sent, manual payment required

## Step 3: Review & Sign Agreement

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Set Up Direct Debit                                           Step 3/3 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Review and sign your Direct Debit agreement                            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Account:     ••••••5678 (Commonwealth Bank)                     │   │
│  │ Name:        John Doe                                           │   │
│  │ Limit:       $500.00/month                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ DIRECT DEBIT REQUEST SERVICE AGREEMENT                          │   │
│  │                                                                  │   │
│  │ This is your Direct Debit Service Agreement with Trilogy Care   │   │
│  │ Pty Ltd (ACN XXX XXX XXX), User ID XXXXXX.                      │   │
│  │                                                                  │   │
│  │ By signing this agreement, you authorise us to debit your       │   │
│  │ account for contribution invoices as they become due...         │   │
│  │                                                                  │   │
│  │ [Scroll for full terms]                              ▼          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ☐ I have read and agree to the Direct Debit Service Agreement         │
│                                                                         │
│  [← Back]                                    [Sign & Submit Agreement] │
└─────────────────────────────────────────────────────────────────────────┘
```

### Design Notes - Step 3

- Account details masked (last 4 digits only)
- Agreement text in scrollable container
- Checkbox required before submit enabled
- Agreement complies with Australian DD requirements

## Success State

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           ✓                                             │
│                                                                         │
│              Direct Debit Set Up Successfully                           │
│                                                                         │
│  Your contributions will be automatically debited from your account    │
│  ending in ••••5678. Your first debit will occur on 28 Dec 2024.      │
│                                                                         │
│                                                                         │
│                          [Done]                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## DD Mandate States

| State | Description | UI Treatment |
|-------|-------------|--------------|
| Pending | Submitted, awaiting processing | Yellow/info banner |
| Active | Mandate confirmed and active | Green success banner |
| Cancelled | User cancelled via finance | Grey, option to re-enroll |

## Australian DD Compliance

The agreement must include:
- Trilogy Care Pty Ltd details (ACN, User ID)
- Debit arrangements (timing, frequency)
- Customer rights (disputes, cancellation)
- Privacy statement
- Contact details for queries

## Notes

- DD cancellation is out of scope for V1 (contact finance)
- Editing DD details requires cancel and re-enroll
- Account number stored encrypted
- Consent timestamp and reference logged for audit
