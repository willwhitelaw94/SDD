---
title: "Superhuman Sam — Research Notes"
---

# Research: Superhuman UI Patterns for Risk Radar

## Pattern 1: Split-View Triage (List + Detail Pane)

Superhuman's core layout is a vertical split: a dense message list on the left with a full preview pane on the right. The list shows sender, subject snippet, date, and status indicators in a single compact row. Selecting a row instantly renders the full content in the detail pane — no page navigation, no loading state. This "triage" workflow lets users process items at maximum speed because context switching is eliminated.

**Application to Risk Radar:** The 28 risk categories become compact rows in a left panel (60% width) showing status dot, category name, consequence badge, and last updated date. The right panel (40%) shows the full detail of the selected risk — description, action plan, check-in questions, and action buttons. Arrow keys move the selection; the detail pane updates instantly. A care partner can triage all 28 risks without a single page load.

## Pattern 2: Keyboard Shortcuts on Every Action

Superhuman assigns a keyboard shortcut to every action and displays the shortcut hint directly on the UI element — on buttons, in menus, on toolbar items. The shortcuts are single keys (not Cmd+Shift combos): E for edit, A for archive, R for reply. A persistent bottom bar shows the most common shortcuts for the current context. This isn't just a power-user feature — the visible hints teach the shortcuts through repeated exposure.

**Application to Risk Radar:** Every action surfaces its shortcut: [A]ssess, [E]dit, [D]elete on risk cards. Number keys (1-5) jump between clinical domains. Arrow keys navigate the risk list. A persistent bottom status bar reads "Up/Down Navigate | Enter Open | A Assess | E Edit | / Search" — always visible, always contextual. During client calls, care partners can navigate and act without reaching for the mouse.

## Pattern 3: Command Palette with Autocomplete Search

Superhuman's Cmd+K launches an autocomplete search that searches across contacts, subjects, labels, and actions simultaneously. Results appear as the user types, ranked by relevance and recency. The palette handles both navigation ("go to Falls risk") and actions ("assess Mobility"). This collapses the distinction between finding and doing.

**Application to Risk Radar:** Cmd+K opens a search overlay that searches across all 28 risk categories, 5 clinical domains, and available actions. Typing "falls" highlights the Falls risk card and shows "Assess Falls" as an action. Typing "functional" jumps to the Functional Ability domain on the radar view. The autocomplete is instant — no debounce, no loading spinner.

## Pattern 4: Dense Information Layout with Status-First Hierarchy

Superhuman packs more information into less space than any competitor. Each row in the email list contains 5-6 pieces of metadata without feeling cluttered. The visual hierarchy is strict: status indicator first (unread dot, starred icon), then the primary content (sender/subject), then secondary metadata (date, labels). Whitespace is minimal but deliberate — padding between elements is tight, but rows have clear separation.

**Application to Risk Radar:** Risk list rows lead with a traffic-light dot, followed by category name, then consequence badge, then last-updated timestamp. The radar view packs all 5 domains into a dense horizontal layout with inline scores, status dots, and consequence bars. Domain drill-downs use a table-like layout with tight row spacing. Every pixel shows useful information — the design assumes the user wants to see more, not less.

## Pattern 5: Batch Operations and Progress Tracking

Superhuman lets users select multiple emails and act on them simultaneously — archive 10, label 5, snooze 3. Selection is keyboard-driven (Shift+arrow to extend, X to toggle). Progress indicators appear for multi-step operations: "Processing 3 of 10" with a progress bar. The user always knows where they are in a batch workflow.

**Application to Risk Radar:** The assessment wizard is a batch operation across 16 risk areas. A progress bar ("3 of 16 assessed") tracks completion. Progress dots at the bottom show which risk areas are complete, skipped, or remaining. The "3 of 16 assessed" indicator appears on the radar view header, creating ambient awareness of assessment completeness. Batch assessment means a care partner can power through all 16 risk areas in a single focused session.
