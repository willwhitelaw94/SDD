---
title: "Business Alignment: Agreements & Compliance"
---

# Business Alignment: Agreements & Compliance (SR5)

**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## 1. Business Objectives

- **Digitise the agreement amendment lifecycle**: Replace email-based APA amendment requests with a structured dual-sided interface that distinguishes locked (non-negotiable) from negotiable clauses, creating a complete audit trail.
- **Bring TPC agreements online**: Eliminate paper-based TPC management by enabling upload, consumer/care-package linkage, and internal approval tracking — a compliance requirement with no current digital audit trail.
- **Automate low-risk supplier terminations**: Free the compliance team from routine termination processing (estimated 60-70% of terminations are low-risk) while ensuring high-risk cases still receive human oversight.
- **Shift compliance monitoring from reactive to proactive**: Integrate with AHPRA, NDIS banning orders, aged care banning orders, and AFRA registers to automatically detect and block banned/suspended suppliers before they submit more invoices.
- **Surface fraud risk in the supplier workflow**: Integrate EFTSure indicators (green/yellow/red) into supplier profiles and bank detail change flows so the fraud task force ("Operation Onion Slot") has tooling within the portal rather than manual cross-referencing.
- **Close notification gaps**: Establish a reliable, tiered notification system for document expiries, agreement renewals, and compliance actions — with operational notifications that suppliers cannot disable.

---

## 2. Success Metrics

| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| APA digital signing time | < 5 minutes from view to signed confirmation | P95 elapsed time from agreement page load to signed submission |
| Amendment audit trail completeness | 100% of amendments have full history | Audit query: amendment requests without original clause, proposed change, decision, and decision-maker = 0 |
| TPC linkage completeness | 100% of uploaded TPCs linked to consumer + care package | Audit query: TPC records without consumer_id or care_package_id = 0 |
| Low-risk termination processing time | < 30 seconds, zero compliance team involvement | Elapsed time from supplier confirmation to account deactivation for low-risk tier |
| Compliance team termination workload | 60-70% reduction in manual termination processing | Count of terminations processed manually vs automated (low-risk) per month |
| Government register flag-to-block gap | Zero gap — instant payment block on flag detection | Time between register check result and payment block application = 0 |
| EFTSure indicator coverage | 100% of supplier profiles where data is available | Count of supplier profiles with EFTSure indicator / total supplier profiles with EFTSure data |
| Document expiry notification delivery | Zero missed notifications at all configured thresholds | Audit: documents that expired without prior notifications at 30/14/7 day marks = 0 |
| Operational notification enforceability | 100% — suppliers cannot disable mandatory notifications | System test: attempt to disable operational notification returns error |

---

## 3. ROI Analysis

### Costs

| Item | Estimate |
|------|----------|
| Development (4 phases, L-sized epic) | ~$150k-$200k |
| Government register API integration (AHPRA, NDIS, aged care, AFRA) | ~$20k-$40k (dependent on API availability — may need batch import fallback) |
| EFTSure API integration | ~$10k-$20k |
| QA, compliance validation, risk-tier testing | ~$15k-$25k |
| **Total estimated cost** | **$195k-$285k** |

### Benefits

| Benefit | Estimated Value |
|---------|-----------------|
| Compliance team time saved (15-20 hrs/week on manual agreement/termination processing) | ~$45k-$60k/year |
| Agreement amendment cycle time reduced from weeks to days | Indirect — faster supplier activation, reduced email overhead |
| Eliminated fraud risk window (banned suppliers blocked instantly vs days/weeks of continued invoicing) | Risk avoidance: potential savings of $50k-$200k+ per incident prevented |
| Reduced document expiry lapses (proactive notifications vs reactive discovery) | ~$10k-$20k/year in avoided compliance remediation |
| Self-service low-risk terminations (60-70% of volume) | ~$15k-$20k/year in compliance team capacity freed |
| Structured TPC audit trail | Regulatory compliance value — avoids potential audit findings |

### Payback

Conservative payback within **18-24 months** from direct operational savings. The fraud prevention value is harder to quantify but potentially very large — a single prevented fraud incident (Operation Onion Slot context) could exceed the entire development cost. The strategic value is completing the compliance layer of the supplier portal — without SR5, the portal cannot enforce agreement requirements, monitor regulatory compliance, or prevent fraud through bank detail manipulation.

---

## 4. Stakeholder Impact

| Stakeholder | Impact |
|-------------|--------|
| **Suppliers (13,000)** | Gain self-service agreement amendments, TPC upload/tracking, self-termination for low-risk scenarios, proactive document expiry reminders, and transparency into compliance actions. Operational notifications become mandatory (cannot be disabled). |
| **Sophie Pickett (Compliance)** | Defines locked vs negotiable clause list for APA — directly shapes the amendment interface. Also involved in credentialing matrix review. |
| **Rudy Chartier** | Owns self-termination criteria, reactivation email templates, and risk tier definitions. Self-termination was targeting Mar 2 release — nearly merged. |
| **Zoe Judd** | Finalising approval/denial email templates for the notification system. |
| **Erin** | Owns APA variation process requirements and dual-sided interface design. |
| **Megan** | Owns QA review workflow for conditional terminations — defines what the QA team needs to see and decide. |
| **Fraud Task Force ("Operation Onion Slot")** | EFTSure integration provides the in-portal tooling they currently lack. Bank detail changes with yellow/red indicators trigger review workflows. |
| **Finance** | Payment blocks from government register flags and EFTSure red indicators directly affect payment processing. Finance needs visibility into active blocks and their resolution. |
| **QA/Compliance Team** | Conditional terminations route directly to them with automated context. Government register checks replace manual periodic reviews. Credentialing matrix enforcement automates document chasing. |

---

## 5. Risk to Business

### If we don't do this

- **Agreement amendments stay in email**: No audit trail, version control issues, lost requests. Every amendment requires manual compliance team involvement. This was raised as a frequent pain point (Dec 4 meeting).
- **TPC agreements remain paper-based**: No digital linkage to consumers or care packages. Audit trail is incomplete — a regulatory risk.
- **All terminations require compliance team**: Low-risk terminations (60-70% of volume) consume the same manual effort as high-risk ones. The compliance team cannot scale.
- **Banned suppliers continue billing**: Without register integration, a supplier suspended by AHPRA or placed on an NDIS banning order can continue submitting invoices for days or weeks before anyone notices. This is a direct regulatory and financial risk.
- **Bank detail fraud is detected too late**: EFTSure data exists but is not surfaced in the portal. The fraud task force relies on manual cross-referencing — slow and error-prone.
- **Document expiry creates surprise compliance gaps**: Inconsistent notifications mean suppliers miss renewal deadlines, creating operational overhead for the compliance team to chase renewals.

### If we do this badly

- **Locked clause misclassification**: If negotiable clauses are incorrectly marked as locked (or vice versa), suppliers either cannot request legitimate amendments or can request changes to terms that should be non-negotiable. Sophie's clause list is the critical input.
- **Self-termination risk tier misclassification**: A high-risk termination processed as low-risk could let a problematic supplier self-terminate and destroy evidence. The 15 criteria and risk classification must be airtight.
- **Government register false positives**: If register checks return incorrect flags, legitimate suppliers get payment-blocked. The "most restrictive result applies" rule means a single false positive blocks payment. Manual override with audit trail is the safety valve.
- **EFTSure API downtime**: If EFTSure is unavailable and the system defaults to green (rather than "check pending"), a fraudulent bank detail change could slip through. The spec correctly requires a "check pending" indicator as the fallback.
- **Notification fatigue**: If the system sends too many mandatory notifications, suppliers may start ignoring them — defeating the purpose. The operational vs optional classification must be calibrated carefully.

---

## 6. Dependencies on Other Epics

| Dependency | Direction | Nature |
|------------|-----------|--------|
| **SR0 (API Foundation)** | SR5 depends on SR0 | Token-based auth and v2 API infrastructure for agreement signing, amendment, and TPC upload flows |
| **SR1 (Registration & Onboarding)** | SR5 depends on SR1 | Supplier must be registered before agreements apply. Re-onboarding path used when a terminated supplier exceeds the 12-month reactivation window |
| **SR2 (Profile & Org Management)** | SR5 depends on SR2 | Supplier profile and organisation structure for agreement linkage. Org-level documents (public liability, workers comp) managed in SR2, not duplicated in SR5 |
| **SR3 (Supplier Pricing)** | Loose coupling | Agreed rates from SR3 are pre-populated in the APA. No hard build dependency, but rate data should be available for a complete agreement view |
| **SR4 (Billing & Invoicing)** | SR4 is affected by SR5 | Payment blocks from SR5 compliance checks (government register flags, EFTSure red) prevent bill payment in SR4. Operational integration, not a build-order dependency |

**Build order**: SR5 can be developed in parallel with SR3 and SR4 after SR0, SR1, and SR2 are in place. The self-termination feature (Phase 2) is nearly merged and has the shortest path to production. Government register and EFTSure integrations (Phase 3) have the longest lead time due to external API dependencies.

---

## 7. Go/No-Go Criteria

Before starting SR5 development, the following must be true:

- [ ] **SR0 API Foundation**: Token-based auth and v2 API infrastructure deployed
- [ ] **SR1 Registration**: Supplier registration flow complete — agreements require a registered supplier
- [ ] **SR2 Profile & Org Management**: Supplier entity and organisation structure available for agreement linkage
- [ ] **Sophie's locked/negotiable clause list**: Received and reviewed — this is the #1 blocker for the amendment interface (Phase 1)
- [ ] **Self-termination criteria confirmed**: The 15 criteria and 3 risk tiers are finalised (Dec 17 meeting confirmation) and Rudy's reactivation email templates are ready
- [ ] **Zoe's notification email templates**: Finalised for approval/denial notifications
- [ ] **Government register API availability spiked**: Technical spike confirms whether AHPRA, NDIS, aged care, and AFRA registers offer API access or require batch import. This determines the integration approach for Phase 3
- [ ] **EFTSure API access confirmed**: API credentials available, green/yellow/red indicators can be retrieved programmatically, integration agreement signed
- [ ] **Credentialing matrix stable**: The matrix (under review by Sophie, Feb 25 and Mar 4 meetings) is stable enough to encode as configuration rules — or Phase 4 is explicitly deferred until it stabilises
- [ ] **Existing SupplierAgreementController assessed**: Technical spike confirms the current APA signing flow can be extended with amendment/variation capability without architectural rework
