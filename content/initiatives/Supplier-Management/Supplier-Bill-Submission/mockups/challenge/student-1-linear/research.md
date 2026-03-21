---
title: "Linear Lisa - Research"
---

# Research: Linear UI Patterns for Invoice Management

## Pattern 1: Clean List Views with Minimal Chrome

Linear's issue list is defined by its restraint. Every row is a single horizontal line with a status indicator, title, and metadata pushed to the right edge. There are no card borders, no alternating row colours, no visual separators beyond a 1px bottom border. The information density is high but never feels cramped because of generous horizontal padding and consistent vertical rhythm.

**Application to invoices:** Each invoice row shows a small status dot (not a badge), the invoice number, supplier/client name, amount in monospace, and date. No per-row actions are visible until hover. This keeps the list scannable even at 50+ rows.

**Source:** Linear app (app.linear.app), issue list view

---

## Pattern 2: Status Indicators (Dots and Micro-Badges)

Linear uses 8px coloured circles to represent issue status (Backlog, Todo, In Progress, Done, Cancelled). The dots are always in the same position, creating a visual column that the eye can scan vertically without reading text. When additional context is needed (priority, assignee), it appears as a tiny avatar or a single icon, never a full badge.

**Application to invoices:** Invoice status maps cleanly: gray dot = Draft, yellow dot = In Review, green dot = Paid, red dot = On Hold. On-hold bills get a small numeric badge (e.g., "2 issues") inline, not a separate column.

**Source:** Linear issue states, priority indicators

---

## Pattern 3: Command Palette (Cmd+K)

Linear's command palette is the primary navigation method for power users. It searches across issues, projects, teams, and actions in a single unified input. The palette appears as a centered modal with a search field, grouped results, and keyboard-navigable rows. It reduces reliance on sidebar navigation and makes every action accessible from anywhere.

**Application to invoices:** Suppliers who process invoices daily would benefit from Cmd+K to quickly jump to a specific invoice by number, client, or amount. Actions like "Create Invoice", "Go to Clients", or "Copy Email Address" become instantly accessible without mouse navigation.

**Source:** Linear command palette (Cmd+K / Ctrl+K)

---

## Pattern 4: Keyboard-First Navigation

Linear supports full keyboard navigation: `j`/`k` to move between issues, `Enter` to open, `Escape` to go back, number keys for priority. The current selection is highlighted with a subtle blue-gray background. No mouse required for the entire workflow from browsing to updating status.

**Application to invoices:** Arrow keys to navigate the invoice list, `Enter` to open detail, `Escape` to return. Tab through form fields during creation. `Ctrl+Enter` to submit. Keyboard hints shown as small gray text in the footer or next to relevant actions.

**Source:** Linear keyboard shortcuts panel (? key)

---

## Pattern 5: Subtle Animations and Transitions

Linear uses 100-150ms transitions for state changes. When an issue is updated, the row briefly highlights. When a panel opens, it slides in from the right with a subtle ease. There are no bounces, no spring physics, no attention-grabbing motion. Everything feels snappy and purposeful.

**Application to invoices:** When copying an email address, the button briefly changes to a checkmark. When a status changes, the dot transitions colour. When the command palette opens, it fades in with a slight scale. All animations are under 200ms.

**Source:** Linear UI transitions, panel animations
