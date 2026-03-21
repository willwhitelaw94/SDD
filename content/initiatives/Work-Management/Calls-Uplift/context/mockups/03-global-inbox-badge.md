---
title: "Mockup: Global Inbox Badge"
---

# Mockup: Global Inbox Badge (Header Component)

## Overview

The Global Inbox Badge appears in the main header navigation, providing coordinators with quick visibility into unreviewed calls and a dropdown preview to access them without navigating away from their current page.

---

## Header Integration

```
+====================================================================================+
|                                                                                    |
|  +-- TC PORTAL HEADER ----------------------------------------------------------+  |
|  |                                                                              |  |
|  |  [TC Logo]   Dashboard | Packages | Work | CALLS    [Search]  [Bell]  [Avatar]  |
|  |                                            ^                    ^            |  |
|  |                                            |                    |            |  |
|  |                                     +------+                    |            |  |
|  |                                     |                           |            |  |
|  |                              CALLS NAV ITEM              INBOX BADGE         |  |
|  |                              (with badge)                (clickable)         |  |
|  |                                                                              |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
+====================================================================================+
```

---

## Badge States

### State 1: No Unreviewed Calls

```
+-- HEADER SECTION (no badge) -------------------------------------------------+
|                                                                              |
|  Dashboard | Packages | Work | Calls                     [Search] [Bell] [AV]|
|                                                                    ^         |
|                                                                    |         |
|                                                          (no badge shown)    |
|                                                                              |
+------------------------------------------------------------------------------+
```

### State 2: Unreviewed Calls (1-9)

```
+-- HEADER SECTION (with count badge) -----------------------------------------+
|                                                                              |
|  Dashboard | Packages | Work | Calls                     [Search] [Bell] [AV]|
|                                  [3]                               [5]       |
|                                   ^                                 ^        |
|                                   |                                 |        |
|                           Red badge with count          Notification badge   |
|                           (Calls inbox count)           (Other notifications)|
|                                                                              |
+------------------------------------------------------------------------------+

Badge Styling:
- Background: Red (#EF4444 / Tailwind red-500)
- Text: White, bold, 11px
- Shape: Rounded pill
- Position: Top-right of "Calls" text
- Size: 18px width minimum, height 18px
```

### State 3: Unreviewed Calls (10+)

```
+-- HEADER SECTION (with 9+ badge) --------------------------------------------+
|                                                                              |
|  Dashboard | Packages | Work | Calls                     [Search] [Bell] [AV]|
|                                 [9+]                                         |
|                                   ^                                          |
|                                   |                                          |
|                         Shows "9+" when count >= 10                          |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Dropdown Preview (on click)

When the user clicks on "Calls" with the badge, a dropdown appears showing recent unreviewed calls:

```
+-- HEADER WITH DROPDOWN OPEN -------------------------------------------------+
|                                                                              |
|  Dashboard | Packages | Work | Calls                     [Search] [Bell] [AV]|
|                                 [3]                                          |
|                                  |                                           |
|                                  v                                           |
|  +-- CALLS DROPDOWN PREVIEW ---------------------------------------------+   |
|  |                                                                       |   |
|  |  UNREVIEWED CALLS (3)                              [View All Calls]   |   |
|  |  -----------------------------------------------------------------   |   |
|  |                                                                       |   |
|  |  +-- CALL PREVIEW ROW (clickable) --------------------------------+  |   |
|  |  |                                                                 |  |   |
|  |  |  [->] John Smith                              4:32 PM | 12:45  |  |   |
|  |  |       +61 400 123 456                                          |  |   |
|  |  |       Package: #12345 - Mary Johnson                           |  |   |
|  |  |                                                      [Review]  |  |   |
|  |  |                                                                 |  |   |
|  |  +-----------------------------------------------------------------+  |   |
|  |                                                                       |   |
|  |  +-- CALL PREVIEW ROW (clickable) --------------------------------+  |   |
|  |  |                                                                 |  |   |
|  |  |  [<-] Sarah Williams                          3:15 PM | 8:22   |  |   |
|  |  |       +61 412 555 789                                          |  |   |
|  |  |       Package: #12398 - Robert Chen                            |  |   |
|  |  |                                                      [Review]  |  |   |
|  |  |                                                                 |  |   |
|  |  +-----------------------------------------------------------------+  |   |
|  |                                                                       |   |
|  |  +-- CALL PREVIEW ROW - UNLINKED (clickable) ---------------------+  |   |
|  |  |                                                                 |  |   |
|  |  |  [->] Unknown Caller                          2:45 PM | 3:10   |  |   |
|  |  |       +61 421 000 111                                          |  |   |
|  |  |       [!] No package linked                                    |  |   |
|  |  |                                                      [Review]  |  |   |
|  |  |                                                                 |  |   |
|  |  +-----------------------------------------------------------------+  |   |
|  |                                                                       |   |
|  |  -----------------------------------------------------------------   |   |
|  |                                                                       |   |
|  |  [View All Calls ->]                                                  |   |
|  |                                                                       |   |
|  +-----------------------------------------------------------------------+   |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Dropdown Empty State

```
+-- CALLS DROPDOWN PREVIEW (EMPTY) --------------------------------------------+
|                                                                              |
|  CALLS INBOX                                              [View All Calls]   |
|  ----------------------------------------------------------------------------
|                                                                              |
|                     [Checkmark Icon]                                         |
|                                                                              |
|                     All caught up!                                           |
|                     No calls awaiting review.                                |
|                                                                              |
|  [View Call History ->]                                                      |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Badge Animation States

### New Call Arrives

```
+-- BADGE ANIMATION SEQUENCE --------------------------------------------------+
|                                                                              |
|  Frame 1: Current state                                                      |
|  Calls [2]                                                                   |
|                                                                              |
|  Frame 2: Badge pulses (scale 1.0 -> 1.2 -> 1.0)                            |
|  Calls [2]  ->  Calls [2]  ->  Calls [3]                                    |
|        ^            ^              ^                                         |
|      normal       pulse          updated                                     |
|                                                                              |
|  Animation: 300ms ease-in-out                                                |
|                                                                              |
+------------------------------------------------------------------------------+
```

### Badge Attention Pulse (Optional)

For high-priority calls or when count increases:

```
+-- ATTENTION PULSE -----------------------------------------------------------+
|                                                                              |
|  Calls [3]                                                                   |
|        ^^^                                                                   |
|        |||                                                                   |
|  Subtle red glow pulse animation                                             |
|  Duration: 2 seconds                                                         |
|  Repeat: 3 times then stop                                                   |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Interaction Flow

```
+-- INTERACTION FLOW DIAGRAM --------------------------------------------------+
|                                                                              |
|  1. USER SEES BADGE                                                          |
|     +--------+                                                               |
|     | Calls  |                                                               |
|     |  [3]   | <-- Red badge indicates 3 unreviewed calls                   |
|     +--------+                                                               |
|         |                                                                    |
|         v (click)                                                            |
|                                                                              |
|  2. DROPDOWN OPENS                                                           |
|     +------------------------+                                               |
|     | UNREVIEWED CALLS (3)   |                                               |
|     | +--------------------+ |                                               |
|     | | Call 1    [Review] | |                                               |
|     | +--------------------+ |                                               |
|     | | Call 2    [Review] | |                                               |
|     | +--------------------+ |                                               |
|     | | Call 3    [Review] | |                                               |
|     | +--------------------+ |                                               |
|     | [View All Calls ->]    |                                               |
|     +------------------------+                                               |
|         |           |                                                        |
|         v           v (click "View All")                                     |
|  (click Review)                                                              |
|         |           +------------------------+                               |
|         |           | Navigates to           |                               |
|         |           | /staff/calls page      |                               |
|         |           +------------------------+                               |
|         v                                                                    |
|                                                                              |
|  3. MODAL OPENS (stays on current page)                                      |
|     +----------------------------------+                                     |
|     | CALL REVIEW MODAL                |                                     |
|     | [Full review interface]          |                                     |
|     +----------------------------------+                                     |
|         |                                                                    |
|         v (complete review)                                                  |
|                                                                              |
|  4. BADGE UPDATES                                                            |
|     +--------+                                                               |
|     | Calls  |                                                               |
|     |  [2]   | <-- Count decremented                                        |
|     +--------+                                                               |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Real-time Updates

```
+-- REAL-TIME UPDATE BEHAVIOR -------------------------------------------------+
|                                                                              |
|  WEBSOCKET EVENTS:                                                           |
|                                                                              |
|  Event: "call.transcription.ready"                                           |
|  Action: Increment badge count, show flash alert                             |
|                                                                              |
|  Event: "call.reviewed"                                                      |
|  Action: Decrement badge count                                               |
|                                                                              |
|  Event: "call.reviewed" (by another tab/device)                              |
|  Action: Sync badge count, remove from dropdown if open                      |
|                                                                              |
|  UPDATE BEHAVIOR:                                                            |
|  - Badge updates instantly (optimistic UI)                                   |
|  - Dropdown refreshes on open (not while open)                               |
|  - New calls prepend to dropdown list                                        |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Mobile/Responsive Notes

- **Desktop (1200px+)**: Full dropdown as shown
- **Tablet (768-1199px)**: Dropdown may be narrower, show 2-3 calls max
- **Mobile**: Badge visible but dropdown links directly to /staff/calls

---

## Component Specification

### New Component: `CallInboxBadge.vue`

```
+-- COMPONENT PROPS -----------------------------------------------------------+
|                                                                              |
|  Props:                                                                      |
|  - unreviewedCount: number (from store/API)                                  |
|                                                                              |
|  Emits:                                                                      |
|  - @review-click(callId): Opens review modal                                 |
|  - @view-all: Navigates to /staff/calls                                      |
|                                                                              |
|  Internal State:                                                             |
|  - isDropdownOpen: boolean                                                   |
|  - recentCalls: Call[] (fetched on dropdown open)                            |
|                                                                              |
+------------------------------------------------------------------------------+
```

### Component Structure

```vue
<template>
  <div class="calls-inbox-badge">
    <!-- Nav Link with Badge -->
    <button @click="toggleDropdown" class="nav-link">
      Calls
      <span v-if="unreviewedCount > 0" class="badge">
        {{ unreviewedCount > 9 ? '9+' : unreviewedCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div v-if="isDropdownOpen" class="dropdown">
      <!-- Header -->
      <div class="dropdown-header">
        <span>Unreviewed Calls ({{ unreviewedCount }})</span>
        <Link href="/staff/calls">View All Calls</Link>
      </div>

      <!-- Call List -->
      <div v-for="call in recentCalls" class="call-preview">
        <!-- Call details -->
        <button @click="openReview(call.id)">Review</button>
      </div>

      <!-- Empty State -->
      <div v-if="recentCalls.length === 0" class="empty-state">
        All caught up!
      </div>

      <!-- Footer -->
      <Link href="/staff/calls" class="dropdown-footer">
        View All Calls ->
      </Link>
    </div>
  </div>
</template>
```

---

## Component Mapping (Storybook)

| Element | Component | Props |
|---------|-----------|-------|
| Badge container | `CallInboxBadge` (new) | unreviewedCount |
| Badge pill | Custom styled span | - |
| Dropdown container | `CommonDropdown` | - |
| Call preview rows | Custom styled divs | - |
| Review button | `CommonButton` | size="xs" |
| Empty state | `CommonEmptyPlaceholder` | size="sm" |
