---
title: "Idea Brief: Voluntary Contributions Enhancements (VCE)"
description: "Budgets And Finance > Voluntary Contributions Enhancements"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: VCE | **Created**: 2026-01-14

---

## Problem Statement (What)

The Voluntary Contributions (VC) feature has critical gaps preventing effective workflows for both care partners and recipients.

**Pain Points (Care Partner):**
- **$30k quarterly cap** causes issues for high-contribution clients (bills stuck on hold)
- **No verification workflow** when VC funding stream is added to a plan
- **Date range editing disabled** — can't align VC periods with ON dates
- **Edit functionality incomplete** — backend exists but frontend drawer has TODO placeholders

**Pain Points (Recipient):**
- **No self-service VC setup** — recipients can't manage their own voluntary contributions
- **No direct debit for VC** — manual payment process creates friction
- **Reactive vs proactive funding** — no way to preload VC funds as an "overflow" account

**Current State**: $30k cap blockers, incomplete edit UI, no recipient self-service, no DD for VC.

---

## Possible Solution (How)

Two-part solution addressing care partner and recipient needs:

**1. Recipient Portal: Direct Debit VC Enrollment**
- **VC Direct Debit Form**: Recipient signs and specifies bank account, contribution amount (separate from mandatory contribution DD)
- **"Overflow Account" Model**: VC acts as reserve fund drawn LAST after all other funding streams (EL → ON → RC → CU → HC → VC)
- **Payment Limit Setting**: Recipient specifies max amount they're comfortable contributing

**2. Care Partner Workflow Fixes**
- **Remove/adjust $30k cap**: Configurable or removed quarterly limit
- **Automated verification workflow**: Trigger when VC funding stream added to plan
- **Enable date range editing**: Allow VC period alignment with ON dates
- **Complete edit drawer**: Wire up existing backend API to frontend form
- **100% utilization modal**: Prompt suggesting VC discussion at threshold

**3. Overspend Invoice → On Hold + VC Approval Workflow (NEW)**

When a bill exceeds available funds:
1. Bill placed **On Hold** with "Insufficient Funds" reason
2. Care Partner reviews and contacts client for VC consent
3. Documents consent in notes
4. Creates VC funding stream if needed (system prompts)
5. Adds VC to budget for ongoing services
6. Toggles **"VC Approved"** on bill to process

**Key Rules:**
- VC is opt-in per service (explicit budget selection required)
- No auto-fallback to VC without consent
- VC-funded bills have **0% loading fees**
- Only Care Partners/Senior Care Partners can approve

**Funding Hierarchy:** ON/EOL/RCP → HC/CU → AT/HM → VC (last)

See: [TRI-68](https://linear.app/trilogycare/issue/TRI-68)

```
// Before (Current)
1. Manual, paper-based VC setup
2. Reactive funding only
3. Incomplete care partner editing
4. No verification workflows

// After (With VCE)
1. Self-service DD in portal
2. Preload or reactive (recipient choice)
3. Full self-service editing
4. Automated verification triggers
```

---

## Benefits (Why)

**User/Client Experience:**
- Recipients can manage own VC through self-service portal
- Clear funding visibility with "overflow account" model

**Operational Efficiency:**
- Fewer bills on hold from VC verification issues
- Reduced VC-related support tickets (-80%)

**Business Value:**
- Client satisfaction — self-service and transparency
- Efficiency — care partner self-service completion rate 95%+
- Proactive funding — recipients can preload VC as safety net

---

## Owner & Stakeholders

| Role | Person |
|------|--------|
| **R** | — |
| **A** | — |
| **C** | — |
| **I** | — |

---

## Assumptions, Dependencies & Risks

**Assumptions:**
- Backend API for contributions exists (confirmed via code exploration)
- MYOB sync for contribution invoices is working
- Direct debit infrastructure exists (from mandatory contributions form)
- Recipient portal can host new enrollment forms

**Dependencies:**
- Existing `ContributionController` API endpoints
- `PackageContributionsEditDrawer.vue` component (incomplete)
- MYOB webhook integration for invoice sync
- Direct debit provider integration
- Collections epic (TP-2329-COL) may have relevant patterns

**Risks:**
- Direct debit complexity (MEDIUM impact, MEDIUM probability) → Leverage existing DD infrastructure from mandatory contributions
- Preload vs reactive confusion (MEDIUM impact, LOW probability) → Clear UX explaining both options
- Cap removal impacts billing (MEDIUM impact, LOW probability) → Test with sample high-VC clients first
- Date editing breaks sync (HIGH impact, LOW probability) → Validate against SA data constraints

---

## Success Metrics

- Bills on hold due to VC: 0
- VC-related support tickets: -80%
- Care partner self-service completion rate: 95%+
- Recipient self-service enrollment rate: Target TBD

---

## Estimated Effort

**M (Medium) — 1-2 sprints**

- Sprint 1: Care partner fixes (edit drawer, caps, date editing, verification)
- Sprint 2: Recipient portal DD form, overflow account model, preload option

---

## Decision

- [x] **Approved** — Proceed to specification
- [ ] **Needs More Information**
- [ ] **Declined**

---

## Next Steps (If Approved)

1. Validate existing DD infrastructure compatibility
2. Define overflow account funding logic
3. `/speckit.specify` — Create detailed technical specification
