---
title: "Split Panel Rationale — Sidebar Sam"
student: sam
pattern: split-panel
created: 2026-03-10
---

# Why Split Panel for Feedback Records Management

## The Core Problem

Complaint triage is a queue-processing workflow. Coordinators receive a batch of feedback records and need to review each one, assess triage level, assign ownership, and advance through stages. Traditional page-based navigation forces them to open a record, review it, go back to the list, find their place, open the next record — losing context with every click.

## Why Split Panel Solves This

### 1. Never Lose Your Place

The persistent list on the left means the coordinator always sees where they are in the queue. When reviewing REF-00142, they can see REF-00143 waiting below and REF-00141 already triaged above. There is no "back to list" action — the list never left.

This is critical for complaint management where records arrive throughout the day. A coordinator might be deep in an investigation note for one record when a new urgent complaint appears at the top of the list. With a split panel, they see it immediately without interrupting their current work.

### 2. Preview Before Committing

The right panel shows a meaningful preview of the selected record — enough to decide whether it needs attention now or can wait. The coordinator scans the subject, triage level, and current stage without opening a full-page view. This reduces unnecessary page loads and keeps the mental model of the queue intact.

For complaints specifically, the preview shows the critical decision factors: triage level (Urgent/Medium/Standard), current stage, assigned coordinator, and days since last activity. A coordinator can scan 10 records in 30 seconds and identify which ones need immediate action.

### 3. Batch Processing Speed

Sequential triage — working through records top to bottom — is the primary workflow. The split panel supports this with:

- **Keyboard navigation**: Arrow down to the next record, the detail panel updates instantly
- **No page transitions**: Zero load time between records, just a panel content swap
- **Persistent filters**: Filter to "Urgent + Unassigned" and work through the filtered list without the filter resetting on each navigation
- **Visual progress**: Completed records change appearance (dimmed or moved) so the coordinator sees their progress through the queue

### 4. Context Preservation During Editing

When creating a note or updating an action plan, the list remains visible on the left (slightly dimmed to indicate the form has focus). This means:

- The coordinator can reference the record's position in the queue while writing
- They can glance at the triage indicators of surrounding records
- After saving, they are immediately back in the list — no navigation required
- Accidental navigation away from a form is harder because the form is contained in the detail panel

### 5. Information Density Without Overwhelm

The split panel achieves high information density by using two distinct visual zones:

- **Left panel (38%)**: Scannable, tabular, minimal — optimized for rapid visual scanning
- **Right panel (62%)**: Rich, detailed, spacious — optimized for reading and comprehension

This dual-density approach means the interface can show 8-10 records in the list while simultaneously displaying the full detail of the selected record. A single-page layout would need to choose between showing the list OR the detail, never both.

### 6. Resizable for Different Work Modes

The draggable divider between panels lets coordinators adapt to their current task:

- **Scanning mode**: Widen the list to see more records, narrow the detail to just the header
- **Reading mode**: Narrow the list to just REF numbers, widen the detail for full investigation notes
- **Balanced mode**: Default 38/62 split for normal triage work

## Trade-offs Acknowledged

- **Horizontal space**: Split panels need wider screens. On narrow viewports (< 1024px), the layout should collapse to a stacked view with a back button
- **Complexity**: Two simultaneously updating panels add implementation complexity vs. simple page navigation
- **Mobile**: This pattern does not work on mobile — a separate mobile layout is needed

## Why Not Other Patterns?

- **Full-page detail**: Loses queue context, slower for batch processing
- **Card grid**: Good for visual scanning but poor for sequential processing — no clear top-to-bottom order
- **Table with expandable rows**: Rows push content down, disrupting the visual position of subsequent records
- **Modal overlays**: Block the list entirely, no keyboard navigation between records

The split panel is the established pattern for exactly this type of workflow — email clients, support ticket systems, CRM tools all converge on this layout because it optimally balances scanning speed with detail depth.
