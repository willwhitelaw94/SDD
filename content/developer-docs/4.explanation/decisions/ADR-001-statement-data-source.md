---
title: "ADR-001: Statement Data Source"
description: "Architecture decision for choosing the data source for recipient statements"
---

| Status | Date | Lead | Decision |
|--------|------|------|----------|
| **Proposed** | 2026-01-23 | Lachlan Dennis | Will Whitelaw |

---

## Current State of Affairs

### Timeline

| Month | Status |
|-------|--------|
| Oct 2025 | Statements generated and available in Portal. Hard copies posted. |
| Nov 2025 | Delayed/Blocked — waiting on SA claim receipt before generation |
| Dec 2025 | Delayed/Blocked |

### What's Blocked

- **Nov/Dec/Jan statements** — Can't generate until data source decision made
- **Care Coordinator statements** — Hidden (TP-3923) due to incorrect fee calculations
- **SERG/SERT/SERV classifications** — Unreliable from GL data, recommended to hide

### Key Blocker (Jan 12-13, 2026)

> "What are we putting in the statements... for NOV statement how are we filtering down to the funding consumptions" — Lachlan Dennis

**Translation:** Code is ready, but we need to decide:
- **Data source:** GL transactions or Portal consumptions?
- **Period filter:** How do we determine which items belong to which statement month?

---

## Related Tickets

| Ticket | Summary | Status |
|--------|---------|--------|
| TP-3291 | Statements Epic - Digitalising this experience inline with Budgets | In Progress |
| TP-3923 | Hide CC Statements (fees wrong) | Peer Review |
| TP-3836 | 2026 recipient design uplift | Backlog |

---

## Part 1: Business Decision

### The Problem

#### 1. Bill Sync Doesn't Update Categories

**The sync problem:** When a Bill is created, each BillItem syncs 1:1 to a MYOB Transaction line. But when we correct the category during claiming (e.g., change SERG/co-contribution), the MYOB transaction line is NOT updated. The correction only exists in the Portal consumption record.

**Result:** Statement pulls from MYOB transactions → shows original (wrong) categories.

#### 2. Finance Adjustments (MYOB-only, no Portal record)

**The adjustments problem:** Finance team creates journals/adjustments in MYOB based on:
- SA claim file responses (corrections, rejections)
- Manual period-end adjustments
- Other provider claims

These create MYOB transactions 1:1, but never flow back to Portal. Portal has no record of these adjustments.

**Result:**
- Statement (from MYOB) includes adjustments
- Portal budget/consumption views don't include them
- Can't reconcile Portal to Statement

### Summary

| Issue | Impact |
|-------|--------|
| Bill sync doesn't update categories | MYOB transactions have original values; Portal consumptions have corrected values |
| Finance adjustments MYOB-only | Journals created from claim file don't create Portal consumption records |
| Government mismatch | Statements don't match what SA has on record |

---

## Options

### Option A: Keep Transactions Table (Hide Classifications)

Continue using transactions table but hide SERG/co-contribution breakdowns on statements.

**Approach:**
- Keep current data source (transactions table)
- During bulk invoice reclassification, if SERG was changed, the funding stream may have been updated in transactions
- Will require us to manually reconcile the transactions table with Consumptions so Funding Stream Balances and Statements are in sync
- Show only total amounts per line item

| Pros | Cons |
|------|------|
| No migration needed | Can't show funding stream breakdown |
| Adjustments already in MYOB are included | Recipients see less detail |
| Quick to implement | Doesn't solve underlying data integrity issue |
| Finance workflow unchanged | Portal and Statement may still diverge |

---

### Option B: Consumptions Table + Sync Adjustments INTO Portal

Use `budget_plan_item_funding_consumptions` as data source, and create consumption records for MYOB adjustments so Portal is complete.

**Approach:**
- Switch to consumptions table for accurate SA-reconciled categories
- MYOB adjustments (journals from claim file) get synced INTO Portal as consumption records
- Add `source` field to track where consumption came from
- Finance workflow stays similar but adjustments flow back to Portal

| Pros | Cons |
|------|------|
| Accurate funding stream breakdown | Need to build adjustment sync |
| Matches government records 1:1 | Schema change (add source field) |
| Existing MYOB adjustments can be captured | Backfill existing adjustments |
| Finance workflow mostly unchanged | Two-way sync complexity |
| Portal becomes source of truth | |

**New field on consumptions:**

```
source: 'bill_item' | 'myob_adjustment' | 'claim_correction' | 'manual'
```

---

### Option C: Get Classifications Right BEFORE Posting to GL

Use `budget_plan_item_funding_consumptions` as data source, and ensure classifications are correct before invoice is posted to MYOB.

**Key constraint:** Can't update GL transaction lines after posting — would require reversing entries. So we must get it right before the GL is recorded.

**Approach:**
- Claiming/reconciliation happens BEFORE bill is synced to MYOB
- Classifications are finalised in Portal first
- Only then does bill sync to MYOB with correct categories
- No reversals needed because GL is recorded correctly from the start

| Pros | Cons |
|------|------|
| GL is correct from the start | Requires process change (claim before post) |
| No reversal entries needed | Historical data still wrong |
| Both tables accurate going forward | May delay bill posting |
| Finance gets clean data | Need to handle timing of claims |
| Future-proof | |

**Note:** Currently bills may be posted to MYOB before claiming is complete. This option requires claiming/reconciliation to happen first.

---

## Recommendation

### Option B

Since the Transaction table can't be edited and we need to reconcile the Funding Stream Consumptions with the Statement, we may as well make sure consumptions table has everything that is a consumption.

**Rationale:**
- Portal becomes the source of truth
- Statements match what recipients see in Portal
- Finance adjustments are captured and visible
- Enables accurate funding stream breakdown

---

## Statement Period

| Current | Proposed |
|---------|----------|
| MYOB `post_period` with 6-month offset calculation | `payment_period` from daily payrun paid date |

---

## Proposed Statement Design

**Principle:** Statement = Portal Funding Streams View (for a period)

The statement should be a point-in-time snapshot of what the recipient sees in Portal's funding streams UI. Same data, same groupings, same totals.

Same consumptions, filtered by period.
