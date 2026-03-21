---
title: "Notion Nick - Research"
---

# Research: Notion UI Patterns for Supplier Invoice Portal

## 1. Database Views (Table, Board, Gallery, Calendar)

Notion's core innovation is that every dataset can be viewed through multiple lenses without duplicating data. A single database of invoices could be rendered as:

- **Table view** -- spreadsheet-like rows with sortable columns, inline editing, and column resize. Best for dense data scanning.
- **Board view** -- Kanban-style columns grouped by a property (e.g. status). Cards move between columns. Best for workflow-oriented tasks.
- **Gallery view** -- cards laid out in a grid showing a cover image and key properties. Best for visual browsing.
- **Calendar view** -- items placed on a date grid by a date property. Best for deadline tracking.

The view selector sits as a tab bar above the data, allowing instant switching. Each view can have its own filters and sorts saved independently.

**Source:** Notion database documentation, Notion desktop app.

## 2. Inline Editing and Auto-Save

Notion treats every piece of content as editable-in-place. There is no "edit mode" vs "view mode" -- clicking a text field makes it immediately editable. Changes auto-save with no explicit "Save" button required.

Key patterns:
- **Click-to-edit text** -- single click on any cell opens an inline editor.
- **Property chips** -- clicking a status/select property opens a dropdown in-place.
- **Hover affordances** -- action buttons (duplicate, delete, open) appear only on hover, keeping the default view clean.
- **No separate edit page** -- the row expands into a page-like view for full editing.

**Source:** Notion UX patterns, observed in Notion web and desktop apps.

## 3. Toggle Blocks and Callout Blocks

Notion structures content as discrete "blocks" that can be reordered, nested, and collapsed:

- **Toggle blocks** -- a disclosure triangle (triangle-right / triangle-down) that shows/hides nested content. Used for FAQs, grouped details, and progressive disclosure. The header text is always visible; child blocks collapse.
- **Callout blocks** -- a coloured background box with an emoji/icon on the left. Used for important notices, tips, warnings. Colour conveys severity (blue = info, yellow = warning, red = error, green = success, teal = brand).

Both block types support nested content -- you can put toggles inside callouts, tables inside toggles, etc.

**Source:** Notion block types documentation.

## 4. Property Chips (Coloured Tags)

Notion represents select/multi-select properties as small coloured pills (chips). Each option has a distinct background colour with contrasting text. Key characteristics:

- **Rounded-full shape** with `px-2 py-0.5 text-xs` sizing.
- **Consistent colour palette** -- each status maps to a single colour (no gradients, no icons inside chips).
- **Multi-select** renders as a row of chips with `gap-1`.
- **Inline display** -- chips sit inside table cells, page headers, and list items without breaking layout.
- **Click-to-change** -- clicking a chip opens the select dropdown in-place.

**Source:** Notion property types, select/multi-select UI.

## 5. Page Peek (Open as Side Panel or Full Page)

When clicking a row in a Notion database, users can choose how the detail view opens:

- **Center peek** -- opens the record as a modal overlay in the centre of the screen.
- **Side peek** -- opens as a right-side panel, keeping the database visible underneath.
- **Full page** -- navigates to a dedicated page for the record.

The page-in-page pattern means the detail view itself looks like a Notion page: properties at the top (like form fields), followed by the page body (rich content blocks). The breadcrumb trail updates to show context.

**Source:** Notion page peek documentation, Notion database row open options.
