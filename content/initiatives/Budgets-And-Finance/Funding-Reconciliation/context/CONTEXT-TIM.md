---
title: "Context (Tim): Technical Discovery - Funding Reconciliation & Refunds"
---

**Epic**: FRR
**Created**: 2026-02-11
**Last Updated**: 2026-02-11

---

## Discovery Session - 2026-02-11

### Problem Origin

Raised through multiple DMs to Matthew, Rudy, and Tim from finance and operations staff encountering blocked budgets after MYOB refunds.

### Technical Investigation

Deep codebase exploration was performed to understand the current billing, funding, and reconciliation architecture before proposing solutions.

---

## Current Architecture (Key Findings)

### Billing Flow

Portal uses **event sourcing** (Spatie) for all bill state changes via `BillAggregateRoot`.

**Bill Lifecycle**: `DRAFT` > `SUBMITTED` > `IN_REVIEW` > `APPROVED` > `PAYING` > `PAID`

- Funding consumption happens at **APPROVED** stage (not payment)
- `BillItemApprovedEvent` triggers `FundingConsumptionProjector` which increments `total_internal_used_amount` on `Funding`
- `UnapproveBill` can reverse consumption but only works **before MYOB sync**
- Once `PAYING` or `PAID`, there is no return path

**Key Files:**
- `domain/Bill/Actions/ApproveBill.php` — approval + consumption creation
- `domain/Bill/Actions/UnapproveBill.php` — reversal (pre-payment only)
- `domain/Bill/Actions/MarkBillAsPaid.php` — polls MYOB for Closed status
- `domain/Funding/EventSourcing/Projectors/FundingConsumptionProjector.php` — handles all consumption increments/decrements
- `app/Enums/Bill/BillStageEnum.php` — status lifecycle

### Funding & Budget System

**Available amount calculation** (`Funding.php`):
```
availableAmount = services_australia_total_amount - usedAmount()
usedAmount = total_internal_used_amount + other_providers_used_amount
```

**Consumption records**: `BudgetPlanItemFundingConsumption` tracks per-bill-item funding usage with:
- `services_amount`, `fees_amount`, `total_amount`
- `funding_id` (which funding stream)
- `status` (PORTAL_CORRECTED or SA_RECONCILED)

**Key Files:**
- `domain/Funding/Models/Funding.php` — funding balance calculations
- `domain/Budget/Models/BudgetPlanItemFundingConsumption.php` — consumption records
- `domain/Funding/Actions/GetAvailableFundings.php` — available funding query
- `app/Actions/Bill/CheckHasEnoughFundingsForBill.php` — budget check on approval

### MYOB Integration

One-way push: Portal syncs bills TO MYOB via `SyncBillToMyobJob`. Portal polls MYOB for payment status. **No inbound sync of refunds/credit notes from MYOB.**

**Key Files:**
- `domain/Myob/Jobs/SyncBillToMyobJob.php` — outbound bill sync
- `domain/Myob/Services/MyobService.php` — MYOB API client

### Services Australia Reconciliation

Reconciliation exists and can adjust Portal amounts, but operates on SA's timeline.

**Process:**
1. SA claims synced via `SyncClaimsFromServicesAustralia`
2. Invoice items stored with `external_reference_id = "BI-{consumption_id}"`
3. `ReconcileServicesAustraliaFundings` matches SA items back to Portal consumptions
4. `FundingConsumptionProjector::onFundingConsumptionsReconciledEvent` updates amounts and recalculates `total_internal_used_amount`

**SA API capability** (aged-care-api module via Saloon HTTP):
- Read claims, invoices, budgets
- Submit new claims/invoices
- Update/delete draft invoice items
- **No endpoint to adjust SA used amounts or reverse claims**

**Key Files:**
- `domain/Funding/Actions/ReconcileServicesAustraliaFundings.php` — reconciliation orchestrator
- `domain/ServicesAustralia/Invoice/Models/ServicesAustraliaInvoiceItem.php` — SA invoice items
- `app-modules/aged-care-api/` — SA API connectors

### SAH Claim Submission (Current State)

There is **no automated consumption-to-invoice pipeline** for Support at Home. The legacy `ClaimCsvSubmissionJob` is HCP-era. SAH claims are currently:
1. Invoice created manually via SA API proxy
2. Items added with service details
3. Invoice submitted, then claim submitted
4. SA auto-aggregates submitted invoices into claims

---

## Architecture Decisions

### 1. Net Refunds Against Next Claim (Not Reversal Claims)

Since SA has no API to reverse claims or adjust used amounts, we will **reduce the next claim amount** by outstanding credits. This means SA naturally reconciles the reduced amount without needing to know about the refund.

### 2. Existing Event Sourcing Patterns Support This

The codebase already has patterns for decrementing funding:
- `BillItemUnapprovedEvent` decrements funding
- `BillFundingConsumptionsCorrected` event adjusts amounts (used for GST corrections)
- `FundingConsumptionsReconciledEvent` recalculates totals from consumption records

A new `BillItemRefundedEvent` (or similar) follows the same pattern.

### 3. Two-Phase Delivery

Phase 1 (credit notes) delivers immediate value independently. Phase 2 (automated claims with netting) depends on Phase 1's credit records but also relates to the SAH Claims Process (SCP / TP-900) epic.

### 4. MYOB Auto-Detection Over Manual Entry

Rather than relying on finance to manually raise credit notes in Portal after processing refunds in MYOB, Portal should automatically detect MYOB debit notes/credit notes and create corresponding records. This requires investigating the MYOB API for credit note data.

---

## Related Epics

- **SAH Claims Process (SCP / TP-900)** — Phase 2 automated claim pipeline overlaps with or extends the SCP work
- **Digital Statements** — Statement generation uses `SA_RECONCILED` consumption records; credit notes may need to appear on statements
- **Budget Reloaded** — Budget management and visibility; refund credits affect budget calculations

---

## Files Reference

- [IDEA-BRIEF.md](/initiatives/budgets-and-finance/funding-reconciliation-refunds/idea-brief) — Epic idea brief
- [SAH Claims Process](/initiatives/budgets-and-finance/sah-claims-process) — Related epic

---

## Next Steps

1. Investigate MYOB API for credit/debit note data availability
2. Test SA invoice submission with reduced (netted) amounts in sandbox
3. Create detailed technical specification (`spec.md`)
4. Coordinate with SCP team on shared claim pipeline work
