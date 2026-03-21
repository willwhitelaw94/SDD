---
title: "Business Alignment: Assessments & Products"
---

# Business Alignment: Assessments & Products

**Epic Code**: SR6
**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Business Objectives

1. **Close the compliance gap on product expenditure** -- every product payment must have a documented clinical justification (assessment) and confirmed funding (budget linkage). This is a Support at Home programme requirement that Trilogy Care currently cannot systematically prove.
2. **Unblock the full supplier portal transition** -- SR6 is the last major functional gap before the legacy supplier portal can be decommissioned. Without assessments and product flows, the old portal must stay running indefinitely.
3. **Enable supplier product discovery** -- Care Partners currently rely on manual knowledge or spreadsheets to find suppliers for specific product categories. Structured discovery reduces procurement time and improves supplier utilisation.
4. **Establish the S@H product category taxonomy** -- the nine government-defined product categories become the single source of truth across assessments, supplier capabilities, and billing, eliminating data inconsistency.

---

## Success Metrics

| KPI | Target | Measurement Method | Baseline |
|-----|--------|--------------------|----------|
| Product bills with linked assessment | 100% | Automated validation at bill submission (FR-007) | Unknown -- currently not enforced |
| Product bills with linked budget | 100% | Automated validation at bill submission (FR-008) | Unknown -- currently not enforced |
| Assessment creation time | < 3 minutes | UX timing study post-launch | N/A (no digital assessment exists) |
| Supplier product discovery response time | < 2 seconds | Application performance monitoring | N/A (manual process) |
| Assessment audit trail completeness | 100% of transitions recorded | Database audit log query | 0% (no structured assessments) |
| Product category consistency across chain | Zero mismatches | Automated consistency check across assessments, supplier profiles, billing | Unmeasurable today |

---

## ROI Analysis

### Costs

| Item | Estimate | Notes |
|------|----------|-------|
| Development effort | ~6-8 weeks (L-sized epic) | Assessment CRUD, product workflow, three-way linkage validation, supplier discovery, taxonomy, reporting |
| QA and testing | ~2 weeks | Integration testing with SR4 billing pipeline, edge cases around expiry and linkage |
| Data setup | ~1 week | Seeding product categories, configuring Nova admin, assessment validity settings |
| **Total estimated cost** | **~9-11 weeks dev effort** | |

### Benefits

| Benefit | Estimated Value | Timeframe |
|---------|----------------|-----------|
| Audit risk reduction | Avoids potential penalties for unsubstantiated product expenditure under S@H. Individual audit findings can result in repayment demands of $10K-$100K+ | Immediate on deployment |
| Legacy portal decommission | Eliminates dual-maintenance cost (~2-4 hrs/week ongoing maintenance across team). SR6 is the blocker for full cutover | Within 3 months of SR6 + SR9 completing |
| Care Partner time savings | ~15-30 min/day saved per Care Partner on manual assessment tracking and supplier lookup (email, spreadsheets, manual verification) | Immediate on deployment |
| Billing error reduction | Prevents product bills processed without clinical justification -- currently unquantified but each incorrect payment is a compliance event | Immediate on deployment |

### Payback Period

Estimated 3-4 months. The audit risk reduction alone justifies the investment -- a single S@H audit finding for unsubstantiated product expenditure would exceed the development cost.

---

## Stakeholder Impact

| Stakeholder | Impact | Sentiment |
|-------------|--------|-----------|
| **Care Partners** | New assessment creation workflow, product procurement authorisation, supplier discovery by category. Net positive: replaces manual tracking with structured digital workflow | Positive -- reduces admin burden |
| **Coordinators** | Assessment review and approval workflow, compliance reporting, product status visibility | Positive -- gains audit trail and reporting |
| **Suppliers** | See linked assessment summaries when billing (read-only), must bill against pre-authorised Product records | Neutral -- small change to billing flow, no new data entry burden |
| **Finance/Compliance (Sophie Pickett)** | Full assessment-to-payment audit trail, S@H category enforcement, compliance reporting | Strongly positive -- closes a known compliance gap |
| **David Henry (Product Ops)** | Consulted on product workflow design, supplier operations impact | Neutral -- advisory role |
| **Khoa Duong (Tech)** | Data model integration with existing billing pipeline (SR4), new product_categories table | Neutral -- technical implementation |

---

## Risk to Business

### If we don't do this

- **Audit exposure**: Trilogy Care cannot systematically prove that product expenditure is clinically justified. Under S@H, this is a compliance requirement -- failure to demonstrate linkage during audit could result in repayment demands and reputational damage.
- **Legacy portal stays indefinitely**: The old supplier portal cannot be decommissioned because product flows are missing. This means ongoing dual-maintenance costs, fragmented user experience, and blocked ROI from SR0-SR5.
- **ASS1 and PSF remain blocked**: The two Linear projects (Assessments/Prescriptions and Product Supplier Flow) have been in Blocked/Backlog status. No assessment infrastructure means no progress on these.

### If we do it badly

- **False compliance confidence**: If the three-way linkage validation has gaps (e.g., expired assessments allowed, category mismatches not caught), Trilogy Care believes it is compliant when it is not. Worse than no system.
- **Care Partner friction**: If assessment creation is slow or confusing, Care Partners will work around the system (documenting assessments externally and only creating portal records retrospectively), defeating the purpose.
- **Category drift**: If the nine S@H product categories are not consistently enforced across assessments, supplier profiles, and billing, data quality degrades and the audit chain breaks.

---

## Dependencies on Other Epics

| Dependency | Type | Detail |
|------------|------|--------|
| **SR0 (API Foundation)** | Hard prerequisite | API layer and two-tier Organisation/Supplier model must be in place |
| **SR4 (Billing & Invoicing)** | Hard prerequisite | Billing infrastructure must exist for the mandatory assessment-budget-supplier linkage validation to work at bill submission time |
| **SR2 (Profile Management)** | Soft prerequisite | Supplier price lists (where product categories are registered) should be functional |
| **SR3 (Supplier Pricing)** | Soft prerequisite | Per-supplier-entity pricing underpins the product category registration on price lists |
| **SR7 (Home Modifications)** | SR6 is a prerequisite for SR7 | Home modifications build on the assessment-budget-supplier chain established here |
| **SR9 (Migration)** | Parallel | Migration must handle the transition of product flows between legacy and new portals |

**Critical path**: SR0 -> SR4 -> **SR6** -> SR7. SR6 unblocks SR7 and unblocks legacy portal decommission (via SR9).

---

## Go/No-Go Criteria

Before starting SR6 development:

- [ ] **SR0 API Foundation is deployed** -- the two-tier Organisation/Supplier model and API layer are live
- [ ] **SR4 Billing infrastructure is functional** -- bill submission and validation pipeline exists and is tested
- [ ] **ASS1 Figma designs are reviewed** -- the existing Figma designs for assessment flows are validated against this spec (designs exist but ASS1 is currently "Blocked" in Linear)
- [ ] **Product category taxonomy is confirmed** -- the nine S@H product categories are validated with Sophie Pickett / compliance team as the definitive list
- [ ] **Data model for assessments is agreed** -- CLR-001 (new product_categories table) and CLR-003 (Product pre-created by Care Partner) decisions are accepted by Khoa

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR6-Assessments-Products/spec)
- [Idea Brief](/initiatives/Supplier-REDONE/SR6-Assessments-Products/idea-brief)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- [SR4 - Billing & Invoicing](/initiatives/Supplier-REDONE/SR4-Billing-Invoicing)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
