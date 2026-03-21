---
title: "Mockup: Calls Page"
---

# Mockup: Calls Page (`/staff/calls`)

## Overview

The Calls Page is the primary interface for coordinators to manage and review their calls. It provides a table-based view with filtering capabilities and quick access to call review functionality.

---

## Full Page Layout

```
+====================================================================================+
|  [TC Portal Header]                                    [Search] [Bell(3)] [Avatar] |
|  Dashboard | Packages | Work | Calls                                               |
+====================================================================================+
|                                                                                    |
|  +------------------------------------------------------------------------------+  |
|  |  [!] NEW CALL RECEIVED - John Smith (Package #12345) - 4:32 PM    [Review]  |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
|  CALLS INBOX                                                        [+ New Call]   |
|  ============                                                                      |
|                                                                                    |
|  +-- FILTERS -------------------------------------------------------------------+  |
|  |                                                                              |  |
|  |  Date Range          Status              Package            Search           |  |
|  |  [Today      v]      [All         v]     [All       v]     [___________]    |  |
|  |                                                                              |  |
|  |  [x] Show only my calls    [ ] Include archived                             |  |
|  |                                                                              |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
|  +-- SUMMARY STATS -------------------------------------------------------------+  |
|  |  Pending Review: 12  |  Reviewed Today: 34  |  Avg Review Time: 2m 15s      |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
|  +-- CALLS TABLE ---------------------------------------------------------------+  |
|  |                                                                              |  |
|  |  [ ] | DATE/TIME        | DURATION | CALLER/CONTACT    | PACKAGE    | STATUS      | ACTIONS    |
|  |  ----+------------------+----------+-------------------+------------+-------------+------------|
|  |  [ ] | 04 Feb 4:32 PM   | 12:45    | John Smith        | #12345     | [PENDING]   | [Review]   |
|  |      |                  |          | +61 400 123 456   | M. Johnson |             | [...]      |
|  |      |                  |          | [->] Inbound      |            |             |            |
|  |  ----+------------------+----------+-------------------+------------+-------------+------------|
|  |  [ ] | 04 Feb 3:15 PM   | 8:22     | Sarah Williams    | #12398     | [PENDING]   | [Review]   |
|  |      |                  |          | +61 412 555 789   | R. Chen    |             | [...]      |
|  |      |                  |          | [<-] Outbound     |            |             |            |
|  |  ----+------------------+----------+-------------------+------------+-------------+------------|
|  |  [ ] | 04 Feb 2:45 PM   | 3:10     | Unknown Caller    | [UNLINKED] | [PENDING]   | [Review]   |
|  |      |                  |          | +61 421 000 111   | -- Match   |             | [Link]     |
|  |      |                  |          | [->] Inbound      |            |             |            |
|  |  ----+------------------+----------+-------------------+------------+-------------+------------|
|  |  [x] | 04 Feb 1:30 PM   | 15:02    | David Brown       | #12401     | [REVIEWED]  | [View]     |
|  |      |                  |          | +61 433 222 333   | E. Patel   |             | [...]      |
|  |      |                  |          | [<-] Outbound     | (linked)   |             |            |
|  |  ----+------------------+----------+-------------------+------------+-------------+------------|
|  |  [ ] | 04 Feb 12:00 PM  | 0:45     | Emily Chen        | #12387     | [REVIEWED]  | [View]     |
|  |      |                  |          | +61 400 999 888   | J. Nguyen  | (non-pkg)   |            |
|  |      |                  |          | [->] Inbound      |            |             |            |
|  |                                                                              |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
|  +-- PAGINATION ----------------------------------------------------------------+  |
|  |  Showing 1-10 of 46 calls      [< Prev]  1  2  3  4  5  [Next >]             |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
|  +-- BULK ACTIONS (when rows selected) -----------------------------------------+  |
|  |  [x] 3 calls selected     [Complete Reviews]     [Mark Non-Package]          |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
+====================================================================================+
```

---

## Component Breakdown

### Flash Alert Banner

```
+------------------------------------------------------------------------------+
|  [!] NEW CALL RECEIVED - John Smith (Package #12345) - 4:32 PM    [Review]   |
|                                                                   [Dismiss]  |
+------------------------------------------------------------------------------+

States:
- Appears when new call transcription arrives
- Auto-dismisses after 30 seconds OR on user action
- Clicking [Review] opens Call Review Modal
- Shows most recent unreviewed call only
- Multiple alerts stack (max 3 visible)
```

### Filters Panel

```
+-- FILTERS -------------------------------------------------------------------+
|                                                                              |
|  Date Range              Status                Package                       |
|  +----------------+      +----------------+    +----------------+            |
|  | Today        v |      | All          v |    | All          v |            |
|  +----------------+      +----------------+    +----------------+            |
|  | Today          |      | All            |    | All Packages   |            |
|  | Yesterday      |      | Pending        |    | #12345 - Johns |            |
|  | Last 7 days    |      | Reviewed       |    | #12398 - Chen  |            |
|  | Last 30 days   |      | Non-Package    |    | ...            |            |
|  | Custom range   |      +----------------+    +----------------+            |
|  +----------------+                                                          |
|                                                                              |
|  Search                                                                      |
|  +--------------------------------------------------+                        |
|  | [Search by caller name, phone, package...]      |                        |
|  +--------------------------------------------------+                        |
|                                                                              |
|  [x] Show only my calls    [ ] Include archived                              |
|                                                                              |
+------------------------------------------------------------------------------+
```

### Status Badges

```
+-- STATUS BADGE VARIANTS ----------------------------------------------------+
|                                                                             |
|  [PENDING]    - Orange/Amber background, white text                         |
|              - Indicates call needs review                                  |
|                                                                             |
|  [REVIEWED]   - Green background, white text                                |
|              - Indicates call review completed                              |
|                                                                             |
|  [UNLINKED]   - Red/Warning background                                      |
|              - Indicates no package linked                                  |
|                                                                             |
|  (non-pkg)    - Gray text, no badge                                         |
|              - Marked as non-package call                                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Table Row States

```
+-- ROW STATES ---------------------------------------------------------------+
|                                                                             |
|  PENDING ROW (highlighted):                                                 |
|  +-------------------------------------------------------------------------+
|  | [BG: Light amber/yellow highlight]                                      |
|  | Font weight: Semi-bold for caller name                                  |
|  | Actions: [Review] primary button                                        |
|  +-------------------------------------------------------------------------+
|                                                                             |
|  REVIEWED ROW (normal):                                                     |
|  +-------------------------------------------------------------------------+
|  | [BG: White/standard]                                                    |
|  | Font weight: Normal                                                     |
|  | Actions: [View] secondary button                                        |
|  +-------------------------------------------------------------------------+
|                                                                             |
|  UNLINKED ROW (warning):                                                    |
|  +-------------------------------------------------------------------------+
|  | [BG: Light red/pink highlight]                                          |
|  | Package column shows [UNLINKED] badge                                   |
|  | Actions: [Review] + [Link] buttons                                      |
|  +-------------------------------------------------------------------------+
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Call Direction Indicators

```
+-- DIRECTION ICONS ----------------------------------------------------------+
|                                                                             |
|  [->] = Inbound call (arrow pointing right/into)                            |
|       - Shows as teal/blue icon                                             |
|       - Tooltip: "Inbound call received"                                    |
|                                                                             |
|  [<-] = Outbound call (arrow pointing left/out)                             |
|       - Shows as purple icon                                                |
|       - Tooltip: "Outbound call made"                                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Empty State

```
+====================================================================================+
|                                                                                    |
|                              +-----------------------+                             |
|                              |                       |                             |
|                              |    [Phone Icon]       |                             |
|                              |                       |                             |
|                              +-----------------------+                             |
|                                                                                    |
|                              No calls to review                                    |
|                                                                                    |
|                    All your calls have been reviewed. Great work!                  |
|                                                                                    |
|                    Calls will appear here after transcriptions                     |
|                    are processed (usually within 5 minutes).                       |
|                                                                                    |
|                              [View Call History]                                   |
|                                                                                    |
+====================================================================================+
```

---

## Loading State

```
+====================================================================================+
|                                                                                    |
|  +-- CALLS TABLE (SKELETON) ---------------------------------------------------+  |
|  |                                                                              |  |
|  |  [ ] | ████████████     | ████     | █████████████     | ██████   | ████     |  |
|  |      | ░░░░░░░░░░░░     |          | ░░░░░░░░░░░░      |          |          |  |
|  |  ----+------------------+----------+-------------------+----------+----------|  |
|  |  [ ] | ████████████     | ████     | █████████████     | ██████   | ████     |  |
|  |      | ░░░░░░░░░░░░     |          | ░░░░░░░░░░░░      |          |          |  |
|  |  ----+------------------+----------+-------------------+----------+----------|  |
|  |  [ ] | ████████████     | ████     | █████████████     | ██████   | ████     |  |
|  |      | ░░░░░░░░░░░░     |          | ░░░░░░░░░░░░      |          |          |  |
|  |                                                                              |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
|  (████ = Pulsing skeleton bars)                                                    |
|                                                                                    |
+====================================================================================+
```

---

## Responsive Notes

- **Desktop (1200px+)**: Full table as shown above
- **Tablet (768-1199px)**: Condensed columns, hide phone number in main view
- **Mobile**: Out of scope for MVP (desktop-first)

---

## Component Mapping (Storybook)

| Element | Component | Props |
|---------|-----------|-------|
| Page layout | `CommonTable` | sortable, filterable |
| Flash banner | `CommonAlert` | type="info", dismissible |
| Status badges | `CommonBadge` | variant="pending/reviewed" |
| Filters | `CommonDropdown` | - |
| Empty state | `CommonEmptyPlaceholder` | - |
| Pagination | `CommonPagination` | - |
| Action buttons | `CommonButton` | size="sm" |
