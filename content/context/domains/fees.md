---
title: "Fees"
---


> Self-Managed and Coordinator Fees (CC & TC Loadings)

---

## Overview

The Fees domain calculates and applies loadings to invoices and service plan items. Two types of fees are applied based on package type and service category.

---

## Fee Types

| Fee Type | Full Name | Applies To | Purpose |
|----------|-----------|------------|---------|
| **CC** | Care Coordination Fee | Fully Coordinated packages only | Covers care coordination services |
| **TC** | Trilogy Care Fee | All package types | Administrative and service management overhead |

**Note**: These fees are in addition to the 10% Care Management activities/fees that every provider is allowed to charge.

---

## Service Groups

Service groups determine fee calculation rules:

| Service Group | Code | Description | Fee Rules |
|---------------|------|-------------|-----------|
| Home Support | SERG-0001 | Personal Care, Nursing, Transport, Meals, Cleaning, Social Support | Standard uncapped percentage-based |
| Assistive Technology | SERG-0002 | Services providing/maintaining assistive devices | Capped CC and TC fees |
| Home Modifications | SERG-0003 | Home or environmental modifications | Capped CC and TC fees |

**Key difference**: For Home Support, TC compounds on CC. For Assistive Tech and Home Mods, fees are calculated independently (no compounding).

---

## Fee Calculation

### Home Support (SERG-0001)

**Self-Managed Packages:**
```
TC Fee = Supplier Amount × 10%
```

**Fully Coordinated Packages:**
```
CC Fee = Supplier Amount × CC Loading %  (default 20%)
TC Fee = (Supplier Amount + CC Fee) × 10%
```
Note: TC compounds on CC, resulting in slightly higher total fee.

### Assistive Technology (SERG-0002)

| Fee | % | Cap |
|----|---|-----|
| CC | 5% | $250 |
| TC | 5% | $250 |

**Fully Coordinated:** Both fees calculated separately on supplier amount, each capped.
```
Example: $10,000 item
CC = min(5% × $10,000, $250) = $250
TC = min(5% × $10,000, $250) = $250
Total fees = $500
```

**Self-Managed:** Combined loading applied.
```
Combined % = 10% (CC + TC)
Combined Cap = $500
Fee = min(10% × $10,000, $500) = $500
```

### Home Modifications (SERG-0003)

| Fee | % | Cap |
|----|---|-----|
| CC | 5% | $500 |
| TC | 10% | $1,000 |

**Fully Coordinated:** Both fees calculated separately on supplier amount, each capped.
```
Example: $20,000 item
CC = min(5% × $20,000, $500) = $500
TC = min(10% × $20,000, $1,000) = $1,000
Total fees = $1,500
```

**Self-Managed:** Combined loading applied.
```
Combined % = 15% (CC + TC)
Combined Cap = $1,500
Fee = min(15% × $20,000, $1,500) = $1,500
```

---

## Complete Fee Table

| Service | Package | CC % | TC % | CC Cap | TC Cap | Total Cap |
|---------|---------|------|------|--------|--------|-----------|
| **Assistive Technology** | SM | 0% | 10% | $0 | $500 | $500 |
| **Assistive Technology** | SM+ | 5% | 5% | $250 | $250 | $500 |
| **Home Modifications** | SM | 0% | 15% | $0 | $1,500 | $1,500 |
| **Home Modifications** | SM+ | 5% | 10% | $500 | $1,000 | $1,500 |

### Unified Formula

For both SM and SM+ packages, fees can be calculated using a single formula:

```
Combined fee = min(supplier_amount × (CC% + TC%), CC_cap + TC_cap)
```

For SM packages, the CC values are zero, so the formula naturally simplifies:
- **AT SM**: min(amount × 10%, $500)
- **HM SM**: min(amount × 15%, $1,500)

---

## When Fees Apply

Fees are calculated in two places:

1. **Service Plan Item** - Single planned service item as an estimate confirmed with the recipient
2. **Invoice (Bill)** - At the whole invoice level (not per line item)

### Invoice-Level Caps (AT/HM)

Fee caps for AT and HM apply **per invoice**, not per line item:

- If an invoice has multiple **Assistive Tech** line items, the total CC fee is capped at **$250** and TC at **$250**
- If an invoice has items for both AT and HM, caps are applied separately for each service group
- If an invoice has AT, HM, and Home Support items, each follows its own rules

**Example**: Invoice with 3 AT items totaling $15,000:
- CC = min(5% × $15,000, $250) = $250 (not $750)
- TC = min(5% × $15,000, $250) = $250 (not $750)
- Total fee = $500

---

## Government Compliance

The fee caps align with the Support at Home Provider Manual requirements:

| Service | Government Maximum | How Trilogy Applies It |
|---------|-------------------|----------------------|
| **Assistive Technology** | Admin costs ≤ 10% of total cost, or $500 (whichever is lower) | SM: 10% / $500 combined; SM+: 5%/$250 CC + 5%/$250 TC |
| **Home Modifications** | Coordination costs ≤ 15% of quoted cost, or $1,500 (whichever is lower) | SM: 15% / $1,500 combined; SM+: 5%/$500 CC + 10%/$1,000 TC |

---

## Fee Split Rationale (AT vs HM)

The different TC/CC splits between AT and HM reflect the workload distribution:

| Service | CC % | TC % | Reasoning |
|---------|------|------|-----------|
| **Assistive Technology** | 5% | 5% | Equal split (1:1) - simpler procurement process |
| **Home Modifications** | 5% | 10% | Weighted toward TC (2:1) - more complex coordination, managing multiple quotes, arranging builders |

For **Self-Managed packages**, the CC component zeros out, so the combined formula simplifies:
- AT: 10% capped at $500 (equivalent to CC% + TC%)
- HM: 15% capped at $1,500 (equivalent to CC% + TC%)

---

## Summary Matrix

| Package Type | Service Group | Calculation | Capped? |
|--------------|---------------|-------------|---------|
| Self-Managed | Home Support | TC = Supplier × 10% | No |
| Fully Coordinated | Home Support | CC = Supplier × CC%; TC = (Supplier + CC) × 10% | No |
| Self-Managed | Assistive Tech / Home Mods | Combined CC+TC % on supplier, capped | Yes |
| Fully Coordinated | Assistive Tech / Home Mods | CC and TC calculated separately, each capped | Yes |

---

## CC Fee Management

- CC fee is set per Service Plan (not per item)
- Default is the Coordinator's current CC rate
- Can be overridden with Trilogy Default or Custom rate
- Changes to CC fee create a new Service Plan version
- CC fee changes can be initiated by Coordinators (requires Admin approval)

---

## Open Questions

| Question | Context |
|----------|---------|
| **Why does FeeCalculator service not exist?** | Docs reference Services/FeeCalculator.php but fee calculation logic is in CalculateFeesAction instead |
| **What is the model name for CC fee proposals?** | Docs say CareCoordinatorFee.php but actual model is CareCoordinatorFeeProposal.php |
| **Where are fee constants stored?** | Fee.php has CARE_MANAGEMENT_PERCENTAGE=10 and TC_LOADING_PERCENTAGE=10 as constants |

---

## Technical Components

### Fee Domain (Actual)

```
domain/Fee/
├── Models/
│   ├── Fee.php                  # Main fee record with FeeTypeEnum, FeeStatusEnum
│   ├── FeePayment.php           # Payment tracking
│   ├── MonthlyFee.php           # Monthly aggregations
│   └── QuarterlyFee.php         # Quarterly aggregations
├── Actions/
│   └── CalculateFeesAction.php  # Contains ALL fee calculation logic
├── Data/
│   ├── FeeCalculationData.php
│   ├── FeePercentagesData.php
│   └── BillFeesResultData.php
├── Enums/
│   ├── FeeTypeEnum.php          # CC_LOADING, TC_LOADING
│   ├── FeeStatusEnum.php        # PENDING, CONFIRMED, PAID
│   └── PeriodStatusEnum.php
└── EventSourcing/
    └── FeeProjector.php
```

**Note**: `Services/FeeCalculator.php` does NOT exist. Fee calculation is in `CalculateFeesAction.php`.

### CareCoordinatorFee Domain (Extensive)

```
domain/CareCoordinatorFee/
├── Models/
│   └── CareCoordinatorFeeProposal.php   # NOT CareCoordinatorFee.php
├── Actions/ (14 files)
│   ├── ApproveFeeChangeProposalAction.php
│   ├── ClientApproveFeeProposalAction.php
│   ├── ClientRejectFeeProposalAction.php
│   └── [10+ more actions]
├── Enums/
│   ├── FeeProposalStatusEnum.php        # PENDING_ADMIN_APPROVAL, APPROVED, etc.
│   ├── FeeProposalTypeEnum.php
│   └── LoadingFeesEnum.php
├── EventSourcing/
│   ├── Aggregates/
│   ├── Events/ (11 event types)
│   ├── Projectors/ (2 files)
│   └── Reactors/
├── Notifications/ (4 notification classes)
└── Data/ (24 DTO files)
```

---

## Related Documentation

- [Budget](budget.md) - Fee allocation in service plans
- [Bill Processing](bill-processing.md) - Fee application on invoices
- [How fees are calculated](https://trilogycare.atlassian.net/wiki/spaces/TC/pages/706936851) (Confluence)

---

## Decision History

| Date | Ticket | Decision | Notes |
|------|--------|----------|-------|
| 2025-11 | [TP-2880](https://trilogycare.atlassian.net/browse/TP-2880) | Applied correct fee labels: AT 5%/5%, HM 5%/10% | Implemented by Tim Maier |
| 2025-11 | [TP-2516](https://trilogycare.atlassian.net/browse/TP-2516) | Fee calculation review | Feedback ticket - confirmed fee logic is correct |
| 2026-01 | [TP-3870](https://trilogycare.atlassian.net/browse/TP-3870) | Cap TC/CC fees at bill level (not line item) | Ensures compliance with government caps |

The 5%/10% split for HM (vs 5%/5% for AT) reflects the additional work required for home modifications coordination (managing multiple quotes, arranging builders). This was an internal business decision to divide the government-allowed maximums between TC and CC.

---

## TC Fee Calculation Issues

### Incident: TC Fee Calculation Bug – 2026-02-17

#### 1. Summary

Between 28 January and 17 February 2026, the Portal incorrectly calculated Trilogy Care (TC) loading fees by applying 10% to only the invoice amount (ex GST), instead of 10% of the invoice amount plus the care coordinator (CC) loading amount. This resulted in TC fees being under-collected on all Self-Managed Plus bills that had CC fees during that period.

#### 2. Background / Where the problem came from

**Intended TC fee logic:** Since 1 November 2025 (SaH go-live), the TC loading fee is calculated as 10% of the ex-GST service amount plus 10% of the CC loading amount (for SM+ packages). This is documented on the [How fees are calculated within the Trilogy Care Portal](https://trilogycare.atlassian.net/wiki/spaces/TC/pages/706936851) Confluence page.

**What changed:** A code change shipped on 28 January 2026 altered the fee calculation logic. After that change, the TC fee was only being calculated on the invoice amount alone — the CC loading component was dropped from the calculation base.

**How it slipped through:** The change was deployed without regression testing that specifically validated the TC fee formula against bills with CC fees attached. There was no automated test covering the scenario where TC loading compounds on top of CC loading for SM+ packages. The gap went undetected for approximately three weeks.

#### 3. Impact

**What was affected:**

- All Self-Managed Plus bills processed (progressed from submitted → approved) between 28 January and 17 February 2026 that had care coordinator fees attached
- TC loading was under-collected on every affected bill
- The shortfall per bill varies depending on the CC fee amount — for example, on a $150 ex-GST invoice with 20% CC loading ($30), the TC fee was $15 instead of the correct $18 (a $3 shortfall per bill)

**How it was detected:** Rachael Pang from the finance team identified an example on 17 February where the TC fee didn't look right on bill 914691. The issue was escalated and confirmed the same day.

**Quantification status:** Rachael and Gus were tasked with quantifying the total number of affected invoices, the number of clients impacted, and the total dollar value of the shortfall. *(Update this section with their findings once available.)*

#### 4. Actions taken

**Timeline:**

- **28 Jan 2026** — Code change deployed that inadvertently broke TC fee calculation
- **17 Feb 2026** — Rachael Pang identified the discrepancy on a specific bill
- **17 Feb 2026, 5:00 PM** — Fix deployed to production restoring the correct TC fee calculation logic
- **Post-fix** — Nova tool developed to correct TC fees on bills already in PAID or PAYING status

**Temporary mitigations:** None required beyond the same-day fix. Bills processed after 5pm on 17 February calculate correctly.

**Fix implemented:** The fee calculation logic was corrected to restore the original formula: `TC loading = 10% × (ex-GST service amount + CC loading amount)`. A separate Nova tool was built to retroactively fix TC fees on bills that had already progressed to PAID/PAYING stage during the affected window (see PR #6189).

#### 5. Resolution

**Validation:** Confirmed in production that bills processed after the fix correctly include the CC loading component in the TC fee calculation.

**Links:**

- Linear ticket: [TRI-84](https://linear.app/trilogy-care/issue/TRI-84) — TC fees are calculating incorrectly
- Fix PR: [tc-portal/pull/6189](https://github.com/Trilogy-Care/tc-portal/pull/6189) — Nova tool to fix TC fee on paid/paying bills
- Related documentation: [How fees are calculated within the Trilogy Care Portal](https://trilogycare.atlassian.net/wiki/spaces/TC/pages/706936851)

**Outstanding:** Decision pending on whether to correct the shortfall on client statements or write off if the total value is below a threshold (e.g. $10,000).

#### 6. Prevention / What we'll do in future

*(Suggested items — update based on what the team agrees to:)*

- **Automated test coverage:** Add unit/integration tests that specifically validate TC fee calculation for SM+ packages with CC fees, ensuring the formula includes the CC component
- **Regression checklist:** Any change touching fee calculation logic should require a dedicated regression check against known fee scenarios (SM, SM+, with/without CC, VC, ATHM capped fees)
- **QA sign-off requirement:** Fee-logic changes should require explicit QA sign-off using a standardised test matrix before deployment to production
- **Monitoring/alerting:** Consider adding a periodic data quality check that flags TC fee amounts that appear inconsistent with the expected formula (e.g. TC fee = 10% of invoice only, with no CC component)

#### 7. Appendix

**Before/After Formula Example:**

| Item | Before Fix (Incorrect) | After Fix (Correct) |
|------|----------------------|-------------------|
| Invoice amount (ex GST) | $150.00 | $150.00 |
| CC Loading (20%) | $30.00 | $30.00 |
| TC Loading calculation base | $150.00 only | $150.00 + $30.00 = $180.00 |
| TC Loading (10%) | $15.00 | $18.00 |
| Shortfall per bill | $3.00 | — |

---

## Status

**Maturity**: Production
**Pod**: Pod 4 (Supply Chain & Operations)
