---
title: "UI Mockup Summary - Collections V2 Finance Dashboards"
---


**Epic**: TP-2285-COL2
**Created**: 2026-01-16
**Status**: Draft for Review

---

## Overview

This document summarizes mockup variations for the two Finance dashboards in Collections V2:
1. **VC Approval Dashboard** - Finance payable managers approve pending VC funding streams
2. **VC Reconciliation Dashboard** - Finance team performs daily/weekly reconciliation

---

## VC Approval Dashboard

### Mockup Files
See [approval-dashboard-variations.txt](./approval-dashboard-variations.txt) for 8 detailed mockup variations.

### Recommended Design: OPTION H
**Hybrid - Quick Action + Detail Expansion**

#### Why This Works
- ✅ Meets 30-second approval target
- ✅ Shows critical info by default (package, consumer, amount, period, date)
- ✅ Expandable details for complex cases (retroactive, high amounts)
- ✅ Single-click approval for straightforward cases
- ✅ Retroactive warnings visible (⚠️)
- ✅ Scales well for 1-50 pending approvals
- ✅ Works on mobile/tablet (expandable sections)

#### Key Features
```
┌────────────────────────────────────────────────────────────┐
│ ⚠️  PKG-2453  │  Smith, John  │  $5,200  │  Q1 2026  │ [▼] [✓] │
├────────────────────────────────────────────────────────────┤
│    📦 Supported Independent Living • 📍 Melbourne          │
│    👤 Added by: J. Wilson (Care Partner)                   │
│    💬 Reason: Consumer requested additional buffer         │
│    🚫 Impact: 2 bills on hold ($1,850 total)               │
└────────────────────────────────────────────────────────────┘

Legend:
[▼] = Expand/collapse details
[✓] = Quick approve button
```

#### Alternative Considerations

**If Finance approves 10+ items regularly:**
- Add **Bulk Actions** (OPTION G) in Phase 2
- Checkboxes for multi-select
- "Approve Selected (N)" button
- Confirmation modal for bulk operations

**If urgency becomes critical metric:**
- Add **Priority Indicators** (OPTION F)
- Color-code by bills-on-hold count
- Sort by urgency (red > yellow > green)

---

## VC Reconciliation Dashboard

### Mockup Files
See [reconciliation-dashboard-variations.txt](./reconciliation-dashboard-variations.txt) for 8 detailed mockup variations.

### Recommended Design: OPTION H
**Data Grid with Smart Grouping + Summary Rows**

#### Why This Works
- ✅ Meets 50% time reduction target (15 min for 50+ items)
- ✅ Surfaces issues prominently (overdue invoices at top)
- ✅ Summary rows show totals per group
- ✅ Collapsible sections reduce scrolling
- ✅ Supports multiple grouping modes (Status, Package, Period)
- ✅ Export functionality for reporting
- ✅ Scales well for 50+ VC streams

#### Key Features
```
┌────────────────────────────────────────────────────────────┐
│ 🔴 OVERDUE INVOICES (3 invoices • $7,200 total)            │
├────────────────────────────────────────────────────────────┤
│ Invoice #    VC Stream   Package    Amount   Due    Days   │
│ INV-2024-001 PKG-2453    Smith, J.  $1,200   Jan 20  5     │
│ INV-2023-995 PKG-2201    Taylor, E. $2,800   Jan 15  10    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ 🟡 UNPAID - CURRENT (5 invoices • $8,900 total)            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ ✓ PAID (8 invoices • $25,600 total)     [Show/Hide ▼]     │
└────────────────────────────────────────────────────────────┘
```

#### Alternative Considerations

**For detailed investigation:**
- Add **Split-Pane Detail View** (OPTION G) as modal/slide-out
- Shows full VC usage metrics
- Lists all linked invoices
- Direct link to MYOB

**For management reporting:**
- Add **Overview Dashboard Tab** (OPTION B)
- KPI cards (Total Approved, Invoiced %, Paid %)
- Recent activity feed
- "Attention Required" alerts

---

## Design Trade-offs

### VC Approval Dashboard

| Option | Speed | Detail | Bulk Actions | Complexity |
|--------|-------|--------|--------------|------------|
| Option A (Simple Table) | ⭐⭐⭐⭐⭐ | ⭐⭐ | ❌ | ⭐ |
| Option B (Card Layout) | ⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐ |
| Option C (Split View) | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ | ⭐⭐⭐ |
| Option D (Wizard) | ⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ |
| Option G (Bulk) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ | ⭐⭐⭐ |
| **Option H (Hybrid)** | **⭐⭐⭐⭐** | **⭐⭐⭐⭐** | **✅ (P2)** | **⭐⭐** |

### VC Reconciliation Dashboard

| Option | Scan Speed | Priority | Filtering | Complexity |
|--------|------------|----------|-----------|------------|
| Option A (Single Table) | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| Option B (Tabs) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Option D (Filter-First) | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Option E (Kanban) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Option G (Split-Pane) | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Option H (Grouped)** | **⭐⭐⭐⭐⭐** | **⭐⭐⭐⭐⭐** | **⭐⭐⭐⭐** | **⭐⭐** |

---

## Phased Implementation Plan

### Phase 1: MVP (Ship Next Week)

**VC Approval Dashboard:**
- Option H core layout (expandable rows)
- Quick approve button (single-click)
- Retroactive warnings (⚠️)
- Basic sorting (date added)

**VC Reconciliation Dashboard:**
- Option H grouped view
- Group by: Status (Overdue, Unpaid, Paid, Not Invoiced)
- Summary rows with totals
- Basic filters (Package, Period)
- Export to CSV

**Success Metrics:**
- Approval time: < 30 seconds per item
- Reconciliation time: < 15 minutes for 50 items

---

### Phase 2: Enhancements (Sprint 2-3)

**VC Approval Dashboard:**
- Bulk selection + approval (Option G features)
- Confirmation modal for bulk actions
- Filter by package, period, date range
- Urgency indicators (bills on hold count)

**VC Reconciliation Dashboard:**
- Split-pane detail view (Option G style)
- Additional grouping options (Package, Period, Date)
- Inline actions (View in MYOB, Send Reminder)
- Advanced filtering

**Success Metrics:**
- Bulk approval usage: Track % of sessions using bulk
- Filter usage: Track most-used filters

---

### Phase 3: Management Reporting (Sprint 4+)

**Add Overview Dashboard Tab (Option B style):**
- KPI cards (Total VC Approved, Invoiced %, Paid %)
- Trend charts (VC over time, payment patterns)
- Recent activity feed
- "Attention Required" section with alerts

**Success Metrics:**
- Management visibility: Track dashboard views
- Issue resolution time: Track overdue invoice reduction

---

## Questions for Stakeholders

### VC Approval Dashboard

1. **Bulk Approval Priority:**
   - What % of approval sessions involve 5+ items?
   - Should bulk approval be in MVP or Phase 2?

2. **Confirmation Steps:**
   - Single-click approve or require confirmation modal?
   - Different confirmation for retroactive vs current quarter?

3. **Approval Criteria:**
   - Are there amount thresholds requiring extra review?
   - Should certain VC types have different approval flows?

### VC Reconciliation Dashboard

1. **Default Grouping:**
   - Group by Status (Overdue first) or Package (A-Z)?
   - Should "Paid" section be collapsed by default?

2. **MYOB Integration:**
   - "View in MYOB" - opens new tab or embedded view?
   - Are inline actions needed (Send Reminder, Mark as Paid)?

3. **Export Requirements:**
   - What columns are needed in CSV export?
   - Export all data or only filtered results?

4. **Sync Frequency:**
   - Is hourly MYOB sync sufficient?
   - Should manual "Sync Now" button be prominent?

---

## Validation Checklist

Before finalizing designs:

- [ ] Validate Option H mockups with Finance team
- [ ] Confirm grouping priorities for reconciliation dashboard
- [ ] Define CSV export format requirements
- [ ] Clarify MYOB integration behavior (links, sync)
- [ ] Test mockups on tablet/mobile screens (if needed)
- [ ] Confirm bulk approval is needed for MVP or Phase 2
- [ ] Validate urgency indicators priority (bills on hold)
- [ ] Review color coding for accessibility (red/green alternatives)

---

## Next Steps

1. **Schedule 30-min review with Finance team**
   - Walk through recommended mockups (Option H for both)
   - Gather feedback on alternative options
   - Answer stakeholder questions above

2. **Update spec.md with UI decisions**
   - Document chosen layouts
   - Add UI requirements to Functional Requirements
   - Update success criteria with UI metrics

3. **Proceed to `/speckit.plan`**
   - Break down implementation into tasks
   - Reference mockups for frontend work
   - Estimate effort based on design complexity

4. **Consider `/trilogy.clarify-design`** (if needed)
   - Refine specific components (approval modal, filter UI)
   - Add accessibility requirements
   - Define responsive breakpoints

---

## Files Reference

- [approval-dashboard-variations.txt](./approval-dashboard-variations.txt) - 8 VC Approval Dashboard mockups
- [reconciliation-dashboard-variations.txt](./reconciliation-dashboard-variations.txt) - 8 VC Reconciliation Dashboard mockups
- [../spec.md](../spec.md) - Feature specification
- [../user-flow.txt](../user-flow.txt) - User flow diagrams
