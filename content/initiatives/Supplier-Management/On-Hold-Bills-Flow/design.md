---
title: "Design Spec"
---


**Epic**: TP-3787
**Initiative**: TP-1857 Supplier Management
**Created**: 2026-01-16
**Status**: Draft

---

## Design Resources

### LOOM Videos

| Title | Link | Description |
|-------|------|-------------|
| | | |

### Figma

| File | Link | Description |
|------|------|-------------|
| | | |

### Miro

| Board | Link | Description |
|-------|------|-------------|
| | | |

---

## 1. UX Decisions

### User Context

| Attribute | Decision |
|-----------|----------|
| **Primary User** | Bill Processor (sees all reasons, triggers comms) |
| **Secondary Users** | Department Users (Care/Compliance/Accounts) via Tasks |
| **Device Priority** | Desktop-first (dual monitor workflow common) |
| **Usage Pattern** | High frequency, all-day processing |

**Key insight**: The "holistic bill view" should be accessible to ANY internal user when they need the full picture. Department users primarily work via Tasks but can drill into the full bill view.

### Task Flow

**Happy Path (Bill Processor)**:
1. Bill enters SUBMITTED stage
2. OHB diagnosis runs at SUBMITTED → IN_REVIEW transition
3. Multiple reasons identified, displayed in checklist
4. Tasks auto-created for department-owned reasons
5. Bill Processor monitors checklist, sees reasons resolve
6. All reasons resolved or unresolved → COMMS TYPE determined
7. Single communique sent to supplier
8. Bill moves to final outcome (PAID / REJECTED)

**Department User Path**:
1. Receives task notification for their reason
2. Clicks notification → Focused Reason Modal opens
3. Reviews reason details, takes action
4. Marks reason resolved/unresolved
5. (Optional) Clicks "View Full Bill" for holistic context
6. Task completes, checklist updates

**Decision Points**:
- Auto-reject eligible? → Instant rejection (no human review)
- Any reason touches invoice? → REJECT-RESUBMIT
- All reasons contextual? → ON HOLD with cadence
- Resolution Window expired? → "Other processes required" message

### Information Architecture

**Traffic-Light Checklist Pattern** (primary organizer):

```
┌─────────────────────────────────────┐
│ Checklist                      64%  │
│ ⊘ 1   ⚠ 3   ✓ 7                    │
├─────────────────────────────────────┤
│ BLOCKING (1)                        │
│   ⊘ ABN/GST Error                   │
├─────────────────────────────────────┤
│ COMPLETE (7)                        │
│   ✓ Supplier Selected               │
│   ✓ Care Recipient Selected         │
│   ✓ Invoice Reference               │
│   ...                               │
├─────────────────────────────────────┤
│ WARNINGS (3)                        │
│   ⚠ Funding balance low             │
│   ⚠ Authorization expiring soon     │
│   ⚠ Service date near quarter end   │
└─────────────────────────────────────┘
```

**Secondary grouping by Separation of Concerns**:
- **Bill-level**: Invoice details, line items, calculations
- **Supplier-related**: Verification, bank details, MYOB, status
- **Care Recipient**: Package, budget, eligibility, approvals

### Navigation Context

| Entry Point | Destination |
|-------------|-------------|
| Bills Index table | Bill Edit page with OHB checklist |
| Task notification (dept user) | Focused Reason Modal |
| Dashboard KPI (On Hold count) | Filtered Bills Index |
| Bill Edit "See Issues" button | Expanded checklist panel |

### Interaction Model

| Aspect | Decision |
|--------|----------|
| **Feedback Style** | Optimistic for task completion, wait-for-server for stage changes |
| **Validation** | Inline validation on fields, checklist reflects validation state |
| **Real-time Updates** | Polling every 30-60s with "Updated just now" indicator |

---

## 2. UI Decisions

### Page Layout

**Type**: Enhanced existing page (Bills/Edit.vue) with IDE-style panels

**Structure**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Header: Bill ZPYEP [Submitted]              [Assign ▾] [REJECT] [APPROVE]│
├────────────┬─────────────────────────────────────────────┬───────────────┤
│            │                                             │               │
│ Documents  │  ┌─────────────────────────────────────┐   │  Checklist    │
│ & Notes    │  │ Supplier          Care Recipient    │   │  ──────────   │
│ (collaps.) │  │ [Mable ▾]         [Lambert... ▾]    │   │  BLOCKING (1) │
│            │  │ ══ Terminated     QY-566392         │   │  ⊘ ABN Error  │
│ ┌────────┐ │  ├─────────────────────────────────────┤   │               │
│ │ Docs   │ │  │ Invoice ref       Invoice date      │   │  COMPLETE (7) │
│ │ (0)    │ │  │ [7017385    ]     [04/01/2026  📅]  │   │  ✓ Supplier   │
│ └────────┘ │  ├─────────────────────────────────────┤   │  ✓ Recipient  │
│            │  │                                     │   │  ...          │
│ ┌────────┐ │  │  No bill items added yet            │   │               │
│ │ Notes  │ │  │  [+ ADD BILL ITEM]                  │   │  WARNINGS (3) │
│ │ (3)    │ │  │                                     │   │  ⚠ Funding    │
│ └────────┘ │  │                                     │   │  ⚠ Auth exp   │
│            │  └─────────────────────────────────────┘   │               │
│ ┌────────┐ │                                            │  [SEE ISSUES] │
│ │Activity│ │  ┌─────────────────────────────────────┐   │               │
│ └────────┘ │  │ Service Amt  │ Trilogy  │ GST       │   │  Updated 30s  │
│            │  │ $0.00        │ $0.00    │ $0.00     │   │  ago          │
├────────────┴──┴─────────────────────────────────────┴───┴───────────────┤
│ [ON HOLD]  [DELETE BILL]  [ESCALATE]  [DUPLICATE BILL]       [SAVE ONLY]│
└──────────────────────────────────────────────────────────────────────────┘
```

**Panel Behavior**:
- Left panel (Documents & Notes): Collapsible, default collapsed on laptop
- Right panel (Checklist): Collapsible, default expanded
- Center: Main bill canvas, always visible

### Component Inventory

#### Existing Components (from Storybook)

| Component | Usage | Props/Variants |
|-----------|-------|----------------|
| `CommonCollapsible` | Left/Right panel collapse | `defaultOpen={true/false}` |
| `CommonAccordion` | Checklist groups (BLOCKING/COMPLETE/WARNINGS) | grouped sections |
| `CommonBadge` | Status badges (Terminated, Verified, On-boarding) | `color="red/green/teal"` |
| `CommonIconBadge` | Checklist item status icons | `icon="check/x/warning"` |
| `CommonModal` | Focused Reason View | `size="lg"` |
| `CommonAlert` | Blocking reason callout at top | `variant="error"` |
| `CommonButton` | Action buttons | `variant="primary/danger/secondary"` |
| `CommonDefinitionList` | Reason details in modal | key-value pairs |
| `CommonDropdown` | Assign dropdown, reason actions | menu items |
| `CommonEmptyPlaceholder` | No bill items state | with action button |
| `CommonProgressBar` | Checklist completion % | `value={64}` |
| `CommonTooltip` | Hover explanations on checks | informational |
| `CommonTimer` | "Updated 30s ago" indicator | auto-refresh display |

#### New Components Required

| Component | Purpose | Similar To |
|-----------|---------|------------|
| `BillChecklistPanel` | Container for traffic-light checklist | Combines CommonAccordion + CommonIconBadge |
| `BillReasonModal` | Focused Reason View modal | Extends CommonModal |
| `BillReasonItem` | Single reason row in checklist | CommonDefinitionItem + status |

### Checklist Panel Detail

```vue
::bill-checklist-panel
<!-- Header with progress -->
  <header>
    ::common-progress-bar{value="completionPercent"}
::
    <span>{{ blocking }} ⊘  {{ warnings }} ⚠  {{ complete }} ✓</span>
  </header>

  <!-- Grouped accordion sections -->
  <CommonAccordion>
    <section v-if="blockingReasons.length" class="blocking">
      <h3>BLOCKING ({{ blockingReasons.length }})</h3>
      ::bill-reason-item{for="reason in blockingReasons" reason="reason" click="openReasonModal(reason)"}
::
    </section>

    <section v-if="completeReasons.length" class="complete">
      <h3>COMPLETE ({{ completeReasons.length }})</h3>
      <!-- collapsed by default -->
    </section>

    <section v-if="warningReasons.length" class="warnings">
      <h3>WARNINGS ({{ warningReasons.length }})</h3>
      <!-- soft warnings, time-sensitive qualifiers -->
    </section>
  </CommonAccordion>

  <!-- Footer -->
  <footer>
    ::common-timer{last-updated="lastFetchTime"}
::
    ::common-button{click="expandAll"}
SEE ISSUES
::
  </footer>
::
```

### Focused Reason Modal

```vue
::bill-reason-modal{reason="selectedReason" bill="bill"}
<header>
    ::common-icon-badge{status="reason.status"}
::
    <h2>{{ reason.name }}</h2>
    ::common-badge
{{ reason.department_owner }}
::
  </header>

  <CommonDefinitionList>
    ::common-definition-item{label="Status"}
{{ reason.status }}
::
    ::common-definition-item{label="Diagnosed"}
{{ reason.diagnosed_at }}
::
    ::common-definition-item{label="Diagnosed By"}
{{ reason.diagnosed_by }}
::
    ::common-definition-item{label="Department Action"}
{{ reason.department_action }}
::
  </CommonDefinitionList>

  <section v-if="reason.requires_resolution_outreach">
    ::common-alert{variant="info"}
This reason requires client/coordinator action (Resolution Outreach).
::
  </section>

  <footer>
    ::common-button{variant="secondary" click="viewFullBill"}
View Full Bill
::
    ::common-button{variant="primary" click="markResolved" disabled="!canResolve"}
Mark Resolved
::
  </footer>
::
```

### States

| State | Component | Behavior |
|-------|-----------|----------|
| **Loading** | `CommonPending` | Skeleton loader for checklist panel on initial load |
| **Empty** | `CommonEmptyPlaceholder` | "No issues found - ready for approval" |
| **Error** | `CommonAlert variant="error"` | "Unable to load checklist. Retry?" |
| **Polling** | `CommonTimer` | "Updated 30s ago" with subtle pulse on refresh |
| **Stale** | `CommonAlert variant="warning"` | "Data may be outdated. Refresh?" (if poll fails) |

### Responsive Behavior

| Breakpoint | Adaptation |
|------------|------------|
| **Desktop (≥1280px)** | Full 3-panel layout, all panels visible |
| **Laptop (1024-1279px)** | Left panel collapsed by default, right panel visible |
| **Tablet (768-1023px)** | Both side panels collapsed, toggle buttons in header |
| **Mobile (<768px)** | Not primary target; single column, panels as full-screen overlays |

### Color System (Traffic Lights)

| Status | Color | Tailwind Class | Usage |
|--------|-------|----------------|-------|
| BLOCKING | Red | `text-red-600 bg-red-50` | Unresolved reasons preventing approval |
| COMPLETE | Green | `text-green-600 bg-green-50` | Resolved reasons |
| WARNINGS | Amber | `text-amber-600 bg-amber-50` | Soft warnings, time-sensitive |
| IN PROGRESS | Blue | `text-blue-600 bg-blue-50` | Department currently working |
| AWAITING | Purple | `text-purple-600 bg-purple-50` | Waiting for external party |

---

## 3. Clarification Log

| Phase | Question | Decision |
|-------|----------|----------|
| UX | Who is primary user? | Bill Processor (but holistic view accessible to all internal users) |
| UX | Task notification landing? | Focused Reason Modal, with "View Full Bill" option |
| UX | Reasons display grouping? | Traffic-light checklist (BLOCKING/COMPLETE/WARNINGS), secondary by separation of concerns |
| UI | Page layout approach? | Integrate into existing Bills/Edit.vue with IDE-style panels |
| UI | Focused Reason View pattern? | CommonModal overlay |
| UI | Real-time status updates? | Polling every 30-60s with "Updated just now" indicator |

---

## 4. Design Principles (from Stakeholder Vision)

These principles inform all OHB UI decisions:

1. **IDE-style layout** - Collapsible panels, maximize canvas space
2. **Traffic-light checklist** - BLOCKING (red) / COMPLETE (green) / WARNINGS (amber)
3. **Separation of concerns** - Bill-level vs Supplier vs Care Recipient data
4. **Reasons linked to checks** - Failed validation = reason in checklist
5. **Sticky totals + actions** - Always visible footer
6. **Tasks as communication vehicle** - Structured follow-ups, not just notes

---

## 5. Integration Points

### Existing Files to Modify

| File | Change |
|------|--------|
| `resources/js/Pages/Bills/Edit.vue` | Add BillChecklistPanel, collapsible layout |
| `app/Http/Controllers/BillController.php` | Return `bill_reasons` data in edit() |
| `app/Tables/BillsTable.php` | Add OHB status/reason count columns (future) |

### New Files to Create

| File | Purpose |
|------|---------|
| `resources/js/Components/Bill/BillChecklistPanel.vue` | Checklist container component |
| `resources/js/Components/Bill/BillReasonItem.vue` | Single reason row component |
| `resources/js/Components/Bill/BillReasonModal.vue` | Focused reason modal |
| `resources/js/Composables/useBillReasons.js` | Polling logic, reason state management |

---

## 6. Open Questions

1. **Checklist panel position**: Right side (shown in wireframe) or integrate into existing right sidebar pattern?

2. **Task creation UX**: Auto-create tasks on diagnosis, or Bill Processor manually assigns? (Leaning auto-create)

3. **"See Issues" button behavior**: Expand checklist inline, or open full-screen modal with all details?

4. **Mobile experience**: Defer to v2, or basic responsive support in v1?

---

## 7. Approval

- [ ] UX decisions approved
- [ ] UI decisions approved
- [ ] Component inventory approved
- [ ] Ready for `/trilogy.mockup` or `/speckit.plan`

---

**Next Steps**:
- `/trilogy.mockup` → Generate detailed ASCII wireframes for key screens
- `/speckit.plan` → Create implementation plan with task breakdown
