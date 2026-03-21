---
title: "Collections Dashboard Mockup (V2 Reference)"
---

> **Note**: This mockup represents V2 scope. Saved here as reference for future planning.

## Dashboard Overview

**Title**: TRILOGY CONTRACTS AND COLLECTIONS DASHBOARD

### Header Section
- Time filter dropdown: Today | Yesterday | This Week | This Month
- **Total Contracts Signed**: 1,247

### Summary Cards (3-column layout)

| Card | Status | Count | Percentage | Notes |
|------|--------|-------|------------|-------|
| Count 1 | Has Direct Debit (Bank or Card) | 1,054 | 84.5% | Green/success state |
| Count 2 | Refused DD (Monthly Invoice) | 138 | 11.1% | Neutral/blue state |
| Count 3 | Unknown/Missing (AT RISK) | 55 | 4.4% | Red/danger state, TARGET: 0% |

### KPI Indicators

**Direct Debit Adoption Rate**
- 84.5% of total contracts
- Visual: Green progress bar

**At-Risk Contracts Requiring Action**
- 55 contracts (4.4%)
- Warning: "Immediate follow-up required"

### Drill-Down Section (3-column layout)

**Column 1: Customer List (Active DD)**
| Name | TCID | Date | Status |
|------|------|------|--------|
| Sarah Johnson | TC-1001 | 2025-01-15 | Active |
| Michael Chen | TC-1002 | 2025-01-14 | Active |
| Emma Williams | TC-1003 | 2025-01-13 | Active |
| James Brown | TC-1004 | 2025-01-12 | Active |

**Column 2: Customer List (Monthly Invoice)**
| Name | TCID | Date | Status |
|------|------|------|--------|
| Robert Taylor | TC-2001 | 2025-01-10 | Monthly Invoice |
| Linda Garcia | TC-2002 | 2025-01-09 | Monthly Invoice |
| David Martinez | TC-2003 | 2025-01-08 | Monthly Invoice |

**Column 3: Customer List (URGENT ACTION - Red highlight)**
| Name | TCID | Date | Days Open | Priority |
|------|------|------|-----------|----------|
| Jennifer Lee | TC-3001 | 2025-01-05 | 6 days | High |
| Christopher Davis | TC-3002 | 2025-01-03 | 8 days | High |
| Patricia Wilson | TC-3003 | 2024-12-28 | 14 days | Critical |
| Daniel Anderson | TC-3004 | 2024-12-20 | - | - |

---

## Direct Debit (DD) Uptake Reporting Framework

### DD Signed % (Adoption Rate)
- Indicates how many participants have formalised a predictable payment method
- Higher adoption lowers arrears and administrative overhead
- Low adoption rate increases manual chasing and reconciliation workload

### DD Unknown / Unsigned % (Risk Indicator)
- Each "DD Unknown" record represents uncertainty in revenue timing
- If over ~10-15% of participants lack confirmed collection arrangements, cashflow volatility rises
- Monitor the ratio of "DD Unknown" to active participants monthly

### Revenue Impact Modelling
- Quantify expected contribution revenue vs received amounts
- Identify variance attributable to:
  - Participants awaiting income/asset assessment
  - Participants without DD agreements
  - Approved hardship cases
- Present arrears ageing (0-30 days, 31-60 days, > 60 days)

### Risk Thresholds for Management Attention

| Risk Level | DD Unknown % | Arrears | Action |
|------------|--------------|---------|--------|
| Low | < 5% | - | Well-controlled |
| Medium | 5-15% | - | Targeted follow-up needed |
| High | > 15% | > 10% over 30 days | Escalate for governance review |

### Exception Handling
- Track hardship or pending assessment participants separately (not "DD Unknown")
- Record "means not disclosed" participants (default to highest contribution rates)

---

## Recommended Management Actions

1. **Standardise Data Fields**: CRM/finance captures DD status (Yes/No/Unknown/Hardship/Pending)
2. **Monthly Dashboard**: DD Adoption %, DD Unknown %, Arrears by days, Revenue variance
3. **Escalation Rules**: Flag participants unpaid > 30 days unless fee-reduction pending
4. **Internal Audit Review**: Quarterly compliance review against Manual
5. **Participant Communication Plan**: Consistent DD benefits/obligations messaging

---

## Example KPIs for Reporting

| Metric | Definition | Target | Action if Outside |
|--------|------------|--------|-------------------|
| DD Signed % | % active participants with DD mandate | >= 85% | Escalate below 70% |
| DD Unknown % | % without known payment method | <= 10% | Investigate data/consent gaps |
| Arrears > 30 days | % invoices unpaid > 30 days | <= 5% | Trigger collections review |
| Hardship Cases % | % approved under SA462 supplement | Track only | Monitor expiry/reassessment |

---

## User Story (Draft - Collections V2)

```
AS A finance manager
I WANT to see a real-time dashboard of DD adoption rates and at-risk contracts
SO THAT I can proactively manage collections and reduce arrears

Acceptance Criteria:
- [ ] Dashboard shows total contracts with time filter
- [ ] Three summary cards: Has DD, Refused DD, Unknown/Missing
- [ ] DD Adoption Rate KPI with visual progress bar
- [ ] At-Risk contracts count with urgency indicator
- [ ] Drill-down lists for each category
- [ ] Priority flagging (High/Critical) based on days open
- [ ] Arrears ageing breakdown (0-30, 31-60, >60 days)
```

---

**Source**: Dashboard mockup provided 2025-12-23
**Relates to**: TP-2285-COL2-Collections-V2
