---
title: "Research: Linear Lisa - Relationship Intelligence"
---

# Research: Linear Lisa - Relationship Intelligence

**Student:** Linear Lisa
**Philosophy:** "Less, but better" (Dieter Rams)
**Feature:** Relationship Intelligence Panel

---

## Linear's Design Language

Linear is a project management tool known for its opinionated, high-craft interface. Several core principles define its visual language:

### 1. Monochrome Foundation with Semantic Colour

Linear uses a near-monochrome palette (grays from #1A1A1A to #F2F2F2) and reserves colour exclusively for meaning: status indicators, priority badges, and interactive highlights. There is no decorative colour. This principle ensures that when colour appears, the eye is drawn to it immediately — it always signals something actionable.

**Applied here:** The Relationship Intelligence panel uses colour only for:
- Teal (#007F7E) for primary actions (Log Touchpoint) and the active tab
- Amber/orange for warnings (bills on hold, incidents, approaching compliance deadline)
- The touchpoint progress ring, where teal fill shows days elapsed toward the 30-day threshold

Everything else is grayscale. The conversation prompts use a subtle teal border to distinguish them from personal context cards — colour that earns its place.

### 2. Keyboard-First Interaction

Linear popularised the command palette (Cmd+K) in productivity tools and surfaces keyboard shortcuts as first-class citizens. Shortcuts appear inline next to actions, not hidden in a help menu. This serves two user types: power users who never touch the mouse, and learners who discover shortcuts passively.

**Applied here:** Both variations include:
- A persistent keyboard hint bar at the bottom of the viewport
- Inline kbd tags next to every action button (L for Log Touchpoint, C for Add Context, N for Note)
- Cmd+K command palette button in the top bar
- J/K navigation in Variation B for moving through timeline entries

### 3. Density Without Clutter

Linear achieves high information density through tight typographic hierarchy rather than visual decoration. It uses:
- 10px uppercase tracking for section labels
- 13-14px for body content
- Subtle 1px borders instead of shadows
- Generous but precise whitespace — padding is consistent and tight, not expansive

**Applied here:** The operational badges in the sidebar (Variation A) pack four status items into a compact stack using 1px bordered rows with icon + label + count. No shadows, no cards-within-cards. The same data in Variation B uses a 2x2 metric grid — equally dense but leveraging horizontal space.

---

## CRM Context Panel Patterns

### Intercom's Sidebar Model

Intercom shows customer attributes in a right sidebar alongside the active conversation. Key pattern: the sidebar is **always visible** — not a tab you navigate to. Attributes are editable inline.

**Borrowed for Variation A:** The right sidebar pattern directly mirrors Intercom's approach. Operational data lives in the sidebar (always visible), while the main content area holds the deeper personal context and activity timeline. The sidebar doesn't require a tab click — it's structurally persistent.

### HubSpot's Highlights Panel

HubSpot forces users to choose 5-7 "compact layout" fields that appear at the top of every contact record. This constraint ensures the most important data is always above the fold.

**Borrowed for both variations:** The conversation prompts section acts as the "highlights" — the 2-3 most actionable pieces of information appear first, before any detailed context. In Variation A, prompts sit at the top of the main content area. In Variation B, they sit below the touchpoint status banner — both above the fold.

### Salesforce's Activity Timeline

Salesforce groups all interactions (calls, emails, tasks, cases) into a single chronological timeline, filterable by type. Each entry shows date, type icon, author, and a one-line summary with expandable detail.

**Borrowed for Variation B:** The right column includes a full interaction timeline grouped by month with type-coded dots (teal for touchpoints, orange for incidents, blue for care plan changes). Filter tabs (All / Calls / Incidents) mirror Salesforce's approach of letting users narrow without losing context.

---

## Specific Patterns Borrowed

### 1. Progress Ring for Compliance Status

**Source:** Linear's cycle progress indicators + fitness app ring patterns (Apple Watch)

Linear uses circular progress indicators for sprint/cycle completion. The ring metaphor communicates "how far through" a time-bound period you are — exactly what's needed for the 30-day touchpoint compliance window.

The ring shows: days elapsed / 30 days. At 18 days (60%), it's teal and calm. At 25+ days it would shift to amber. At 30+ days, red. The coordinator glances at the ring and knows: do I need to call today?

### 2. Inline Keyboard Shortcuts (kbd tags)

**Source:** Linear's action buttons and context menus

Linear shows shortcuts as subtle monospaced badges next to every action. Not in a separate shortcuts dialog — right next to the button, in-context. This creates a passive learning loop: every time you click "Log Touchpoint," you see the `L` shortcut. Eventually you stop clicking.

Both mockup variations replicate this pattern exactly: every button has its shortcut visible, and the bottom bar provides a persistent reference.

### 3. Section Labels as Uppercase Tracking

**Source:** Linear's sidebar section headers ("Workspace", "My Issues", "Favorites")

Linear uses `text-[10px] font-semibold uppercase tracking-wider text-[#999]` for section delineation. This is lighter than a heading but stronger than body text — it organises without demanding attention. The Relationship Intelligence panel uses this for every section: "Before you call", "Personal context", "Status", "Quick actions", "Touchpoint history".
