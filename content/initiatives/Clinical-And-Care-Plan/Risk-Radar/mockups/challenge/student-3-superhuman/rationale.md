---
title: "Superhuman Sam — Design Rationale"
---

# Rationale: Why Superhuman's Speed-First Patterns Work for Clinical Risk Management

## The Problem: Clinical Tools Are Slow

Care partners work under time pressure. They juggle phone calls, home visits, and documentation windows that are measured in minutes, not hours. Current risk management workflows involve: open a table, find a row, click to open a modal, scroll through fields, save, close, repeat. Each step is a context switch. Each context switch is lost time and increased error risk.

Clinical risk isn't a "browse and read" activity — it's a triage workflow. Speed isn't a nice-to-have. It's a safety requirement.

## Why "Speed Is a Feature" Works Here

### 1. Split-view triage eliminates page navigation

The single biggest time sink in clinical data entry is navigation — clicking into a risk, reading it, going back, clicking into the next one. Superhuman's split-view layout shows the list and the detail simultaneously. Arrow-keying through 28 risks takes seconds, not minutes. The care partner maintains spatial context (their position in the list) while seeing full detail.

For clinical leads reviewing a client's risk profile before a care plan meeting, this is transformative. They can triage all 28 risks in under 2 minutes without a single page load.

### 2. Keyboard shortcuts reduce motor switching during calls

Care partners document risk observations while speaking with clients on the phone. Every mouse movement requires a hand off the keyboard, a visual search for the cursor, a click, and a hand back to the keyboard. Superhuman's approach — single-key shortcuts with visible hints — means the care partner's hands never leave the keyboard.

The persistent bottom status bar teaches shortcuts through ambient exposure. After a week of use, the keyboard paths become muscle memory. The UI doesn't just support speed — it trains for it.

### 3. Dense layouts respect the expert user

Clinical users are domain experts. They don't need large labels, explanatory tooltips, or generous whitespace to understand what they're looking at. Superhuman's information density — 5-6 data points per row — respects their expertise. A care partner who has managed 50 client risk profiles knows what a red dot next to "Falls" means. The interface doesn't condescend with modals explaining severity levels.

The radar view packs 5 domains, their scores, mitigation indicators, and a progress bar into a single viewport. A clinical lead gets the full picture without scrolling.

### 4. The assessment wizard is a batch workflow

The consequence assessment (16 risk areas, 5 severity levels each) is fundamentally a batch operation — not 16 separate tasks. Superhuman's progress-tracking pattern ("3 of 16") creates momentum and flow state. The single-question-per-screen format with keyboard selection (press 1-5) means a care partner can complete all 16 assessments in under 3 minutes.

The progress dots at the bottom provide ambient completion awareness. Skipped items are visually distinct, creating gentle accountability to return to them.

### 5. Autocomplete search collapses navigation to zero

With 28 risk categories, 5 domains, and 16 clinical risk areas, finding a specific item in a hierarchical UI takes time. Superhuman's Cmd+K pattern collapses any navigation task to "type what you want." A care partner mid-call who needs to update the Falls risk presses Cmd+K, types "fal", and is there. No scrolling, no tab-switching, no menu-diving.

## Design Decisions

| Decision | Reasoning |
|----------|-----------|
| Split-view (60/40) over full-width cards | Eliminates page navigation, enables triage speed |
| Persistent bottom shortcut bar | Teaches keyboard paths through ambient exposure |
| Cmd+K search over filter dropdowns | Instant access to any risk, domain, or action |
| Dense compact rows over spacious cards | Respects expert users, maximises visible information |
| Number-key assessment selection (1-5) | One keypress per clinical judgment, no mouse needed |
| Progress dots on assessment wizard | Creates flow state and completion momentum |
| Status dot first in every row | Triage hierarchy: status, then name, then metadata |
| Dark overlay on modals | Full visual focus for clinical judgment moments |
