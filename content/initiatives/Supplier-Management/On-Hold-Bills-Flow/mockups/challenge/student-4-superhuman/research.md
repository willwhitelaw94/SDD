---
title: "Superhuman Pattern Research for OHB Bill Processor Cockpit"
---

# Superhuman Pattern Research for OHB Bill Processor Cockpit

_Student: Superhuman Sam | Paradigm: SUPERHUMAN EMAIL | Motto: "Speed is a feature"_

---

## Pattern 1: The 100ms Rule and Optimistic UI

**What it is:** Superhuman treats speed as the core product feature, not a nice-to-have. Every interaction must complete in under 100ms -- the threshold at which humans perceive something as instantaneous. The app actually targets 50ms for most actions.

**How it works in Superhuman:**
- App opens in under 100ms with zero perceptible lag between views
- Optimistic UI: when you press `E` to archive, the email vanishes immediately and focus snaps to the next message -- server sync happens in the background
- If a server sync fails, the email reappears with an inline error (never a blocking modal)
- Prefetching: Superhuman preloads the next 3-5 messages so opening them is instant
- Background indexing: search results appear as you type, not after you hit Enter
- No loading spinners anywhere in the app -- data is always ready before the user needs it

**Relevance to OHB:**
Bill processors handle 5-6K bills/day. Even 500ms of lag per action adds up to 40+ minutes of wasted time daily. Optimistic UI means: press `A` to approve a bill, it moves to the next bill immediately while the server processes the approval. Prefetch the next 3 bills in the queue so opening each one is instantaneous. Time saved per processor per day: estimated 30-60 minutes.

**Source:** [Why Superhuman is Built for Speed](https://blog.superhuman.com/superhuman-is-built-for-speed/), [Superhuman: Speed as the Product](https://blakecrosley.com/guides/design/superhuman)

---

## Pattern 2: Split Inbox Triage

**What it is:** Superhuman's Split Inbox automatically segments incoming email into focused streams -- VIPs, team, notifications, newsletters -- so users can batch-process similar items together rather than context-switching between unrelated messages.

**How it works in Superhuman:**
- 3-7 split categories, each a separate "inbox" with its own counter
- Categories auto-populate via Gmail filters, sender patterns, and AI classification
- Users process one split at a time, achieving flow state within a category
- `Tab` / `Shift+Tab` to switch between splits
- Each split can have its own sort order (newest first, oldest first, priority)
- "Important and Other" default split uses AI to separate signal from noise
- Split counts show unread totals -- you always know your queue depth

**Relevance to OHB:**
Bills can be split by: department queue (Care / Compliance / Accounts), cadence day (Day 0 / Day 3 / Day 7+ overdue), communication type (Reject-Resubmit / Reject Period / On Hold), or status (New / In Progress / Awaiting Department). A bill processor can batch-process all Day 7+ overdue bills first (highest urgency), then move to new arrivals. Same cognitive state, fewer context switches, faster throughput.

**Source:** [Email Triage with Superhuman](https://blog.superhuman.com/email-triage/), [Structure Your Inbox](https://help.superhuman.com/hc/en-us/articles/45271247561107-Structure-Your-Inbox)

---

## Pattern 3: Keyboard-Everything with Shortcut Discovery

**What it is:** Superhuman has 100+ keyboard shortcuts that cover every action. But what makes it work is not the shortcuts themselves -- it's the progressive discovery system that teaches users the shortcuts naturally, without requiring them to memorise a cheat sheet.

**How it works in Superhuman:**
- `Cmd+K` opens the Command Palette -- a fuzzy-search interface for every action
- Every result in the command palette shows its keyboard shortcut next to it
- When you use the palette to do something, you see the shortcut -- next time you can skip the palette
- Hover tooltips on buttons show the keyboard shortcut (e.g., hovering "Reply" shows `R`)
- Vim-style navigation: `J`/`K` for next/previous, `O` to open, `E` to archive
- Single-key actions for the most common operations: `R` reply, `F` forward, `H` remind
- Combo keys for less common actions: `Shift+U` for undo, `Shift+I` for mark read
- A persistent shortcut bar at the bottom shows context-appropriate shortcuts

**Relevance to OHB:**
Bill processing is a learned skill -- processors get faster over time. The progressive discovery model means new processors can use the command palette (`Cmd+K`, type "approve") while experienced processors use single-key shortcuts (`A`). The persistent shortcut bar at the bottom of the screen shows the current context: in a bill, it shows `A`=Approve, `R`=Reject, `H`=Hold, `S`=Skip. In the bills list, it shows `J`/`K`=Navigate, `O`=Open, `=`=Assign. Users learn without studying.

**Source:** [How to Build a Remarkable Command Palette](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/), [Speed Up With Shortcuts](https://help.superhuman.com/hc/en-us/articles/45191759067411-Speed-Up-With-Shortcuts), [Superhuman Shortcuts PDF](https://download.superhuman.com/Superhuman%20Keyboard%20Shortcuts.pdf)

---

## Pattern 4: Snooze and Cadence Management

**What it is:** Superhuman's "Remind Me" feature (triggered by pressing `H`) removes a message from the inbox and brings it back at a specified time. This creates a personal cadence system -- items return exactly when they need attention, not before.

**How it works in Superhuman:**
- Press `H` to set a reminder, then type natural language: "Monday 9am", "2 days", "next week"
- The message vanishes from the inbox immediately (out of sight, out of mind)
- At the specified time, the message reappears at the top of the inbox as if newly received
- Supports recurring reminders for follow-up chains
- "Remind if no reply" -- if the recipient hasn't responded in X days, the thread resurfaces
- Visual indicators show snoozed count: "4 snoozed" in the header
- Timezone-aware: "Monday 9am in Australia" works correctly

**Relevance to OHB:**
The OHB cadence system (Day 0 -> Day 3 -> Day 7 -> Day 10) is effectively a structured snooze workflow. When a bill is placed On Hold at Day 0, it should resurface at Day 3 for follow-up, then Day 7, then Day 10 for final resolution. Rather than building a separate cadence management system, apply Superhuman's snooze metaphor: the bill "snoozes" and reappears in the processor's queue at the next cadence milestone. Visual chips show: "Returns Day 3 (2 days)", "Returns Day 7 (6 days)".

**Source:** [Getting Started with Superhuman](https://blog.superhuman.com/inbox-zero-in-7-steps/), [Compose Quickly](https://help.superhuman.com/hc/en-us/articles/45263736431507-Compose-Quickly)

---

## Pattern 5: Instant Reply and AI Auto-Draft

**What it is:** Superhuman's "Instant Reply" feature generates AI draft responses for every email in your inbox. When you open a message, a draft reply is already waiting. You edit and send -- or just send. This flips the mental model from "compose from scratch" to "review and approve."

**How it works in Superhuman:**
- Every incoming email gets an AI-generated draft reply
- Drafts match the user's writing style and tone (learned from sent history)
- One-line summary appears above every conversation thread
- Auto-Labels classify emails: marketing, cold pitches, social notifications
- Autocomplete suggests next words/phrases inline as you type (greyed out, press Tab to accept)
- "Write with AI" uses context from inbox, calendar, web, and uploaded knowledge
- Result: users write emails 2x faster on average

**Relevance to OHB:**
For OHB communications (the consolidated message to suppliers), the system can auto-draft rejection/on-hold messages based on the diagnosed issues. A bill with 3 blocking issues generates a pre-written message listing each issue, the required action, and the cadence timeline. The processor reviews, edits if needed, and sends. Auto-classification applies to incoming bills: AI auto-detect of common disqualifiers (US2: AI Auto-Reject at 99% confidence) mirrors Superhuman's auto-labelling. One-line bill summaries ("3 blocking issues, $1,245.50, Mable Care Services") appear in the bill list for instant scanning.

**Source:** [AI-Powered Email with Superhuman](https://blog.superhuman.com/ai-powered-email/), [Superhuman AI Features](https://superhuman.com/products/mail/ai), [Autocomplete](https://help.superhuman.com/hc/en-us/articles/38458586779155-Autocomplete)
