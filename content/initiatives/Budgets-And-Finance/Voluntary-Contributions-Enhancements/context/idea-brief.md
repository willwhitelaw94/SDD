---
title: "Idea Brief: Voluntary Contributions Enhancements"
---

**Epic Code:** VCE
**Initiative:** Budgets & Services (TP-1869)
**Owner:** CPO (William Whitelaw)
**Status:** Idea
**Target Delivery:** 1 Sprint

---

## Problem Statement

The Voluntary Contributions (VC) feature has critical gaps preventing effective workflows:

**Care Partner Pain Points:**
- **$30k quarterly cap** causes issues for high-contribution clients (bills stuck on hold)
- **No verification workflow** when VC funding stream is added to a plan
- **Date range editing disabled** - can't align VC periods with ON dates
- **Edit functionality incomplete** - backend exists but frontend drawer has TODO placeholders

**Recipient Pain Points:**
- **No self-service VC setup** - recipients can't manage their own voluntary contributions
- **No direct debit for VC** - manual payment process creates friction
- **Reactive vs proactive funding** - no way to preload VC funds as an "overflow" account

---

## Possible Solution

### 1. Recipient Portal: Direct Debit VC Enrollment

Enable recipients to self-serve their voluntary contributions via the recipient portal:

- **VC Direct Debit Form** - recipient signs and specifies:
  - Bank account details
  - VC contribution amount (recurring or one-time)
  - This is **separate from** the mandatory contribution direct debit form
- **"Overflow Account" Model** - VC acts like a reserve fund that:
  - Gets drawn from **last** after all other funding streams exhausted (EL → ON → RC → CU → HC → VC)
  - Can be **preloaded** (proactive) or **reactive** (charged as needed)
- **Payment Limit Setting** - recipient specifies max amount they're comfortable contributing

### 2. Care Partner Workflow Fixes

- **Remove/adjust $30k cap** - configurable or removed quarterly limit
- **Automated verification workflow** - trigger when VC funding stream added to plan
- **Enable date range editing** - allow VC period alignment with ON dates
- **Complete edit drawer** - wire up existing backend API to frontend form
- **100% utilization modal** - prompt suggesting VC discussion at threshold

### 3. Overspend Invoice → On Hold + VC Approval Workflow (NEW)

When a bill exceeds available funds in selected funding streams:

1. **Bill placed On Hold** with reason "Insufficient Funds"
2. **Care Partner reviews** the on-hold bill
3. **Contact client** to obtain VC consent
4. **Document consent** in notes
5. **Create VC funding stream** if one doesn't exist (system should prompt)
6. **Add VC to budget** for ongoing services
7. **Toggle "VC Approved"** on the bill to process using VC funds

**Key Rules:**
- VC is **opt-in per service** - must be explicitly selected in budget
- **No auto-fallback** to VC without consent
- VC-funded bills have **0% loading/overhead fees**
- Client consent required and must be documented
- Only **Care Partners and Senior Care Partners** can approve VC usage

**Funding Stream Hierarchy** (when multiple streams selected):
1. ON/EOL/RCP (Ongoing/End of Life/Residential Care Package)
2. Unspent funds (HC/CU - Home Care/Commonwealth Unspent)
3. AT/HM (Assistive Technology/Home Modifications)
4. VC (Voluntary Contribution) - **LAST**

See: [TRI-68](https://linear.app/trilogycare/issue/TRI-68) for implementation tracking

### Before/After

| Aspect | Before | After |
|--------|--------|-------|
| **Recipient setup** | Manual, paper-based | Self-service direct debit in portal |
| **Funding model** | Reactive only | Preload or reactive (recipient choice) |
| **Care partner editing** | Incomplete, caps | Full self-service, configurable limits |
| **Verification** | Manual | Automated workflow triggers |

---

## Business Outcomes & Benefits

**Primary Goal:** Seamless VC experience for recipients + eliminate care partner blockers

**Key Benefits:**
- **Fewer bills on hold** - VC verification automated, caps removed/configurable
- **Client satisfaction** - self-service portal experience, clear funding visibility
- **Reduced support tickets** - recipients manage own VC, care partners unblocked
- **Proactive funding option** - recipients can preload VC as safety net

**Success Metrics:**
- Bills on hold due to VC: 0
- VC-related support tickets: -80%
- Recipient self-service enrollment rate: Target TBD
- Care partner self-service completion rate: 95%+

---

## Owner & Stakeholders

| Role | Stakeholder | Responsibility |
|------|-------------|----------------|
| **Owner** | CPO | Decision-making, delivery |
| **End Users** | Recipients, Care Partners | Validate workflows, feedback |
| **Operations** | Romy, Indiana, Madison | Requirements, testing |
| **Engineering** | Dev Team | Implementation |
| **Finance** | Finance Team | Direct debit integration, MYOB sync |

---

## Assumptions & Dependencies

**Assumptions:**
- Backend API for contributions exists (confirmed via code exploration)
- MYOB sync for contribution invoices is working
- Direct debit infrastructure exists (from mandatory contributions form)
- Recipient portal can host new enrollment forms

**Dependencies:**
- Existing `ContributionController` API endpoints
- `PackageContributionsEditDrawer.vue` component (incomplete)
- MYOB webhook integration for invoice sync
- Direct debit provider integration (existing?)
- Collections epic (TP-2329-COL) may have relevant patterns

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Direct debit complexity** | Delays delivery | Leverage existing DD infrastructure from mandatory contributions |
| **Preload vs reactive confusion** | Recipient confusion | Clear UX explaining both options |
| **Cap removal impacts billing** | Unexpected billing behavior | Test with sample high-VC clients first |
| **Date editing breaks sync** | Misalignment with Services Australia | Validate against SA data constraints |

---

## Estimated Effort

**T-Shirt Size:** Medium (M) - expanded scope with recipient portal work
**Estimated Sprints:** 1-2 sprints
**Target Delivery:** Next sprint(s)

### Sprint Breakdown
1. **Sprint 1:** Care partner fixes (edit drawer, caps, date editing, verification)
2. **Sprint 2:** Recipient portal DD form, overflow account model, preload option

---

## Proceed to Spec?

**Ready for detailed specification?** YES

Move to `/speckit.specify` for:
- Recipient portal DD form UX flow
- Overflow account funding logic
- Preload vs reactive implementation
- Care partner edit drawer completion
- Verification workflow trigger logic

---

## Next Steps

1. Create Jira epic (replace TP-XXXX with actual ticket)
2. Run `/speckit.specify` for detailed specification
3. Plan implementation with `/speckit.plan`
