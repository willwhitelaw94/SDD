---
title: "NAB Connect"
description: "Banking integration placeholder - not currently implemented"
---

> Banking integration (not currently implemented in codebase)

---

## TL;DR

- **What**: Placeholder for banking integration
- **Who**: N/A
- **Watch out**: NO NAB Connect code exists in the codebase

---

## Open Questions

| Question | Context |
|----------|---------|
| **Does NAB Connect integration exist?** | NO - no ABA file generation, no direct debit, no NAB API calls |
| **What "banking integration" exists?** | Only Services Australia Payment Statement API for government payments |

---

## What's Actually Implemented

### NO NAB Connect Integration ❌

The codebase does **NOT** contain:
- NAB-specific payment gateway code
- ABA file generation
- Direct debit / BECS integration
- NAB banking API calls
- Payment batch processing for bank transfers

### What DOES Exist: Services Australia Payment Statements

The only "payment" integration is for government payments, not banking:

**Location**: `app-modules/aged-care-api/`

| Component | File |
|-----------|------|
| Model | `app/Models/PaymentStatementDownload.php` |
| Job | `PaymentStatementDownloadJob.php` |
| Job | `PaymentStatementFileDownloadJob.php` |
| Controller | `PaymentStatementController.php` |

This retrieves payment statement data from Services Australia's aged care system, **not** NAB banking.

---

## If NAB Integration Is Needed

Future implementation would require:
1. NAB API credentials and access
2. ABA file generation for batch payments
3. Direct Debit Request (DDR) form handling
4. BECS (Bulk Electronic Clearing System) integration
5. Payment reconciliation workflows

---

## Related

- [Services Australia API](./services-australia-api.md) - Government payment data
- [MYOB Integration](./myob.md) - Accounting system integration

---

## Status

**Maturity**: Placeholder (not implemented)
**Pod**: Finance
