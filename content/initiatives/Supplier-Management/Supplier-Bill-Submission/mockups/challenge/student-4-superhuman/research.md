---
title: "Superhuman Sam - Research"
---

# Research: Superhuman UI Patterns for Invoice Management

## Pattern 1: Split-Pane Layout (List + Preview)

Superhuman's core interface is a vertical split: the left pane shows a compact list of emails (sender, subject, snippet, timestamp), and the right pane shows the full content of the selected item. The split ratio is roughly 35/65. Selecting an item in the list instantly renders it in the preview pane with zero navigation or page load. The list pane has no scroll-dependent rendering — all items are rendered and visible, so the user can skim the list while the right pane updates.

**Application to invoices:** The split-pane layout lets suppliers scan their invoice list on the left while seeing full invoice details (reference, client, amount, status, OHB reasons, document preview) on the right. No page navigation needed for the most common task: checking invoice status. At 500 invoices, the list scrolls independently while the preview stays fixed.

**Source:** Superhuman app (mail.superhuman.com), inbox view

---

## Pattern 2: Keyboard-First Navigation and Shortcuts

Every action in Superhuman has a keyboard shortcut. Navigation uses J/K to move down/up through the list, Enter to open, E to edit, and Escape to go back. The shortcuts are discoverable through inline `<kbd>` hints displayed next to actions and a full shortcut overlay triggered by `?`. Superhuman trains users to rely on keyboard through onboarding and subtle visual cues. The philosophy: every mouse movement is wasted time.

**Application to invoices:** Suppliers processing 20+ invoices daily benefit enormously from keyboard navigation. J/K to move through the invoice list, Enter to view details, N to create new, U to upload, R to resubmit. Each action bar displays its shortcut next to the button label. The `?` shortcut opens a cheat sheet overlay.

**Source:** Superhuman keyboard shortcuts, onboarding flow

---

## Pattern 3: Triage Workflow (Process and Advance)

Superhuman's "Split Inbox" and triage model treat email as a queue to process, not a list to browse. After acting on an item (reply, archive, snooze), the interface auto-advances to the next item. Progress is tracked with a counter ("12 remaining") and the goal is "Inbox Zero" — processing all items until none remain. This creates a satisfying, gamified loop: act, advance, repeat.

**Application to invoices:** The In Tray bulk upload feature maps perfectly to triage. After AI splits uploaded documents, the supplier processes each one: accept the split, re-split, skip, or reject. After each action, the interface auto-advances to the next document. A progress counter ("3 of 12 processed") and time estimate ("~4 min remaining") create momentum. The goal: clear the tray.

**Source:** Superhuman Split Inbox, triage workflow

---

## Pattern 4: Command Palette (Cmd+K)

Superhuman's command palette is an always-available search that unifies navigation, actions, and search into a single modal. It appears as a centered overlay with a text input, grouped results, and instant filtering. Results are categorised (People, Labels, Actions) and keyboard-navigable. The palette is the fastest way to reach any part of the application.

**Application to invoices:** Power users can hit Cmd+K to instantly jump to an invoice by reference number, find a client by name, copy their email address, or navigate to any page. Actions like "Create Invoice", "Upload Documents", "Copy Supplier Email" appear as actionable commands, not just search results.

**Source:** Superhuman command palette (Cmd+K / Ctrl+K)

---

## Pattern 5: Instant Search with Real-Time Filtering

Superhuman's search is instantaneous — results appear as the user types, with no submit button or loading delay. The interface uses progressive refinement: each keystroke narrows results in real-time. Combined with filter pills (status, date range, sender), the search creates a feeling of direct manipulation. The speed itself is the feature — there is never a waiting state.

**Application to invoices:** Invoice search filters as the user types a reference number, client name, or amount. Status pills at the top (All, In Review, Paid, On Hold, Rejected) act as instant pre-filters. The combination of real-time search and status pills means a supplier can find any invoice in under 2 seconds, regardless of how many they have.

**Source:** Superhuman search, filter interaction model
