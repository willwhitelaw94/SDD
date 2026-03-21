---
title: "PRODA Claim Upload Process"
description: "End-to-end current claiming workflow from bill processing through PRODA submission to Services Australia reconciliation"
---


## TL;DR

- **What**: Process approved bills into claim batches, validate, submit to Services Australia via PRODA, reconcile payments
- **Who**: Data Team, Finance, Portal Team, Services Australia
- **Key flow**: Bill Processing → Claim Batch → Validation & QA → Finance Reconciliation → PRODA Submission → SA Response → Funding Reconciliation
- **Watch out**: Cannot submit another claim until the previous one is approved and released for payment

---

## Key Concepts

| Term | What it means |
|------|---------------|
| **PRODA** | Provider Digital Access — authentication gateway for Services Australia APIs |
| **Claim Batch** | Grouped set of claims created from approved bills |
| **SERV Code** | Service type code that determines how claims are split into CSV files |
| **IPA** | Individual Payment Agreement — funding entitlement for a recipient |
| **SA_RECONCILED** | Final status indicating a claim has been matched and reconciled with Services Australia |
| **Funding Draw-Down** | Order in which funding sources are consumed: ON funding → Unspent HCP Commonwealth → Home Care Account |
| **GL Filter** | General Ledger filter used for spot-check sampling during finance reconciliation |

---

## How It Works

### Swimlane Diagram

::ideas-board{src="/diagrams/proda-claiming-process.html" png="/diagrams/proda-claiming-process.png" title="PRODA Document Upload Process — Swimlane Diagram"}
::

### Swimlane Responsibilities

| Lane | Steps |
|------|-------|
| **Bill Processing** | Approved bills feed into the claiming pipeline |
| **Data Team** | Create claim batches, run validation & QA, split by service type, generate CSV claim files |
| **Finance** | MYOB vs CSV reconciliation, spot-check sampling, EL/RC funding validation, approve/reject, amend invoice handling, SA balance discrepancy, post-recon MYOB sync |
| **Portal Team** | Submit to PRODA, parse SA responses, match items to consumptions, update funding, recalculate balances |
| **Services Australia** | Receive claim files, process and return approval/rejection responses |

---

## SERV Code File Groups

Claims are split into separate CSV files by service type based on SERV codes:

| Group | SERV Codes |
|-------|------------|
| **Equipment & Products** | 0061, 0062, 0063, 0064, 0065, 0067 |
| **AT/HM with Health Professional** | 0066, 0068 |
| **Consumables & Nutrition** | 0006, 0026, 0047 |
| **Care Management** | 0018, 0019 |
| **Standard Services** | All others |

---

## Business Rules

| Rule | Why |
|------|-----|
| **One active claim at a time** | Cannot submit another claim until the previous one is approved and released for payment by SA |
| **Funding draw-down order** | Must consume: 1) ON funding first, 2) Unspent HCP Commonwealth, 3) Home Care Account |
| **IPA must be active** | Can't claim for recipients without valid IPA |
| **Claims within funding period** | Claims must fall within IPA effective dates |
| **Service date vs funding start** | Service date must align with funding start date |
| **Closed funding stream exception** | Cannot claim against closed funding streams |

---

## Validation Steps

### Data Team Validations

| Validation | Description |
|------------|-------------|
| **Late Submission Check** | Flags claims submitted after expected deadlines |
| **CM Entry/Exit Date Validation** | Ensures care management entry and exit dates are correct |
| **Tier 5 / Item Wrap Validation** | Validates Tier 5 items and item wrapping rules |

### Finance Validations

| Validation | Description |
|------------|-------------|
| **Total Reconciliation (MYOB vs CSV)** | Cross-checks claim CSV totals against MYOB records |
| **Spot Check Sample (GL Filter)** | Randomly samples claims filtered by General Ledger codes |
| **EL/RC Funding Validation** | Validates Entry Level and Restorative Care funding allocations |

---

## Who Uses This

| Role | What they do |
|------|--------------|
| **Data Team** | Create claim batches, run QA validation, split by service type, generate CSV files |
| **Finance Team** | Reconcile MYOB vs CSV, spot-check samples, validate funding, approve/reject claims, post-recon MYOB sync |
| **Portal Team** | Submit claim files to PRODA, parse SA responses, match items to consumptions, update funding balances |
| **Services Australia** | Receive and process claim files, return approval/rejection responses |

---

## Related

### Domains

- [Claims](/context/domains/claims) — underlying claims data model and SA API integration
- [Bill Processing](/context/domains/bill-processing) — approved bills feed into the claiming pipeline
- [Budget](/context/domains/budget) — funding allocation impacted by claim reconciliation

---

## Status

**Maturity**: In Development
**Reference**: PLA-1385
