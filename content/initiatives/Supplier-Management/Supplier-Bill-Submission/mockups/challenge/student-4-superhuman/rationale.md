---
title: "Superhuman Sam - Rationale"
---

# Rationale: Why Superhuman Patterns Work for Invoice Management

## Core Thesis: Speed Is the Feature

Superhuman's entire product philosophy centres on one belief: speed is not a nice-to-have, it is the product. Every design decision — split panes, keyboard shortcuts, triage workflows, instant feedback — exists to reduce the time between intent and completion. For suppliers who process invoices daily, this philosophy directly translates to competitive advantage.

## Why Split-Pane Layout Works for Invoices

Traditional invoice management forces a "list page then detail page" pattern. Every status check requires a click, a page load, a back button, and re-orienting in the list. With split-pane, the supplier sees their full invoice list on the left and complete details on the right simultaneously. Moving between invoices is a single keystroke (J/K), not a page navigation.

This matters at scale. A supplier with 5 invoices can tolerate page navigation. A supplier with 50 invoices per week cannot. The split-pane reduces the time to check invoice status from ~3 seconds (click, load, read) to ~0.3 seconds (press J, glance right). Over a week of invoice management, this saves minutes of actual time and significantly more in cognitive switching cost.

## Why Keyboard Triage Works for Bulk Uploads

The In Tray feature asks suppliers to review AI-split documents one at a time. This is fundamentally a triage workflow — the same pattern Superhuman uses for email processing. Each document needs a binary decision: accept or reject the split. Keyboard shortcuts (A for accept, R for re-split, S for skip, X for reject) make this decision-action loop near-instantaneous.

Auto-advance after each action is critical. Without it, the supplier must manually select the next document, breaking their flow. With auto-advance, the experience becomes rhythmic: look, decide, press a key, next. The progress counter ("3 of 12 processed, ~4 min remaining") creates positive pressure and a clear endpoint.

## Why Command Palette Serves Power Users

Suppliers who use the portal daily develop muscle memory. They do not want to navigate a sidebar to find the Clients page or click through menus to copy their email address. Cmd+K gives them a single entry point to every action: search invoices, navigate pages, copy data, create new invoices. It rewards frequency of use — the more you use the portal, the faster it gets.

## Why Speed Metrics Gamify Efficiency

Showing suppliers their own speed ("3 invoices submitted this week, avg 18s each") creates a feedback loop that encourages efficiency. It also subtly communicates that the portal is designed for speed — setting expectations that match the UI's design philosophy. When a supplier sees their submission time drop from 45 seconds to 18 seconds, they feel the product working for them.

## Why Minimal Clicks Reduce Error Rates

Every confirmation dialog is an opportunity for the user to second-guess or mis-click. Superhuman's philosophy replaces confirmations with undo: do the action immediately, show a brief undo toast. For safe actions (copy email, generate client email), there is no reason to confirm. The action happens instantly with visual feedback (a green flash, a toast notification). This reduces both time-to-completion and the cognitive load of "are you sure?" dialogs.

## Design Risks and Mitigations

**Risk: Keyboard shortcuts have a learning curve.** Mitigation: shortcuts are always visible as `<kbd>` hints next to their actions. The `?` key opens a full cheat sheet. The UI works fully with mouse; keyboard is an accelerator, not a requirement.

**Risk: Split-pane may feel cramped on smaller screens.** Mitigation: the split-pane is desktop-only. On smaller viewports, the interface collapses to a standard list-then-detail pattern. The layout is designed for the primary use case (desktop work), not compromised for edge cases.

**Risk: Auto-advance may feel rushed.** Mitigation: a brief animation (300ms slide) between items gives the user a moment to orient. The "Skip" action exists for items that need more thought later. The progress counter shows exactly where they are and how much remains.
