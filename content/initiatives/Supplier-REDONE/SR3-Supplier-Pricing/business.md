---
title: "Business Alignment: Supplier Pricing"
---

# Business Alignment: Supplier Pricing (SR3)

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## 1. Business Objectives

- **Close the rate submission gap**: Move from 38% completion (5,000 of 13,000 suppliers) to 70%+ within 3 months by removing friction from the submission process (N/A toggles, partial save, clear validation feedback).
- **Enforce pricing compliance at scale**: Establish automated price cap validation with a 10% tolerance band so that compliant rates are auto-approved instantly and only genuine exceptions require staff review.
- **Eliminate ad-hoc pricing review**: Replace spreadsheet-based manual review with a structured approve/reject dashboard, reducing pricing team effort and eliminating lost or forgotten requests.
- **Give suppliers transparency before consequences**: Surface compliance status, flag counts, and billing hold risk so suppliers can self-correct before their cash flow is interrupted.

---

## 2. Success Metrics

| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| Rate submission completion | 38% to 70% within 3 months | Count of suppliers with all applicable rates submitted (including N/A) / total active suppliers |
| Out-of-cap rate leakage | 0% — zero rates silently accepted above cap | Audit query: rates above cap without a price request record |
| Staff review turnaround | < 2 business days from submission to decision | Average elapsed time on PriceRequest records (submitted_at to resolved_at) |
| Pricing-related support queries | 30% reduction within 3 months | Support ticket volume tagged "pricing" compared to 3-month pre-launch baseline |
| Audit trail completeness | 100% traceability | Automated check: every OrganisationPrice change has a PriceAuditLog entry |
| Cap confidentiality | Zero exposures | Quarterly security review of UI, PDFs, notifications, and error messages |
| PDF generation speed | < 5 seconds per download | P95 response time on the PDF endpoint |

---

## 3. ROI Analysis

### Costs

| Item | Estimate |
|------|----------|
| Development (6-8 weeks, 3-4 sprints) | ~$90k-$120k (team cost) |
| QA and data migration (existing $0 to null cleanup) | ~$10k-$15k |
| **Total estimated cost** | **$100k-$135k** |

### Benefits

| Benefit | Estimated Value |
|---------|-----------------|
| Pricing team time saved (5+ hrs/week manual review eliminated) | ~$15k/year |
| Reduced billing holds from confused suppliers (fewer holds = fewer payment disruptions, support escalations) | ~$30k-$50k/year in avoided rework and support cost |
| Faster rate completion unlocks accurate billing for 8,000+ suppliers currently incomplete | Revenue protection: prevents under-billing from missing rates and over-billing from incorrect $0 entries |
| Clean data ($0 vs null distinction) reduces billing errors downstream in SR4 | Indirect — enables SR4 validation accuracy |

### Payback

Conservative payback within **12-18 months** from direct operational savings. The larger strategic value is that SR3 is a hard dependency for SR4 (Billing) — without validated rates, bill validation in SR4 has no reliable baseline to check against. Delaying SR3 delays the entire billing pipeline.

---

## 4. Stakeholder Impact

| Stakeholder | Impact |
|-------------|--------|
| **Suppliers (13,000)** | Must re-engage with rate submission. 5,000 with complete rates see minimal change. 4,000 partial and 4,000 not-started suppliers gain a clearer, less painful submission experience. All suppliers gain compliance visibility. |
| **Pricing Team (TC staff)** | Workload shifts from manual spreadsheet review to dashboard-based approve/reject. Batch approval and auto-approve for compliant rates dramatically reduce review volume. Net time savings estimated at 5+ hours/week. |
| **Operations / Billing Team** | Cleaner pricing data reduces downstream bill rejections caused by rate mismatches. Directly improves SR4 outcomes. |
| **Compliance / Finance** | Full audit trail for all pricing changes supports regulatory audits. Price cap confidentiality is maintained. |
| **Stephen (stakeholder)** | Requested PDF pricing reference (Mar 4 meeting) — delivered as P2 story. |

---

## 5. Risk to Business

### If we don't do this

- **Rate submission stays at 38%**: 8,000 suppliers remain incomplete. Billing for these suppliers relies on outdated or missing rates, causing payment errors, disputes, and support overhead.
- **No compliance enforcement**: Out-of-cap rates continue to be accepted or manually tracked. Pricing team cannot scale — they are limited by spreadsheet throughput.
- **Billing holds surprise suppliers**: Without compliance visibility, suppliers hit billing holds with no warning, damaging trust and creating support escalations.
- **SR4 Billing has no pricing foundation**: Bill validation in SR4 depends on SR3's validated, auto-approved rates. Without SR3, SR4 must either skip rate validation (compliance risk) or build its own workaround (duplication).

### If we do this badly

- **Price cap leakage**: If cap validation has gaps, suppliers could submit and get approved at inflated rates — direct cost overruns.
- **Cap exposure**: If cap values leak through error messages or repeated submission probing, suppliers could game the system to submit just below the threshold.
- **Data migration errors**: Converting existing $0 entries to null/N/A incorrectly could flip legitimate $0 rates (e.g., no travel charge) to "not offered", breaking billing.
- **Dashboard bottleneck**: If the approve/reject dashboard is slow or the volume of out-of-cap submissions is higher than expected, staff review becomes a new bottleneck.

---

## 6. Dependencies on Other Epics

| Dependency | Direction | Nature |
|------------|-----------|--------|
| **SR0 (API Foundation)** | SR3 depends on SR0 | Token-based auth and v2 API infrastructure for the standalone frontend |
| **SR2 (Profile & Org Management)** | SR3 depends on SR2 | Location management (pricing is per-location), supplier entity context switcher, org dashboard compliance rollup |
| **SR4 (Billing & Invoicing)** | SR4 depends on SR3 | Bill line item rate validation checks submitted rates against SR3's agreed pricing. SR3 must deliver validated rates before SR4's rate-comparison validation (FR-004) is meaningful |
| **SR9 (Integrations)** | Deferred | Digital platform pricing (Mable, etc.) excluded from automated cap validation — tagged as "platform-sourced" for manual review until SR9 addresses integration reliability |

**Critical path**: SR0 → SR2 → SR3 → SR4. SR3 is on the critical path to billing. Any delay in SR3 directly delays SR4, which is the highest-value epic in the initiative.

---

## 7. Go/No-Go Criteria

Before starting SR3 development, the following must be true:

- [ ] **SR0 API Foundation**: Token-based auth and v2 API endpoints are deployed and stable
- [ ] **SR2 Location Management**: Per-location data model is available — pricing grid requires locations to exist
- [ ] **Price cap list finalised**: Business team has provided the cap values (fixed dollar amounts) by service type and rate category
- [ ] **10% tolerance threshold confirmed**: The validation tolerance band is agreed and will not change during development (confirmed Mar 2026)
- [ ] **Existing OrganisationPrice model extensible**: Technical spike confirms the current model can be extended without architectural rework (assumption from idea brief)
- [ ] **Data migration plan for $0 entries**: Business rules defined to distinguish genuine $0 rates from "not applicable" entries in existing data
- [ ] **Service-type level approvals stable**: The preview feature (Dec 17 meeting) is production-ready enough to build the approval dashboard on top of
