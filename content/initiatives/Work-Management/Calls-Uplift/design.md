---
title: "Design Brief: Calls Uplift"
status: Clarified
created: 2026-02-26
updated: 2026-03-05
---

# Design Brief: Calls Uplift

**Epic:** CALLS-UPLIFT (CUL)
**Spec:** [spec.md](spec)
**Scope:** Calls Index (inbox + review workflow). Call Bridge UI dropped from Phase 1.
**Mockup:** [calls-uplift-mockups.vercel.app](https://calls-uplift-mockups.vercel.app/01-calls-table-view.html)

---

## User Context

| Aspect | Answer | Impact on Design |
|--------|--------|------------------|
| Primary User | Care Partner / Coordinator (internal, with Aircall) | Needs fast review workflow — review, link, complete, next |
| Secondary User | Team Leader | Needs team-wide view + act-on-behalf. Filter by coordinator |
| Tertiary User | External Coordinator (no Aircall) | View-only call history on packages. No inbox access |
| Device Priority | Desktop-first (Portal) | Table layout, keyboard shortcuts |
| Usage Frequency | Daily — multiple times per day | Optimise for throughput: review many calls quickly |
| Context | Post-call admin, often batched at end of day | Fast individual review with "Review Next" option |

**Key Insight:** 250+ coordinators, 66% of calls untagged. The design must make "link + review" so frictionless that it's faster than skipping it.

---

## Design Principles

**North Star:** *Make every call count — link it, log it, move on.*

**Supporting Principles:**
1. **Speed over completeness** — A call linked to a package in 3 seconds is better than a perfectly annotated one that takes 2 minutes. Defaults should be right 80% of the time.
2. **Suggest, don't block** — Previously-linked numbers surface as suggestions, AI case notes pre-fill, but nothing auto-saves. Coordinator always confirms.
3. **Progressive disclosure** — Show caller + direction + package on the table. Transcription, notes, and actions only appear in the review drawer.
4. **Click-to-review** — Clicking a row opens the review drawer. No separate "Review" button needed. Minimise clicks to complete.

---

## Build Size

**Size:** Medium

**Rationale:**
- 1 primary screen (Calls Index table)
- 1 review drawer (slide-from-right Inertia modal)
- 1 secondary screen (Package timeline call history)
- Reuses existing components: `CommonTable`, `CommonTabs`, `CommonBadge`, `CommonAvatar`, `CommonButton`
- New patterns: full-height drawer modal, notification badge polling, inline entity search
- Integrations: Aircall webhooks (existing), Graph webhooks (new)

---

## Scope

### MVP (Phase 1)
- Calls Index page with `CommonTable` (no split-view)
- Call Review via full-height drawer modal (slide-from-right, Inertia modal with deferred props)
- 6 review statuses: `pending_transcription` → `pending_review` → `in_review` → `reviewed` | `archived` | `escalated`
- Package/entity linking via inline search in drawer (grouped results by type)
- AI case note pre-fill from Graph (display only, no Portal-side AI)
- Escalation to team leader via nested confirmation dialog
- Team leader view (filter by coordinator, act on behalf)
- Notification badge in top nav (`pending_review` count, polled every 60s)
- Sidebar nav item under "Communication" section
- Missed calls in inbox with indicator (Archive/Link only, no Complete Review)
- Call history on package Timeline tab (view-only for external coordinators)
- "Review Next" option after completing a review (success state in drawer)

### Deferred
- Batch "Complete All" for linked calls — Phase 2
- Browser push notifications — Phase 2 (MVP uses in-app toast via polling only)
- Call Bridge UI (real-time context during active calls) — Phase 2
- Call notes during active call — Phase 2
- Call recordings playback — Phase 3
- Outbound call initiation from Portal — out of scope
- Mobile — out of scope
- Reporting dashboards — separate initiative

### Feature Flags
- `calls-inbox-v1` — Gates access to the Calls Index page. Rollout: user-level first (beta testers), then team-level via PostHog targeting.

---

## Navigation

From [CWD - Threads Figma](https://www.figma.com/design/j22eTAvr3HqEVNI9CkIqHT/CWD---Threads) (`3:16501`):

```
[Dashboard icon] Dashboard
[Task icon] Tasks and reminders

COMMUNICATION
  [Phone icon] Calls       <-- Calls Index lives here
  [Thread icon] Threads

OPERATIONS
  [Plan icon] Service plans
  [Bill icon] Bills

CARE CIRCLE
  [Person icon] Clients
  [People icon] Care Coordinators
  [Building icon] Suppliers
```

- Calls sits **above** Threads in the Communication section
- Phone icon: `heroicons-outline/phone`
- Notification badge in top nav bar showing `pending_review` count (same pattern as existing notification bell, polled every 60 seconds)

---

## Screen Designs

### Calls Index Page (Table)

**Reference page:** Bills Index — closest existing pattern (table with status tabs, filters).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Calls                                                              [12]     │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Pending 12] [Reviewed] [Archived] [Escalated 2]                           │
│                                                                             │
│ [All directions ▼]  [All links ▼]           [Search: phone/name]           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Caller              Direction   Duration   Linked To        Date          │
│  ─────────────────────────────────────────────────────────────────────────  │
│  [JD] John Davis     Inbound     12:34      Sarah Johnson    Mar 5, 1:12PM │
│       0412 345 678                           SJ-123456                      │
│                                                                             │
│  [BJ] Betty James    Inbound     8:22       Unlinked         Mar 5, 11:24  │
│       0413 456 789                                                          │
│                                                                             │
│  [SW] Susan White    Missed      —          Unlinked         Mar 5, 11:15  │
│       0414 567 890              [No transcript]                             │
│                                                                             │
│  [ML] Mark Lee       Outbound    5:10       Beth Poultney    Mar 5, 10:30  │
│       0415 678 901                           BP-654321                      │
│                                                                             │
│                              Showing 1-7 of 12 calls                        │
│                              [← Previous] [1] [2] [Next →]                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Table Columns
- **Caller**: `CommonAvatar` (24px, initials) + name + phone number
- **Direction**: `CommonBadge` — teal for Inbound/Outbound, red for Missed
- **Duration**: MM:SS format. Missed calls show "—". Calls without transcript show grey "No transcript" badge
- **Linked To**: Package/entity name + ID. "Unlinked" in orange if not linked
- **Date**: Timestamp, relative for today ("1:12 PM"), full date for older

#### Interactions
- **Click row**: Opens review drawer (full-height, slide-from-right)
- **Status tabs**: Pending (with count badge), Reviewed, Archived, Escalated (with count)
- **Filters**: Direction dropdown (All/Inbound/Outbound/Missed), Link status (All/Linked/Unlinked)
- **Sort**: Date (newest first default), duration
- **Search**: Phone number, package name, caller name
- **Team leaders**: Additional coordinator filter dropdown
- **Pagination**: Server-side, 25 per page via `CommonTable`

#### Row States
- **Normal**: Full contrast, clickable
- **Locked (in_review)**: Clicking shows inline toast "This call is being reviewed by [Name]". Row not openable.
- **Missed**: Red "Missed" badge in Direction column, no duration
- **No transcript**: Grey "No transcript" badge next to duration

### Call Review Drawer (Slide-from-Right Modal)

Full-height drawer modal, ~50-60% viewport width. Table dimmed behind. Inertia `modal()` with deferred props.

```
┌──────────────────────────────────────────────────┐
│  ← Back                                    [×]   │
│                                                   │
│  [JD] John Davis → Beth Poultney                 │
│  Inbound · 12:34 · Mar 5, 2026 1:12 PM          │
│                                                   │
│  Package: Sarah Johnson - SJ-123456              │
│  [Link to...] ← inline search (if unlinked)     │
│                                                   │
│  ─────────────────────────────────────────────── │
│                                                   │
│  Duration                                         │
│  Call time: [12:34]  Wrap-up: [15:00]            │
│  Total: 27:34                                     │
│                                                   │
│  ─────────────────────────────────────────────── │
│                                                   │
│  Transcription                                    │
│  ┌─────────────────────────────────────────────┐ │
│  │ "Hi Beth, I've attached a copy of my        │ │
│  │ mother's care plan. Could you review the    │ │
│  │ medication schedule? She's been having       │ │
│  │ trouble with the morning doses..."          │ │
│  │                                              │ │
│  │ [scrollable if long]                         │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  AI Summary                                  [×] │
│  ┌─────────────────────────────────────────────┐ │
│  │ │ Reviewed John Davis email regarding       │ │
│  │ │ reimbursement for a $120 invoice from     │ │
│  │ │ Active Recovery Physio (dated 15 Oct).    │ │
│  │ │                                           │ │
│  │ │ Task created to review invoice, code to   │ │
│  │ │ the correct line item, and process        │ │
│  │ │ reimbursement through the package budget. │ │
│  └─────────────────────────────────────────────┘ │
│  [☆ REGENERATE]   [SAVE AS NOTE]                  │
│                                                   │
│  Tasks                                            │
│  ┌─────────────────────────────────────────────┐ │
│  │ ☆ Review and process physio bill         [+]│ │
│  │   reimbursement for John Davis              │ │
│  ├─────────────────────────────────────────────┤ │
│  │ ☆ Save invoice to John's file            [+]│ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  AI Case Note                                     │
│  ┌─────────────────────────────────────────────┐ │
│  │ [Editable text area pre-filled with Graph   │ │
│  │  AI summary. Coordinator can edit freely.   │ │
│  │  Nothing saved until confirm.]              │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ═══════════════════════════════════════════════ │
│  [Archive]  [Escalate]          [Complete Review] │
│                                  ← sticky footer  │
└──────────────────────────────────────────────────┘
```

#### Drawer Content (scrollable body)
- **Header** (pinned): Caller → Recipient, direction badge, duration, timestamp
- **Package link**: Shows linked package or "Link to..." inline search
- **Duration**: Two fields — call time (read-only from Aircall) + wrap-up time (editable, default 15 min). Total computed.
- **Transcription**: Full text from Graph (read-only, scrollable). If no transcript: "Transcription unavailable" indicator.
- **AI Summary**: Graph-provided summary in a blockquote-style container. Dismissable (×). Below it: `REGENERATE` button (re-calls Graph) + `SAVE AS NOTE` button (saves summary as package case note).
- **Tasks**: AI-suggested tasks from Graph. Each task shows title with star icon + `+` button. Clicking `+` instantly creates the task in the Tasks system, linked to the call's package. Yellow/amber card styling. Tasks section only appears if Graph provided suggestions.
- **AI Case Note**: Pre-filled from Graph, editable `CommonTextArea`. Nothing saved until Complete Review confirm.

#### Sticky Footer Actions
- **Complete Review** (primary button): Logs activity, saves case note, marks as `reviewed`
- **Archive** (secondary): Dismisses call (no reason required)
- **Escalate** (secondary): Opens nested confirmation dialog (TL dropdown + required note)

#### Post-Review Success State
After completing a review, the drawer content replaces with a success state:
```
┌──────────────────────────────────────────────────┐
│                                                   │
│              ✓ Call Reviewed                      │
│                                                   │
│  Activity logged: 27:34 to Sarah Johnson         │
│  Case note saved                                  │
│                                                   │
│  [Close]              [Review Next →]             │
│                                                   │
└──────────────────────────────────────────────────┘
```
- **Close**: Closes drawer, refreshes table
- **Review Next**: Loads next pending call in the drawer

#### Missed Call Drawer
Same layout but with differences:
- Duration section hidden (no call duration)
- "Missed call — no activity to log" info message
- Footer: **Archive** and **Link to...** only. No **Complete Review**.

#### Escalation Dialog (nested on drawer)
Small `CommonModal` confirmation dialog:
```
┌────────────────────────────────────┐
│  Escalate Call                     │
│                                    │
│  Team Leader: [Select TL ▼]       │
│                                    │
│  Note (required):                  │
│  ┌──────────────────────────────┐ │
│  │                              │ │
│  └──────────────────────────────┘ │
│                                    │
│  [Cancel]         [Escalate]       │
└────────────────────────────────────┘
```

#### Link Search (inline in drawer)
When "Link to..." is clicked, an inline search field expands:
```
  Package: [Search packages, coordinators, providers...  ]
  ┌─────────────────────────────────────────────┐
  │  SUGGESTED                                   │
  │  📦 Sarah Johnson - SJ-123456  (Package)    │
  │                                              │
  │  PACKAGES                                    │
  │  📦 Beth Poultney - BP-654321               │
  │  📦 Mark Williams - MW-112233               │
  │                                              │
  │  COORDINATORS                                │
  │  👤 Jane Smith                               │
  │                                              │
  │  PROVIDERS                                   │
  │  🏢 Sunrise Home Care                        │
  └─────────────────────────────────────────────┘
```
- Previously-linked entity pinned at top as "Suggested"
- Results grouped by type with type labels
- Selecting an entity immediately links and updates the header

#### Drawer Loading State
- Drawer opens immediately with **skeleton content**: header skeleton, duration skeleton, transcription block skeleton, note skeleton
- Sticky footer buttons visible but **disabled** during load
- Uses Inertia v2 deferred props pattern

### Inline Call Card (in Threads timeline)

When a call appears in a Thread:

```
[Phone icon]  [Avatar] [Caller Name]
              [Inbound Call] [Phone icon] [+1 (555) 123-4567]
```

- "Inbound Call" / "Outbound Call": teal text `#007f7e`
- Phone icon in left gutter: 16px, `#666`
- White background, simple — just caller + direction + number

### Package Timeline (call history)

Calls appear in the client profile **Timeline** tab:
```
[Client Name] [▼]  Profile  Care Plan  Services  Billing  Timeline  [NOTES] [TASKS]
```
- External coordinators (no Aircall) see view-only call history here
- Each call shows: date, duration, direction, caller/recipient, linked status
- Clicking a call shows detail but no review actions for external coordinators

---

## Constraints

### Interaction Model
- **Complete Review**: Drawer shows success state with "Close" and "Review Next" buttons. Table refreshes on close. Toast "Call reviewed".
- **Escalate**: Nested dialog on drawer. Wait for server (toast on success). Drawer shows "Escalated to [TL name]" banner.
- **Archive**: Optimistic — drawer closes, row disappears from list. Toast "Call archived" with undo link (5 seconds).
- **Link**: Optimistic — inline search results, selecting links immediately. Header updates.
- **Concurrent review**: Row blocked from opening. Inline toast "This call is being reviewed by [Name]".

### Accessibility
- WCAG Target: Level AA
- Keyboard navigation: Required — tab through call list, Enter to open drawer, Escape to close
- Screen reader: Call list rows must have descriptive aria-labels (caller, direction, status)
- Drawer: Focus trap when open, restore focus on close

### Security & Privacy
- Call recordings: Gated by `view-call-recordings` permission (role-based)
- Transcriptions: Visible to anyone with Calls Inbox access (same as call content)
- External coordinators: View-only history on assigned packages only
- Recording retention: 7 years (compliance, handled at storage layer)

### Loading States
- **Initial page load**: Skeleton rows (5-6 placeholder rows in table). Use Inertia v2 deferred props pattern.
- **Drawer load**: Skeleton content matching layout (header, duration, transcription, note). Buttons disabled.
- **Transcription section**: Skeleton block if transcription still pending.
- **Complete Review**: No spinner — drawer transitions to success state.

### Dependencies
- **Depends on**: Aircall webhooks (existing), Graph transcription webhook (ready), Care Management Activities module (complete)
- **Blocks**: Threads integration (calls in thread timeline)
- **Blocked by**: Nothing — Graph is ready, Aircall integration exists

---

## Edge Cases

| Edge Case | How to Handle | Priority |
|-----------|---------------|----------|
| No Aircall account | Page loads but shows empty state with CTA: "Connect your Aircall account to see calls" | P1 |
| Transcription never arrives | Auto-transition after 24h. Grey "No transcript" badge. Coordinator can still review and link. | P1 |
| Shared phone number (multiple packages) | Show selection list in link search. Previously-linked entity at top as suggestion. Always require explicit selection. | P1 |
| Missed call | Red "Missed" badge, no duration. Drawer shows Archive/Link only, no Complete Review. | P1 |
| Call not linked to any entity | Coordinator can Archive or Link. Cannot complete review without linking. | P1 |
| Concurrent review (in_review lock) | Row blocked from opening. Toast "Being reviewed by [Name]". 10 min auto-release. | P2 |
| Very short call (<30 seconds) | Still appears in inbox. "Short call" indicator in table. | P2 |
| Coordinator closes drawer without completing | Reverts from `in_review` to `pending_review`. No data lost. | P1 |
| Call transferred between coordinators | Original coordinator's time logged separately. Each coordinator sees their portion. | P3 |
| Large inbox (500+ pending calls) | Pagination via `CommonTable`. Default 25 per page. | P2 |
| Team leader reviews on behalf | Review attributed to TL as `reviewed_by`. Original coordinator still shows as call handler. | P1 |
| Escalation with no available TL | Escalate still works — sits in TL's queue. Toast sent regardless. | P2 |

---

## Design Tokens (shared with Threads)

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Teal | `#007f7e` | Direction badges, active nav, primary buttons |
| Light Teal BG | `#bae8e7` | Status badges, selection highlight |
| Red/Error | `#be373c` | Missed call badge, unlinked indicator |
| Primary Text | `#13171d` | Caller name, phone number, content |
| Secondary Text | `#666` | Timestamps, metadata, labels |
| Border | `#dbdbdb` | Row separators, input borders |
| White | `#ffffff` | Card backgrounds |

---

## Component Mapping

| Element | TC Portal Component | Notes |
|---------|-------------------|-------|
| Call list | `CommonTable` | Standard table with sorting, pagination |
| Status tabs | `CommonTabs` | `:items` prop with count badges |
| Direction badge | `CommonBadge` | Teal for inbound/outbound, red for missed |
| Avatar | `CommonAvatar` | 24px, caller initials |
| Entity link search | Inline search field | Grouped dropdown results (Package/Coordinator/Provider) |
| Review drawer | Inertia `modal()` | Full-height, slide-from-right, ~50-60% width |
| Duration inputs | `CommonTextInput` | Two fields: call time (read-only) + wrap-up time (editable) |
| AI summary section | Blockquote container | Graph summary + REGENERATE + SAVE AS NOTE buttons |
| AI suggested tasks | `AiSuggestedTasks.vue` | Yellow cards with star icon + instant-add (+) button. Integrates with Tasks MVP domain |
| AI case note | `CommonTextArea` | Pre-filled from Graph, editable |
| Action buttons | `CommonButton` | Primary: Complete Review. Secondary: Archive, Escalate |
| Escalation dialog | `CommonModal` (nested) | Small dialog: TL dropdown + note field |
| Notification badge | Existing notification pattern | Badge count in top nav, polled every 60s |
| Filter dropdowns | `CommonSelectMenu` | Direction filter, link status filter |

---

## Clarification Log

### Session 2026-02-27 (Design Lens)

| Question | Decision |
|----------|----------|
| After Complete Review, what happens to the panel? | Auto-advance to next pending call. Green flash on completed row. Empty state with success if no more pending. |
| Batch: one-click Complete All vs step-through? | Both modes — "Complete All" for quick batch (linked only), "Batch Review" for step-through sequential review. |
| Feedback style for Complete Review? | Optimistic + toast. Row moves immediately, green toast "Call reviewed". Revert on server failure. |
| Reference page for developer implementation? | Bills Index — closest existing pattern (table + status tabs + detail panel). |
| Loading state on initial page load? | Skeleton rows (5-6 placeholders) in call list + skeleton detail panel. Inertia v2 deferred props. |

### Session 2026-03-05 (Design Lens — post dev clarification)

| Question | Decision |
|----------|----------|
| Modal style for review detail? | Full-height drawer — slides from right, full viewport height, ~50-60% width. Table dimmed behind. Inertia modal infrastructure. |
| How should "Review Next" be offered? | Success state in drawer with two buttons: "Close" and "Review Next". Drawer stays open until coordinator decides. |
| Escalation UI within drawer? | Nested confirmation dialog (small CommonModal) on top of drawer. TL dropdown + required note field. |
| How to open review from table? | Click row — no separate "Review" button. Clicking anywhere on row opens drawer. |
| Drawer content structure? | Scrollable body with sticky footer. Header pinned. Actions (Complete, Archive, Escalate) always visible in footer. |
| Missed call actions? | Archive or Link only. No "Complete Review" for missed calls. Show "Missed call — no activity to log" message. |
| Concurrent review lock UX? | Block from opening. Inline toast "This call is being reviewed by [Name]". Row not openable. |
| pending_transcription vs pending_review visual? | Same visual in Pending tab. Calls without transcript show grey "No transcript" badge next to duration. |
| Drawer loading state? | Skeleton content matching layout. Buttons visible but disabled. Deferred props pattern. |
| Entity linking search pattern? | Inline search field in drawer. Results in grouped dropdown (Package/Coordinator/Provider). Previously-linked entity pinned as "Suggested". |

### Key Changes from Dev Clarification (2026-03-05)

| Original Design | Updated Design | Reason |
|-----------------|----------------|--------|
| Split-view (list + detail panel) | Table + full-height drawer modal | Simpler implementation, standard Inertia modal pattern |
| Batch "Complete All" in Phase 1 | Deferred to Phase 2 | Reduce MVP scope |
| Browser push notifications | In-app toast via polling (60s) | No Laravel Echo/broadcasting infrastructure |
| Auto-advance after review | Success state with Close/Review Next buttons | More control for coordinator |
| Checkboxes for batch select | Removed from Phase 1 | No batch operations in MVP |

---

## Next Steps

- [ ] Update mockup to reflect drawer modal pattern (replace split-view)
- [ ] `/trilogy-design-handover` — Gate 2 (Design → Dev)
- [ ] `/speckit-tasks` — Generate implementation tasks
