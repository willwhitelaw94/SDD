---
title: "Context: Collections V2 - VC Approval & Reconciliation"
---


**Epic**: TP-2285-COL2
**Created**: 2026-01-16
**Last Updated**: 2026-01-16

---

## Plan Generation - 2026-01-16

### Technical Approach
- **Backend**: Laravel 12, PHP 8.4, MySQL database
- **Frontend**: Vue 3 + Inertia.js v2 + TypeScript, existing `<Table>` component
- **Integration**: MYOB API (API-014) for AR invoice and payment sync
- **Testing**: Pest v3 (unit + feature), Dusk v8 or Nightwatch v1 (browser)

### Architecture Decisions

**1. UI Design: Table UI (Option A)**
- Leverages existing table component infrastructure (filtering, sorting, multi-select, CSV export)
- Inline approval actions for single-click approval
- Bulk operations with confirmation modal
- Fast development, familiar UX for Finance users

**2. Data Model: AR Invoice Payments as Primary Records**
- AR Invoice Payment is the unique reconciliation entity (child of AR Invoice)
- Supports partial payments (multiple payment records per invoice)
- Invoice status derived from aggregated payments (Partially Paid, Fully Paid)
- Denormalized `vc_funding_stream_id` in payments table for fast lookups

**3. No Notifications**
- Finance works directly from approval table (not notified)
- Reduces information overload
- Finance users check dashboard as part of workflow

**4. Automatic Bill Release**
- Bills automatically released when AR invoice marked as fully paid
- System checks for other on-hold reasons (compliance, etc.) before releasing
- Bill-to-Invoice association table tracks linkage

### Tech Stack

**Backend:**
- Laravel 12 (PHP 8.4)
- Spatie Laravel Data (DTOs for type safety)
- Redis + Horizon (queue management)
- Pest v3 (testing)

**Frontend:**
- Vue 3 + TypeScript (type-safe components)
- Inertia.js v2 (server-driven pages, no API calls)
- Tailwind CSS v3 (styling)
- Existing `<Table>` component (reusable)

**External:**
- MYOB API (API-014) - AR invoice and payment sync
- Hourly sync job + manual refresh button

### Data Model

**Core Entities:**
1. **VC Funding Stream** - Voluntary Contribution added to package budget
2. **AR Invoice** - Synced from MYOB, linked to VC
3. **AR Invoice Payment** ⭐ - Primary reconciliation record (child of invoice)
4. **Bill-to-Invoice Association** - Links bills to invoices for automatic release
5. **VC Approval Log** - Immutable audit trail

**Relationships:**
```
VC Funding Stream (1) ──→ (N) AR Invoices
                                    │
                                    ├──→ (N) AR Invoice Payments ⭐
                                    │
                                    └──→ (N) Bill-to-Invoice Associations
```

### Key Phases

**Phase 1: Foundation (Days 1-2)**
- Database migrations (5 tables)
- Models with relationships
- Data classes (Laravel Data DTOs)
- Permissions (FINANCE_APPROVE_VC)

**Phase 2: VC Approval Dashboard (Days 3-4)**
- Actions: ApproveVCFundingStreamAction, BulkApproveVCFundingStreamsAction
- Controllers: VCApprovalController (index, approve, bulkApprove)
- Frontend: Finance/VCApprovals/Index.vue (table UI with inline actions)
- Policies: FINANCE_APPROVE_VC permission checks

**Phase 3: Care Partner Budget Editing (Day 4)**
- Actions: AddVCFundingToBudgetAction
- Controllers: PackageBudgetController (addVCFunding)
- Frontend: Update Packages/Budget/Show.vue (add VC funding section)

**Phase 4: MYOB Integration (Days 5-6)**
- Jobs: SyncMyobArInvoicesJob (hourly sync)
- Services: MyobArInvoiceSyncService (pagination, error handling)
- Payment processing: Calculate invoice status, trigger bill release

**Phase 5: VC Reconciliation Dashboard (Days 7-8)**
- Controllers: VCReconciliationController (index, export)
- Frontend: Finance/VCReconciliation/Index.vue (payment-level records)
- Filters: Status, package, period, payment date, payment method
- Summary metrics: Total approved, invoiced, paid

**Phase 6: Bill Release Automation (Day 9)**
- Actions: ReleaseBillsForInvoiceAction
- Event listener: ArInvoiceFullyPaidListener
- Bill-to-Invoice associations created when VC added

**Phase 7: Polish & Edge Cases (Day 10)**
- Edge cases (permission removed, MYOB sync failure, multiple invoices)
- Performance optimization (indexes, eager loading, caching)
- Accessibility testing (keyboard nav, screen reader, focus visible)

---

## Design Decisions Summary

### Session 2026-01-16 (Spec Creation)

**Clarifications Resolved:**
- Finance role: Finance payable managers approve VC funding streams
- Bulk approval: Supported via table multi-select
- Bill release: Automatic when AR invoice fully paid (checks other hold reasons)
- Notifications: No notifications - Finance works directly from table
- Payment tracking: Payment-level granularity (not just invoice-level)

**UI Mockups:**
- Created 8 variations for VC Approval Dashboard
- Created 8 variations for VC Reconciliation Dashboard
- Selected Option A (Table UI) for both dashboards
- Final design documented in mockups/FINAL-table-ui-design.txt

**Data Model Refinement:**
- AR Invoice Payment as primary reconciliation entity (not invoice)
- Supports partial payments (multiple payment records per invoice)
- Invoice status derived from aggregated payments
- Denormalized vc_funding_stream_id for performance

---

## Feature Flags

**Flag Name**: `collections_v2_enabled`

**Rollout Plan:**
1. Dev/Staging: 100% enabled
2. Production Beta (Week 1): 10% Finance users
3. Production Staged (Week 2): 50% Finance users
4. Production Full (Week 3): 100% Finance users

---

## Success Metrics

**VC Approval Dashboard:**
- Approval time: < 30 seconds per item ✓
- Audit trail: 100% of approvals logged ✓
- Authorization: Unauthorized users blocked ✓

**VC Reconciliation Dashboard:**
- Reconciliation time: < 15 minutes for 50+ items ✓
- Payment granularity: Multiple payments per invoice ✓
- Export: CSV with all payment records ✓

**Bill Release:**
- Automatic release when invoice fully paid ✓
- No false releases (checks other hold reasons) ✓

---

## Technical Constraints

**Performance:**
- VC Approval table: < 2 seconds load time (100 rows)
- Reconciliation table: < 2 seconds load time (100 rows)
- Filters: < 500ms response time
- MYOB sync: < 2 minutes (hourly job)

**Security:**
- FINANCE_APPROVE_VC permission for approvals
- VIEW_FINANCIALS permission for reconciliation
- Audit trail for all approvals (immutable)

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Full keyboard navigation
- Visible focus rings
- Screen reader support

---

## Files Reference

- [spec.md](../spec.md) - Feature specification
- [plan.md](../plan.md) - Implementation plan
- [data-model.md](../data-model.md) - Entity definitions
- [user-flow.txt](../user-flow.txt) - User flow diagrams
- [IDEA-BRIEF.md](../IDEA-BRIEF.md) - Epic idea brief
- [mockups/](../mockups/) - UI mockup variations
- [mockups/FINAL-table-ui-design.txt](../mockups/FINAL-table-ui-design.txt) - Final UI design

---

## Next Steps

1. Run `/speckit.tasks` - Generate dependency-ordered tasks
2. Schedule Finance stakeholder review (30 min)
3. Run `/speckit.implement` - Start Phase 1 (Foundation)
4. Validate MYOB API access (API-014)
5. Confirm MYOB GL code 2480 for VC invoices
