---
title: "Superhuman Sam — Pattern Research"
---

# Superhuman Sam — Pattern Research

**Paradigm:** Superhuman
**Focus:** Speed-first interaction, split pane layout, keyboard triage with auto-advance, command palette, optimistic UI

---

## Pattern 1: Split Pane Layout (Master-Detail Without Page Transitions)

Superhuman's primary interface is a two-column split: a message list on the left and a full message view on the right. There is no page navigation. The entire application operates within this single split-pane frame, and switching between items is instantaneous because there is no route change, no loading state, and no layout shift.

**How it works in Superhuman:**

- The left pane is a narrow, compact list (~280-320px wide). Each row shows the sender name, subject line snippet, and a timestamp. Rows are approximately 56-64px tall — dense but not cramped.
- The right pane takes the remaining width and renders the full conversation thread for the selected item. It includes all message bodies, attachments, and inline reply areas.
- Selecting an item in the left list instantly renders it in the right pane. The transition is imperceptible — under 16ms (a single frame). There is no loading skeleton, no spinner, no fade-in. The content is pre-fetched and cached aggressively.
- The left list maintains scroll position and selection state independently of the right pane. Scrolling through a long conversation in the right pane does not affect the left list.
- The active item in the left list is indicated with a subtle left border accent and a slightly tinted background. The visual treatment is minimal — the focus is on the right pane content.
- Superhuman pre-loads adjacent items. When the user is viewing message #5, messages #4 and #6 are already rendered in memory. Pressing `J` or `K` to navigate swaps the right pane content from cache, not from a network request.

**Layout proportions:**

| Element | Width | Behaviour |
|---------|-------|-----------|
| Left list pane | ~280-320px fixed | Scrollable, maintains position |
| Right detail pane | Remaining width (fluid) | Scrollable, independent |
| Divider | 1px border | Non-draggable |

**Design details:**

- The left pane has no header or toolbar — it is purely a list. Category navigation (splits) lives above the list as tabs.
- The right pane has a compact action bar at the top (archive, snooze, reply, forward) and the conversation content below.
- There is no sidebar, drawer, or overlay that competes with the split pane. The split IS the application.

---

## Pattern 2: Keyboard Triage with Auto-Advance

Superhuman's triage system is built on a single principle: after you act on an item, the next item loads automatically. The user never returns to a "list" to pick the next thing. The workflow is linear — process, advance, process, advance — until the inbox is empty.

**How it works in Superhuman:**

- **E (Done/Archive):** Marks the current conversation as done and auto-advances to the next conversation in the list. The archived item slides right and out of view with a 150ms ease-out animation. The next item is already loaded.
- **H (Snooze):** Opens a time selector (in 1 hour, tomorrow morning, next week, custom). After selecting, the conversation disappears and auto-advances to the next. The snoozed item re-enters the inbox at the selected time.
- **R (Reply):** Opens an inline reply area at the bottom of the current conversation. The cursor is placed in the reply field immediately. `Cmd+Enter` sends.
- **J (Next) / K (Previous):** Navigate between conversations in the list. The right pane swaps instantly. No loading, no transition. The new content is rendered from cache.
- **Shift+J / Shift+K:** Select the current item and move to next/previous. This builds a selection without interrupting navigation flow.

**Auto-advance behaviour:**

The auto-advance is not optional — it is the core triage mechanic. When the user presses `E`:

1. The current item is archived (optimistic — the server request fires asynchronously).
2. The current item slides right and fades out (150ms animation).
3. The next item in the list slides into the right pane from below (100ms animation).
4. The left list updates: the archived item is removed, the next item is now highlighted.
5. Total perceived transition time: ~200ms.

**The "Superhuman flow":**

Power users describe entering a "flow state" where they process items at 2-3 second intervals: scan content, decide action, press one key, next item appears. The keyboard shortcuts are single characters (no modifier keys) to minimise finger movement. The auto-advance removes the decision of "what to look at next" — the system decides (the next item in the list).

**Keyboard triage cheat sheet:**

| Key | Action | Auto-advance? |
|-----|--------|---------------|
| `E` | Archive / Mark Done | Yes |
| `H` | Snooze (show time picker) | Yes (after time selection) |
| `R` | Reply inline | No (stays on current) |
| `J` | Next item | N/A (navigation) |
| `K` | Previous item | N/A (navigation) |
| `N` | New compose | No (opens compose) |
| `Z` | Undo last action | No (restores previous) |
| `/` | Search | No (opens search) |
| `?` | Show all shortcuts | No (opens overlay) |

---

## Pattern 3: Command Palette (Cmd+K)

Superhuman's command palette (called "Superhuman Command") is accessible from anywhere via `Cmd+K`. It is a fuzzy-search action dispatcher that provides access to every feature without requiring menu navigation.

**How it works in Superhuman:**

- `Cmd+K` opens a centered floating input field with a dark backdrop. The input is immediately focused.
- Typing filters results instantly with fuzzy matching. Results are grouped into categories: Actions, Contacts, Labels, Settings.
- Each result shows the action name and its keyboard shortcut on the right side. For example: "Mark as Done — E", "Snooze — H", "Move to Trash — #".
- Selecting a result executes the action immediately. If the action requires additional input (e.g., snooze time, label selection), a sub-panel appears within the palette.
- Recent and frequently used actions appear at the top before the user types anything.
- The palette supports chained commands: `Cmd+K` → "label" → select label → done. The user never leaves the palette mid-flow.

**Design details:**

- The palette is a single, narrow input at the top-center of the screen (~480px wide). It does not take over the full screen.
- Results appear below the input as a compact list. Maximum ~8-10 visible results before scrolling.
- The backdrop is a very subtle dark overlay (not a full modal blocker). The underlying content is still partially visible.
- `Esc` dismisses the palette instantly and returns focus to where it was.
- The palette renders in under 50ms. There is no fade-in or slide-down animation — it appears fully formed.

**Key differentiator from other command palettes:**

Superhuman's palette is not just a search box — it is an **action executor**. The user is not searching for a page to navigate to; they are searching for an action to perform on the current context. "Snooze" does not navigate to a snooze settings page — it snoozes the current conversation right there.

---

## Pattern 4: Contact Pane (Right Sidebar with Zero-Click Context)

Superhuman includes a collapsible contact pane on the right side of the message view. This pane shows everything known about the person you are communicating with — without the user ever asking for it.

**How it works in Superhuman:**

- When viewing a conversation, the contact pane automatically populates with information about the sender/primary contact.
- The pane shows: full name, email address, job title, company, location, social media links (LinkedIn, Twitter), recent emails from this contact, and mutual connections.
- This information is aggregated from multiple sources (Clearbit, social profiles, email history) and displayed as a compact, scannable card.
- The pane does not require the user to click anything. It updates automatically when the selected conversation changes.
- The pane is collapsible — pressing a toggle hides it to give more width to the message content. The collapsed state persists until manually expanded.

**Layout:**

| Element | Width | Position |
|---------|-------|----------|
| Left list pane | ~280px | Left |
| Message content | Fluid | Centre |
| Contact pane | ~260px | Right |

**Information hierarchy in the contact pane:**

1. **Identity block:** Avatar, full name, job title, company — always visible at top.
2. **Contact details:** Email, phone, location — one click to copy any value.
3. **Social links:** LinkedIn, Twitter icons — opens in new tab.
4. **Recent interactions:** Last 3-5 emails exchanged with this contact, with dates.
5. **Context notes:** User-added notes about this contact that persist across conversations.

**Why this matters:**

The contact pane eliminates the "who is this person?" lookup that interrupts workflow. In a traditional email client or CRM, seeing a name in a conversation and needing context requires navigating to a contact record, opening a new tab, or searching. Superhuman removes this step entirely — the context is always there, passively, requiring zero clicks.

---

## Pattern 5: Optimistic UI with Sub-100ms Response and Undo

Superhuman's interaction model is built on optimistic updates. Every user action is reflected in the UI immediately — before the server confirms the change. If the server request fails, the change is rolled back silently (or with a subtle error notification). This creates the perception of instant response.

**How it works in Superhuman:**

- When the user presses `E` to archive, the item disappears from the list and the next item loads — all within a single animation frame (~16ms). The archive API request fires asynchronously in the background.
- When the user presses `H` to snooze, the item disappears and the snooze time is shown in a brief toast. The API request fires after the UI has already updated.
- When the user applies a label, the label pill appears on the conversation immediately. The server sync happens in the background.
- If a server request fails, the item reappears in the list with a subtle "error" indicator. This is extremely rare — Superhuman's architecture is designed to make failures nearly impossible to encounter.

**The undo pattern:**

Every destructive action (archive, delete, snooze, label removal) triggers an undo toast at the bottom of the screen. The toast shows the action taken and a countdown (typically 5 seconds). Pressing `Z` at any point while the toast is visible reverses the action. The undo is also optimistic — the item reappears instantly while the undo API request fires in the background.

**Undo toast anatomy:**

```
[ Archived "Meeting follow-up". Press Z to undo (5s) ]
```

- The toast appears at the bottom-center of the screen.
- It auto-dismisses after 5 seconds.
- Multiple actions queue: if the user archives 3 items rapidly, `Z` undoes the most recent one, then `Z` again undoes the previous, etc.
- The toast uses a compact, high-contrast design (dark background, white text) that is visible without being distracting.

**Performance targets:**

| Interaction | Perceived Response Time | Actual Server Roundtrip |
|-------------|------------------------|------------------------|
| Archive (E) | <16ms (single frame) | 200-500ms (background) |
| Snooze (H) | <16ms + time picker render | 200-500ms (background) |
| Reply send | <50ms (sent indicator) | 500-2000ms (background) |
| Search results | <100ms (from local index) | N/A (local-first) |
| Navigation (J/K) | <16ms (pre-cached) | N/A (already loaded) |

**Spring animations:**

Superhuman uses spring-based animations for transitions rather than CSS ease curves. The parameters create a slightly bouncy, organic feel:

- Archive slide-right: 150ms duration, cubic-bezier(0.25, 0.1, 0.25, 1.0)
- Item enter from below: 100ms duration, ease-out
- Undo restore: 200ms slide-left with subtle scale (0.98 → 1.0)
- Toast appear: 200ms slide-up from bottom
- Toast dismiss: 150ms fade-out

The combined effect is that the application feels alive and responsive. Nothing snaps or jumps — everything glides. But the animation durations are short enough (100-200ms) that they never feel slow or decorative. They are functional — they communicate what happened and where things went.

---

## Sources

- [Superhuman — The Fastest Email Experience Ever Made](https://superhuman.com/)
- [Superhuman Keyboard Shortcuts](https://superhuman.com/shortcuts)
- [How Superhuman Built the Fastest Email Client](https://blog.superhuman.com/how-superhuman-is-built-for-speed/)
- [Superhuman's Secret: Speed as a Feature](https://kwokchain.com/2019/03/28/superhuman-the-productivity-meta-layer/)
- [Optimistic UI Patterns — Superhuman and Beyond](https://uxdesign.cc/optimistic-ui-b1e3d36d05bc)
- [The Superhuman Product-Market Fit Engine](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/)
- [Split Inbox Email Triage Patterns](https://www.superhuman.com/blog/split-inbox)
- [Superhuman Command Palette UX](https://www.superhuman.com/blog/cmd-k)
- [Spring Animation in UI Design](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)
- [Keyboard-First Design Principles](https://www.smashingmagazine.com/2022/04/designing-keyboard-first-interactions/)
