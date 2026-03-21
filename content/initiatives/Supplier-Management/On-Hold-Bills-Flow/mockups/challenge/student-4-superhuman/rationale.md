---
title: "Superhuman Pattern Rationale for OHB Cockpit"
---

# Why Superhuman Patterns Work for the OHB Bill Processor Cockpit

_Student: Superhuman Sam | Paradigm: SUPERHUMAN EMAIL | Motto: "Speed is a feature"_

---

## The Core Insight: Bill Processing IS Email Triage

Superhuman was built for one job: process a high volume of incoming items as fast as humanly possible. Bill processing at Trilogy Care is structurally identical:

| Superhuman (Email) | OHB Cockpit (Bills) |
|---|---|
| 200+ emails/day | 5-6K bills/day |
| Read, Reply, Archive, Snooze | Review, Approve, Reject, Hold |
| Split inbox by category | Split queue by department/cadence |
| Keyboard shortcuts for speed | Keyboard shortcuts for speed |
| AI auto-draft replies | AI auto-detect disqualifiers |
| Snooze and remind me later | Cadence management (Day 0/3/7/10) |
| Inbox zero as the goal | Queue zero as the goal |

The paradigm transfer is almost 1:1. Every Superhuman pattern has a direct analogue in bill processing.

---

## Pattern-to-Feature Mapping

### 1. 100ms Rule -> Instant Bill Navigation

**Why it works:** A bill processor opens 200-300 bills per day. At 500ms per load, that is 2.5 minutes of staring at loading spinners. At 50ms, it is effectively zero.

**Applied as:**
- Prefetch the next 3 bills in the queue while the processor reviews the current bill
- Optimistic UI: pressing `A` (Approve) immediately advances to the next bill -- the server processes the approval asynchronously
- No confirmation modals for routine actions (approve, skip) -- only for destructive actions (reject)
- Bill data cached client-side so returning to a previously viewed bill is instant

**Impact on throughput:** Estimated 15-20% increase in bills processed per hour simply by eliminating wait time.

### 2. Split Inbox -> Segmented Bill Queues

**Why it works:** Context switching is the enemy of speed. When a processor jumps from a Day 7 overdue bill to a brand new bill to a compliance issue, they lose cognitive momentum. Splitting the queue into segments lets them batch-process similar items.

**Applied as:**
- Tab-based queue splits: "New" | "Day 3 Follow-up" | "Day 7+ Overdue" | "Awaiting Dept" | "Auto-Rejected"
- Each tab shows its count badge (like Superhuman's unread count per split)
- Processors work one tab at a time, achieving flow state
- Tab order reflects priority: overdue first, new arrivals second
- `Tab` / `Shift+Tab` to switch between queue segments

**Impact on throughput:** Reduced context switching means fewer errors and faster pattern recognition within each batch. Estimated 10-15% efficiency gain.

### 3. Keyboard-Everything -> Zero-Mouse Bill Processing

**Why it works:** Mouse movement is the single largest time sink in repetitive desk work. Moving from keyboard to mouse takes 1-2 seconds each way. For 300 bills/day with 5 mouse movements each, that is 25-50 minutes of wasted hand movement.

**Applied as:**
- **Triage keys:** `A`=Approve, `R`=Reject, `H`=Hold, `S`=Skip, `=`=Assign
- **Navigation:** `J`/`K`=Next/Previous bill, `O`=Open detail, `Esc`=Back to list
- **Command palette:** `Cmd+K` for any action ("assign compliance", "hold day 3", "reject resubmit")
- **Persistent shortcut bar:** Bottom of screen shows context-aware shortcuts
- **Progressive discovery:** Hover tooltips show shortcuts; command palette shows them inline

**Impact on throughput:** Power users can process a bill in 3-5 keystrokes. Mouse-dependent users take 8-12 clicks. Keyboard-first can double processing speed for trained users.

### 4. Snooze -> Cadence Automation

**Why it works:** The OHB cadence (Day 0 -> 3 -> 7 -> 10) is functionally identical to Superhuman's "remind me" workflow. A bill placed On Hold at Day 0 should disappear from the active queue and reappear at Day 3. This keeps the queue clean and ensures no cadence step is missed.

**Applied as:**
- When a bill goes On Hold, it auto-snoozes to Day 3
- At Day 3, it resurfaces in the "Day 3 Follow-up" split with a visual chip showing "Day 3 of 10"
- If not resolved, processor advances to Day 7 (one keystroke: `N` for Next Cadence)
- Day 10 bills appear in red with "FINAL NOTICE" badge -- highest urgency
- Visual cadence chips on every bill row: teal for active, amber for approaching, red for overdue

**Impact on throughput:** Zero manual cadence tracking. Processors never need to check dates or set calendar reminders. The system surfaces the right bill at the right time.

### 5. Instant Reply -> Auto-Draft Communications

**Why it works:** Composing supplier communications from scratch is slow and error-prone. Superhuman proved that "review and edit" is 2x faster than "compose from scratch."

**Applied as:**
- When a processor sets a bill to Reject-Resubmit, the system auto-drafts a message listing each issue and required action
- When a bill goes On Hold, the system drafts the cadence-appropriate message (Day 0: initial notice, Day 3: first follow-up, Day 7: escalation, Day 10: final)
- The processor reviews, optionally edits, and sends with `Cmd+Enter`
- Common phrases auto-complete inline as the processor types (Tab to accept)
- One-line bill summaries in the list view: "3 blocking, $1,245.50, Mable Care -- Terminated"

**Impact on throughput:** Communication drafting time reduced by 50-70%. Consistency improved because all messages follow the same template structure.

---

## The Compound Effect

Each individual pattern saves 10-20% of processing time. But they compound:

| Pattern | Time Saved | Mechanism |
|---|---|---|
| 100ms Rule | 15-20% | Eliminate wait time |
| Split Inbox | 10-15% | Reduce context switching |
| Keyboard-Everything | 20-30% | Eliminate mouse movement |
| Snooze/Cadence | 10-15% | Automate cadence tracking |
| Auto-Draft Comms | 15-20% | Pre-compose messages |

**Combined estimate: 50-70% efficiency gain** -- meaning a processor handling 250 bills/day could handle 400-425 with the same effort.

---

## Why Superhuman Over Other Paradigms

- **Linear** is great for project management, but bills are not projects -- they are ephemeral items to triage, not track over weeks.
- **Notion** excels at flexible databases, but bill processing needs rigid, fast workflows -- not infinite customisation.
- **GitHub** works for review workflows, but its multi-step review process (comment, approve, merge) adds overhead that bill processing cannot afford.
- **Superhuman** was built for exactly this: process a high volume of similar items as fast as possible, with keyboard-first interaction, intelligent automation, and zero unnecessary friction.

Bill processing is email triage. Superhuman is the best email triage tool ever built. The paradigm transfer is natural, direct, and immediately actionable.
