---
title: "MYOB Acumatica"
description: "Single accounting system - see MYOB Integration"
---

> MYOB Acumatica IS the MYOB integration - they are the same system

---

## TL;DR

- **What**: MYOB Acumatica is the underlying accounting system that the "MYOB" integration connects to
- **Note**: There is NOT a separate MYOB vs MYOB Acumatica integration - it's ONE system
- **See**: [MYOB Integration](./myob.md) for full documentation

---

## Clarification

Despite having separate documentation files historically, **MYOB Acumatica and MYOB are the same integration**:

| Aspect | Reality |
|--------|---------|
| **API Endpoint** | Single MYOB Acumatica API |
| **Service Class** | One `MyobService.php` |
| **Configuration** | One `config/myob.php` |
| **Code Location** | `domain/Myob/` |

---

## Use Cases Within the Same System

The integration handles two major use cases:

### 1. Bill/Payables (Established)

**Location**: `domain/Myob/`

- Bill creation and sync
- Vendor management
- Transaction exports

### 2. AR Invoice/Collections (Newer)

**Location**: `domain/Contribution/`

- AR invoice sync via webhook
- Contribution tracking
- Event-sourced lifecycle

Both use the same underlying `MyobService.php` and connect to the same Acumatica instance.

---

## Technical Details

See [MYOB Integration](./myob.md) for:
- Full domain structure
- Jobs and actions
- Database tables
- Configuration

---

## Status

**Maturity**: Production (same as MYOB)
**Pod**: Finance
