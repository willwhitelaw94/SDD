# Design Challenge Brief: OHB Bill Processor Cockpit

## Challenge Overview

Design the bill processor's daily workspace — a cockpit-like IDE experience for processing 5-6K bills/day with multi-issue diagnosis, department routing, and consolidated communications. This is where bill processors live all day.

## Feature Summary

The On Hold Bills (OHB) flow replaces the current single-reason on-hold model with multi-issue tracking. Bill processors need to:
- See ALL issues with a bill at once (not discover them one at a time)
- Route issues to departments (Care/Compliance/Accounts) in parallel
- Track resolution progress via traffic-light checklist
- Determine communication type (REJECT-RESUBMIT / REJECT PERIOD / ON HOLD)
- Send one consolidated message to the supplier
- Manage Day 0→3→7→10 cadence for ON HOLD bills
- Process bills rapidly — this is a high-volume, all-day workflow

## User Stories to Address

1. **US1 (P1)**: Multi-Issue Diagnosis — see all issues upfront, not one at a time
2. **US2 (P1)**: AI Auto-Reject — 99% confidence disqualifiers instantly rejected
3. **US3 (P2)**: Department Routing — parallel task assignment to Care/Compliance/Accounts
4. **US5 (P2)**: Three Communication Types — clear comms determination from batch
5. **US6 (P3)**: Cadence Management — Day 0→3→7→10 with timeout
6. **US8 (P3)**: Can Coexist Filter — dominant blockers suppress irrelevant fixable issues

## Screens to Design

Each student designs ALL 5 screens from their paradigm:

### 1. Bill Edit IDE (Main Cockpit)
The primary workspace. Three-panel layout:
- **Left**: Documents, Notes, Activity (collapsible)
- **Center**: Bill canvas (supplier info, recipient, invoice details, line items)
- **Right**: Checklist panel (traffic-light: BLOCKING/COMPLETE/WARNINGS)
- **Bottom**: Sticky footer with totals + primary actions (Approve, On Hold, Reject)
- **Top**: Header with bill number, stage badge, assign dropdown

Key interactions:
- Supplier/recipient sections collapsed by default, expandable via toggle
- Checks panel consolidates ALL validation checks (not scattered across the page)
- On-hold reasons directly linked to checks (failed check = on-hold reason)
- Multi-select for on-hold reasons
- Hotkey support for power users
- Polling with "Updated X ago" indicator

### 2. Reason Modal (Focused Resolution)
When a department user clicks a task notification or a processor clicks a reason:
- Reason name, status, department owner
- Diagnosed by (AI/human) and when
- Resolution notes textarea
- Mark Resolved / Mark Unresolved buttons
- "View Full Bill" escape hatch link
- Department action description
- Can Coexist context (what this reason blocks/unblocks)

### 3. Bills Index (On-Hold Queue)
Enhanced bills table for processing managers:
- Existing CommonTable pattern extended
- New columns: On-Hold Reason Groups, Issue Count, Cadence Day, Comms Type
- Filters: by reason category, department, cadence status
- Batch actions: bulk assign, bulk approve (for all-clear bills)
- Visual indicators for overdue cadence (Day 7+), auto-rejected, awaiting department

### 4. BP Dashboard (Bill Processing Dashboard)
Bill processing manager/team member dashboard:
- KPI cards: Total On Hold, Awaiting Department, Day 7+ Overdue, Auto-Rejected Today
- Queue breakdown by department (Care/Compliance/Accounts)
- "My assigned bills" quick list
- Reason category heatmap (which reasons appear most)
- Recent activity feed

### 5. Department Queue (Task View)
When a department user (Care/Compliance/Accounts) views their assigned OHB tasks:
- Filtered task list showing only their department's reasons
- Each task shows: bill ref, reason name, diagnosed date, urgency
- Quick action: Mark Resolved/Unresolved inline without opening modal
- Drill-through to full bill via "View Bill" link
- Grouped by priority: Overdue → Urgent → Normal

## Constraints

- Desktop-first (dual monitor workflow common)
- High frequency, all-day processing — speed and keyboard shortcuts matter
- 5-6K bills/day, 150-180K/month — must handle scale
- Traffic-light colours: BLOCKING=red, COMPLETE=green, WARNINGS=amber, IN_PROGRESS=blue, AWAITING=purple
- Client-specific details never shown to suppliers (but this is the internal view — processors see everything)
- Must use TC Portal design system (teal-700, primary-blue-700, CommonTable, CommonBadge, etc.)

## Existing IDE Branch Reference

The `feat/bill-edit-v2-ide` branch already implements:
- Three-panel layout with collapsible panels
- Consolidated checks in right sidebar
- Sticky footer with totals
- Collapsed supplier/recipient sections
- Multi-select on-hold reasons
- Assign dropdown in header
- Save/discard with dirty state tracking

Students should build on this direction but bring their own paradigm's perspective.

## Evaluation Criteria

1. **Speed** — How fast can a processor triage and act on a bill? (50+ bills/hour target)
2. **Information Density** — How much useful info fits without overwhelming?
3. **Keyboard-First** — Can a power user work entirely from keyboard?
4. **Scalability** — Does it work for 1 issue or 12 issues per bill?
5. **Glanceability** — Can you understand bill status in <2 seconds?

## Students

| Student | Theme | Focus |
|---------|-------|-------|
| Linear Lisa | **Linear** | Clean minimal UI, command palette, keyboard shortcuts |
| Notion Nick | **Notion** | Database views, inline editing, flexible layouts |
| GitHub Gary | **GitHub** | Review workflow, timeline, status badges, batch actions |
| Superhuman Sam | **Superhuman** | Speed-first, triage workflow, keyboard navigation |

## Deliverables Per Student

1. `research.md` — 3-5 patterns from their paradigm relevant to bill processing
2. `rationale.md` — Why these patterns work for the OHB cockpit
3. 5 HTML mockup pages (one per screen) with portal shell
