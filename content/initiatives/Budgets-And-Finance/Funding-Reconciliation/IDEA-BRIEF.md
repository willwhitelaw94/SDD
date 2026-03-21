---
title: "Idea Brief: Funding Reconciliation & Refunds (FRR)"
description: "Budgets And Finance > Funding Reconciliation & Refunds"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: FRR | **Created**: 2026-02-11

---

## Problem Statement (What)

Portal's billing architecture has no mechanism to process refunds or reverse funding consumption, creating systemic data mismatches between Portal, MYOB, and Services Australia.

**Pain Points:**
- No way to issue full or partial refunds against paid bills in Portal
- When finance processes refunds in MYOB, Portal never knows — budget stays consumed
- Client budgets show less available funding than they actually have
- New bills get blocked by budget checks against stale consumption data
- Manual workarounds required for every refund scenario
- ~$500K in overclaims to Services Australia due to inability to reconcile refunds
- SA reconciliation cycle doesn't handle internal refunds — operates on SA's timeline, not ours
- No API exists to tell Services Australia "we refunded $20"

**Current State**: One-way billing flow (approve → consume → pay → dead end). Zero refund capability. MYOB and Portal drift apart with every refund. Client budgets locked incorrectly.

---

## Possible Solution (How)

Implement credit notes system with automated SA claim netting to restore budgets immediately and reconcile all three systems (Portal, MYOB, SA) naturally.

**Key Strategy**: Instead of trying to reverse past SA claims (impossible via API), we net outstanding credits against the next SA claim submission. If there's a $20 refund and next claim is $100, we submit $80 to SA. SA reconciles at $80, Portal already accounted for the $20 credit — everyone agrees.

### Phase 1: Credit Notes & Refund System
- **Credit notes** raised against paid bills (full or partial amounts)
- **Budget restored immediately** — client's available funding increases the moment credit is approved
- **MYOB linkage required** — credit note must reference MYOB refund transaction
- **Credits tracked per client/funding stream** — system knows what's outstanding and where
- **Full audit trail** — who, why, when, which claim netted against

### Phase 2: Automated SA Claim Pipeline (With Netting)
- **Consumption → SA invoice automation** — no more manual CSV assembly
- **Outstanding credits netted automatically** — before submission, credits deducted from claim amount
- **Review before submit** — finance sees claim with all adjustments clearly flagged
- **Reconciliation works as normal** — SA confirms reduced amount, Portal matches everything
- **Credit tracking** — each credit marked "applied" with reference to claim it was netted against

```
// Before (Current - One Way)
Bill Created → Approved (budget consumed) → Synced to MYOB → Paid → ❌ Dead End

// After (With Refund Path)
Bill Created → Approved → Synced to MYOB → Paid → ✅ Credit Note Raised (budget restored)
                                                          ↓
                                              Automated Claim Pipeline
                                              (nets credits against new claims)
                                                          ↓
                                              Invoice Submitted to SA
                                              (reduced by credit amount)
                                                          ↓
                                                   SA Reconciles
                                                          ↓
                                                 All Systems Agree ✅
```

### Worked Example: $20 Partial Refund

**Scenario:** Care coordination fee incorrectly applied, finance refunds $20 in MYOB

| Step | Action | Portal | MYOB | Services Australia |
|---|---|---|---|---|
| 1 | Original bill $100 approved, synced, paid | $100 consumed | $100 paid | $100 claimed |
| 2 | Finance refunds $20 in MYOB | Still $100 consumed | $20 refunded | Still $100 claimed |
| 3 | **NEW:** Finance raises credit note in Portal for $20 | +$20 restored = $80 consumed | $20 refunded | Still $100 claimed |
| 4 | Client's budget immediately unblocked | Budget available ✅ | Normal | No change yet |
| 5 | **NEW:** Next claim cycle. New services = $100. System deducts $20 credit. | $100 new consumption | Normal | **$80 claimed** ($100 - $20) |
| 6 | SA reconciles claim at $80. Credit marked as applied. | Reconciled ✅ | Reconciled ✅ | Reconciled ✅ |

> **Net effect:** SA paid $100 originally + $80 on next cycle = $180 for $180 worth of actual services. All systems balanced.

---

## Benefits (Why)

**User/Client Experience:**
- Client budgets become accurate immediately after refunds — no more "insufficient funds" errors when money is actually available
- Bills stop getting blocked unnecessarily

**Operational Efficiency:**
- Finance has formal refund process instead of manual workarounds
- Automated claim pipeline eliminates CSV assembly
- No manual tracking of credits against claims

**Business Value:**
- **Compliance** — proper audit trail for all refunds and adjustments
- **Accuracy** — resolves $500K overclaim issue with Services Australia
- **Data Integrity** — Portal, MYOB, and SA stay in sync automatically
- **SAH Readiness** — transparent, compliant financial tracking under Support at Home

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | Tim Willmore (Dev Lead), Locky (Backend), Mellette Opena-Fitzpatrick (PO), Katja Panova (Finance) |
| **A** | Marko Rukovina |
| **C** | Finance Team, Claims Team |
| **I** | Care Coordinators, Operations |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Finance will continue processing refunds in MYOB first (MYOB remains source of truth for payments)
- Services Australia claim cycles continue at current frequency
- Outstanding credits can be carried forward across multiple claim cycles if needed

**Dependencies:**
- Digital Statements (DST) — credit notes should appear in client statements
- SAH Claims Process (SCP) — automated claim pipeline is foundation for netting logic
- MYOB API endpoints for refund transaction validation

**Risks:**
- SA rejects claim with netted amounts (HIGH impact, LOW probability) → Credit rolls back to "pending", re-applied on next claim automatically
- Credit raised for wrong amount/bill (MEDIUM impact, MEDIUM probability) → Approval workflow + mandatory reason codes. Credits can be voided before claim submission.
- Other providers claimed same funding via SA (MEDIUM impact, LOW probability) → System only nets against Trilogy Care's own claims. Other-provider scenarios flagged for manual handling.
- Credit note raised in Portal but refund not done in MYOB (HIGH impact, MEDIUM probability) → Workflow requires MYOB refund reference before credit approval.
- Large credit exceeds multiple claim cycles (LOW impact, MEDIUM probability) → Dashboard visibility of outstanding credits with ageing. Escalation for credits not applied within X cycles.

---

## Success Metrics

- 100% of refunds recorded in Portal with matching MYOB references
- Client budget accuracy 100% (Portal matches MYOB available funds)
- Zero bills blocked due to incorrect budget consumption
- $500K overclaim to SA reconciled within 2 claim cycles
- Refund processing time from MYOB to Portal budget restoration <5 minutes
- Credit application to SA claims 100% automated (zero manual CSV work)

---

## Estimated Effort

**L (Large) — 6-8 sprints**

**Phase 1: Credit Notes (3-4 sprints)**
- Sprint 1: Credit note data model, API, approval workflow
- Sprint 2: Frontend UI for raising/viewing credits, MYOB linkage
- Sprint 3: Budget restoration logic, audit trail, testing
- Sprint 4: Finance team training, launch

**Phase 2: Automated Claim Pipeline (3-4 sprints)**
- Sprint 5: Consumption → SA invoice aggregation logic
- Sprint 6: Credit netting engine, review UI
- Sprint 7: SA submission integration, response handling
- Sprint 8: Reconciliation flow, credit application tracking, launch

---

## Open Questions

| Question | Options | Who Decides |
|---|---|---|
| Should credit notes require second approver? | Single approval (faster) vs dual approval (safer for large amounts) | Finance / Ops |
| Allow credit notes on any paid bill or time window? | Any time vs within 90 days vs current financial year only | Finance |
| How to allocate partial credits across funding streams? | Finance chooses stream vs proportional split vs reverse priority | Finance / Dev |
| Should claim pipeline auto-submit or require review? | Fully automated vs review-then-submit vs auto with exception review | Finance / Ops |
| What if credits exceed next claim amount? | Carry forward remainder to subsequent claims vs cap at zero per claim | Finance |

---

## Decision

- [ ] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. **Finance team workshop** — validate credit note workflow and approval requirements
2. **MYOB API audit** — confirm refund transaction endpoints and data available
3. **Services Australia claims analysis** — review current claim submission process and SA response handling
4. **Database design session** — model credit notes, netting logic, audit trail
5. `/trilogy-clarify` — Examine from spec, business, design, dev, db perspectives
6. Create detailed technical specification with phase breakdown
