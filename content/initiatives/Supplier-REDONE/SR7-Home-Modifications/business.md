---
title: "Business Alignment: Home Modifications"
---

# Business Alignment: Home Modifications

**Epic Code**: SR7
**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Business Objectives

1. **Digitise the highest-value, highest-risk service type** -- home modification projects can cost tens of thousands of dollars per client. Currently managed through email, spreadsheets, and manual document tracking. A single missed document or overpayment is a significant financial and compliance event.
2. **Enforce state-specific documentation compliance** -- each state and territory has different documentation requirements for home modifications. Today, missing documents are only discovered at audit. System-enforced checklists prevent this entirely.
3. **Enable structured payment milestone tracking** -- home modifications are paid in instalments (deposit, progress, completion) but the portal has no concept of staged payments. Each payment is currently processed as a standalone bill with no linkage to project progress or quote total.
4. **Create an auditable project lifecycle** -- every stage transition (quote submitted, documents received, approved, completed) is recorded with who, when, and why. This replaces the email thread as the source of truth.

---

## Success Metrics

| KPI | Target | Measurement Method | Baseline |
|-----|--------|--------------------|----------|
| Projects with all state-required documents before approval | 100% | System-enforced gate at "Documents Received" transition | Unknown -- currently not enforced |
| Payment instalments exceeding approved quote | 0 | Automated validation at instalment submission (FR-008) | Unmeasurable -- manual tracking |
| Project stage transitions with complete audit trail | 100% | Database audit log query (FR-004) | 0% (no digital lifecycle) |
| Quote submission time for suppliers | < 5 minutes | UX timing study post-launch | N/A (email-based) |
| Completed projects with completion photos | 100% | System-enforced gate at "Completed" transition (FR-011) | Unknown -- photos in email attachments |
| Documentation matrix update time (admin) | < 2 minutes | Nova admin task timing | N/A (code changes required today) |

---

## ROI Analysis

### Costs

| Item | Estimate | Notes |
|------|----------|-------|
| Development effort | ~8-10 weeks (L-sized epic) | Project lifecycle state machine, state-specific doc matrix, payment instalment tracking, photo uploads, child-parent projects, automated budget linkage, supplier portal tab |
| Sophie Pickett input | ~2 weeks elapsed | Compiling state-specific documentation requirements -- currently in progress |
| QA and testing | ~2-3 weeks | State matrix permutations, payment edge cases, photo upload validation, child-parent aggregation |
| **Total estimated cost** | **~12-15 weeks dev effort** | Confidence: Low-Medium (state requirements still being compiled) |

### Benefits

| Benefit | Estimated Value | Timeframe |
|---------|----------------|-----------|
| Overpayment prevention | Prevents instalments exceeding approved quote total. Individual home mod projects are $5K-$50K+. A single overpayment of 10% on a $30K project = $3K unrecoverable cost | Immediate on deployment |
| Audit risk reduction (documentation) | State-based document enforcement eliminates the #1 audit finding for home modifications. Potential repayment demands per finding: $10K-$50K | Immediate on deployment |
| Coordinator time savings | ~30-60 min/day per coordinator spent tracking modification projects across email and spreadsheets. With ~5 coordinators handling home mods, that is ~12-25 hrs/week recovered | Immediate on deployment |
| Supplier time savings | Structured quote submission and milestone tracking replaces email back-and-forth. Estimated ~15 min saved per project interaction | Gradual -- as suppliers adopt the portal |

### Payback Period

Estimated 4-6 months. The overpayment prevention and documentation compliance benefits are immediate and high-value given the dollar amounts involved in home modification projects.

---

## Stakeholder Impact

| Stakeholder | Impact | Sentiment |
|-------------|--------|-----------|
| **Care Partners** | View full project lifecycle, accept quotes, manage project stage transitions. Replaces spreadsheet tracking | Positive -- single source of truth |
| **Coordinators** | Manage documentation checklists, process payment instalments, handle escalations. David Henry leading | Strongly positive -- biggest operational pain point resolved |
| **Suppliers** | Submit quotes through portal, upload documents and photos, view project status and payment history. New workflow to learn | Mixed -- process change but clearer expectations |
| **Sophie Pickett (Compliance)** | Provides state-specific documentation requirements, validates enforcement rules. Can update matrix via Nova | Positive -- compliance gap she has been flagging gets closed |
| **David Henry (Lead)** | Domain expert leading implementation. Knows the current manual process intimately | Strongly positive -- his domain, his pain |
| **Finance** | Payment instalments tracked against approved quotes and budgets. No more standalone bills for staged work | Positive -- financial tracking improves |

---

## Risk to Business

### If we don't do this

- **Overpayment risk continues**: Without instalment tracking against approved quotes, there is no systematic prevention of payments exceeding the agreed project cost. Each overpayment on a $20K-$50K project is significant.
- **Documentation compliance gaps at audit**: State-specific requirements are not enforced. Missing documents are discovered at audit, potentially resulting in repayment demands and regulatory action.
- **Operational inefficiency persists**: Coordinators spend hours daily tracking projects through email. This does not scale as the home modification portfolio grows under S@H.
- **No photo evidence trail**: Completion and progress photos exist in email attachments, not linked to project records. At audit, assembling evidence is manual and error-prone.

### If we do it badly

- **State documentation matrix errors**: If the matrix is misconfigured (wrong documents for a state), the system enforces incorrect requirements -- blocking legitimate projects or passing non-compliant ones.
- **Overly rigid lifecycle**: If the state machine does not accommodate real-world exceptions (e.g., escalation paths, partial completion), users will work around the system.
- **Supplier adoption failure**: If the quote submission and document upload experience is poor, suppliers will continue emailing documents to coordinators, defeating the purpose.
- **Child-parent complexity**: If the hierarchy model is confusing, coordinators will create flat projects and lose the aggregation benefit.

---

## Dependencies on Other Epics

| Dependency | Type | Detail |
|------------|------|--------|
| **SR6 (Assessments & Products)** | Hard prerequisite | Home modifications build on the assessment-budget-supplier chain. Automated linkage to client inclusions and budget (Story 7) depends on SR6 infrastructure |
| **SR4 (Billing & Invoicing)** | Hard prerequisite | Payment instalment processing uses the billing pipeline |
| **SR0 (API Foundation)** | Hard prerequisite | Two-tier Organisation/Supplier model for scoping projects to supplier entities |
| **SR2 (Profile Management)** | Soft prerequisite | Supplier profile where the Home Modifications tab appears |
| **SR8 (Staff Admin)** | Independent | Staff can view home modification projects from the staff portal, but SR7 does not depend on SR8 |
| **SR9 (Migration)** | Parallel | Migration must handle home modification data if any exists in the legacy portal |

**Critical path**: SR0 -> SR4 -> SR6 -> **SR7**. SR7 is at the end of the dependency chain.

**Resource constraint**: Postponed in February 2025 due to resource constraints. The dependency chain (SR0 -> SR4 -> SR6) now gives natural scheduling -- SR7 cannot start until SR6 is substantially complete, providing time for Sophie to finish compiling state documentation requirements.

---

## Go/No-Go Criteria

Before starting SR7 development:

- [ ] **SR6 is substantially complete** -- assessment-budget-supplier linkage chain is functional and tested
- [ ] **State documentation matrix is provided by Sophie Pickett** -- the Boolean matrix mapping document types to states/territories must exist before the configurable matrix can be built
- [ ] **David Henry is available to lead** -- he is the domain expert and designated lead; starting without him risks building the wrong thing
- [ ] **SR4 billing pipeline supports instalment-style payments** -- multiple payments against a single project/quote must be possible
- [ ] **Supplier quote submission UX is designed** -- no Figma designs exist yet for this module (unlike SR6 which has ASS1 Figma). Design work should precede or run parallel to development
- [ ] **Budget for L-sized epic is approved** -- 12-15 weeks of dev effort is significant; confirm the portfolio can absorb this alongside other active epics

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR7-Home-Modifications/spec)
- [Idea Brief](/initiatives/Supplier-REDONE/SR7-Home-Modifications/idea-brief)
- [SR6 - Assessments & Products](/initiatives/Supplier-REDONE/SR6-Assessments-Products/spec)
- [SR4 - Billing & Invoicing](/initiatives/Supplier-REDONE/SR4-Billing-Invoicing)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
