---
title: "Notion UI Pattern Research for Lead Management CRM"
description: "Analysis of Notion's database-centric UI patterns applicable to a CRM-style lead management tool"
---

# Notion UI Pattern Research for Lead Management CRM

Research into how Notion's database-driven interface can inform the design of a CRM-style lead management tool for sales agents. Five specific patterns are documented below, each grounded in actual Notion UI elements and behaviours.

---

## Pattern 1: Database as the Core Primitive (Multiple Views Over One Dataset)

Notion treats every structured collection as a **database** -- a collection of pages where every item is its own editable page. The same database can be rendered through multiple independent **views**, each with its own layout, filters, sorts, and groupings. The view switcher appears as a horizontal tab bar directly above the database content.

### How Notion Implements This

- **View tab bar**: Named views sit as tabs above the data (`All Leads`, `My Pipeline`, `New This Week`). A `+` button at the end creates new views. Views can be reordered by dragging.
- **Seven layout types**: Table, Board (Kanban), List, Gallery, Calendar, Timeline, and Chart. Each layout re-renders the same underlying data with a different visual structure.
- **Independent configuration**: Each view stores its own filter set, sort order, visible properties, and grouping property. Switching views is instant -- no page navigation, no data reload.
- **Overflow handling**: When there are many views, Notion collapses them behind a `{#} more...` link to prevent tab bar overflow.
- **Scoped saves**: A `Save for everyone` toggle determines whether a view's filter/sort configuration is personal or shared with the workspace.
- **Permission levels**: A "Can edit content" permission allows users to create and edit pages while preventing them from modifying view configuration or database properties -- protecting the structure while enabling data entry.

### Concrete UI Elements

| Element | Behaviour |
|---------|-----------|
| View tab | Click to switch layout; right-click for rename/duplicate/delete |
| `+` button | Opens view creation with layout picker (table/board/list/gallery/calendar/timeline/chart) |
| View lock icon | Prevents non-admins from modifying the view configuration |
| `Save for everyone` toggle | Scopes filter/sort changes to personal or shared |
| View dots in sidebar | Each view appears as a nested `·` item in the page sidebar |

### What This Looks Like in Practice

A CRM database named "Leads" would appear in the sidebar as a single item. Clicking it opens the default view (e.g., table). The tab bar shows additional views: `Pipeline Board`, `Follow-ups This Week`, `By Source`, `Revenue Chart`. Each tab shows the same 500 leads but arranged, filtered, and grouped differently. No data duplication. No separate pages to maintain.

---

## Pattern 2: Inline Editing Everywhere (Click-to-Edit Cells)

Notion's table view treats every cell as directly editable. There is no "edit mode" toggle -- you click a cell and its editing control appears immediately, matched to the property type.

### How Notion Implements This

- **Text/Number/URL/Email/Phone cells**: Clicking places a cursor directly in the cell. The cell expands vertically if text wraps. No save button -- changes persist on blur.
- **Select/Status cells**: Clicking opens a dropdown popover anchored to the cell. The dropdown shows coloured tags with a search/filter input at the top. Typing filters options; pressing Enter selects. New options can be created inline by typing a value that does not yet exist.
- **Date cells**: Clicking opens a calendar date picker popover. The picker supports single date, date range, optional time, reminders, and format customisation.
- **Person cells**: Clicking opens a member picker with workspace members listed and searchable.
- **Relation cells**: Clicking opens a search panel that queries the related database. Selected items appear as linked pills in the cell.
- **Checkbox cells**: Single-click toggles the boolean value with no popover.
- **Multi-select cells**: Clicking opens the same dropdown as Select but allows multiple selections. Selected tags appear as coloured pills in the cell.
- **Bulk editing**: Selecting multiple rows (via checkboxes or shift-click) surfaces a mini toolbar at the top of the view. Clicking a property in this toolbar opens its editor and applies the change to all selected rows simultaneously.

### Property Type Editor Matrix

| Property Type | Editor Widget | Trigger | Persistence |
|---------------|---------------|---------|-------------|
| Text | Inline cursor | Click cell | On blur |
| Number | Inline cursor (numeric input) | Click cell | On blur |
| Select | Dropdown popover with colour tags | Click cell | On selection |
| Status | Dropdown popover with grouped options | Click cell | On selection |
| Multi-select | Multi-choice dropdown popover | Click cell | On selection |
| Date | Calendar picker popover | Click cell | On date pick |
| Person | Member search popover | Click cell | On selection |
| Relation | Database search panel | Click cell | On selection |
| Checkbox | Toggle | Single click | Immediate |
| Email | Inline cursor | Click cell | On blur |
| Phone | Inline cursor | Click cell | On blur |
| URL | Inline cursor | Click cell | On blur |
| File | Upload dialog / drag-and-drop zone | Click cell | On upload |
| Button | Action trigger | Single click | Immediate |

### The Board View Variant

In Board view, inline editing works on the card face itself. Hovering over a card reveals property values, and clicking a property value on the card opens the same popover editor as in table view -- without opening the full page. This allows quick status updates, date changes, and person reassignments directly from the board.

---

## Pattern 3: Board View with Drag-and-Drop Status Transitions

Notion's Board view groups database items into columns based on a property value (typically Status or Select). Moving a card between columns changes that property value -- a direct manipulation pattern for status transitions.

### How Notion Implements This

- **Default grouping**: If a Status property exists, the board groups by it automatically. Otherwise, it falls back to Select, Person, Multi-select, or Relation properties.
- **Drag-and-drop**: Click-and-hold a card, drag it to another column. The card snaps into place and the underlying property value updates immediately. Cards can also be reordered within a column to express priority.
- **Column headers**: Each column header shows the status label, a coloured indicator, and a count of cards in that group. Clicking the count reveals calculation options (sum, average, date range, etc.).
- **Sub-groups**: A secondary grouping layer can be applied within columns, creating nested sections. For example, group by Status (columns) then sub-group by Priority (sections within each column).
- **Card customisation**: The board settings panel controls which properties are visible on card faces, card size (small/medium/large), whether to show cover images, and display order of properties.
- **Hidden columns**: Columns can be hidden and accessed through a `Hidden groups` button, useful for archiving completed stages without deleting them.
- **Column-contextual creation**: A `+ New` button at the bottom of each column creates a new item pre-set to that column's status value.

### Status Property Structure

Notion's Status property organises options into three built-in category groups:

| Category Group | Purpose | Default Colour | Example Options |
|----------------|---------|----------------|-----------------|
| To-do | Not started | Grey | New Lead, Uncontacted |
| In Progress | Actively being worked | Blue/Yellow | Contacted, Qualifying, Proposal Sent |
| Complete | Finished | Green | Converted, Lost, Disqualified |

Custom status options are created within these groups. Each option has a name and colour. The grouping enables automation triggers like "when status moves to any option in the Complete group."

### Concrete UI Elements

| Element | Behaviour |
|---------|-----------|
| Card face | Shows title + selected properties (status pill, person avatar, date) |
| Drag handle | Entire card is draggable; cursor changes to grab on hover |
| Column header | Label + count + colour dot; click count for calculations |
| `+ New` button | Appears at bottom of each column; creates item pre-set to that column's status |
| Sub-group divider | Collapsible section within a column with its own label and count |
| Hidden groups button | Reveals archived/hidden columns in a popover |
| Card size control | Small/medium/large toggle in board settings |
| Property visibility | Per-property show/hide toggles in board settings |

### Automation Triggers on Status Changes

Database automations can be wired to status transitions. When a lead card is dragged from "Contacted" to "Qualified", an automation can:
- Assign the lead to a specific person
- Set a follow-up date
- Send a Slack notification
- Create a related task in another database
- Send a webhook to an external system

Triggers support fine-grained control: fire on "any status change", on "status set to a specific option", or on "status moved to any option in a specific group (e.g., Complete)."

---

## Pattern 4: Filter/Sort/Group Controls with Composable Logic

Notion provides a filter/sort/group control bar that sits between the view tabs and the data content. These controls use composable logic -- AND/OR groups, multiple sort keys, and nested property grouping.

### How Notion Implements This

- **Filter bar**: Accessed via the settings menu icon or a `Filter` button. Each filter is a row: `[Property] [Operator] [Value]`. Operators vary by property type:
  - Text: is, is not, contains, does not contain, starts with, ends with, is empty, is not empty
  - Select/Status: is, is not, is any of, is none of
  - Date: is, is before, is after, is on or before, is on or after, is within (past week, next month, etc.)
  - Person: is, is not, contains, does not contain
  - Number: =, !=, >, <, >=, <=
  - Checkbox: is checked, is not checked

- **Advanced filters**: Simple filters can be promoted to advanced filters via `Add to advanced filter` in the `···` menu. Advanced filters support AND/OR logic with filter groups nested up to three layers deep. This enables queries like: `(Status is "New" OR Status is "Contacted") AND (Source is "Website" OR Source is "Referral") AND Assigned To is "Me"`.

- **Sort controls**: Each sort rule specifies a property and direction (ascending/descending). Multiple sort rules stack and can be reordered by dragging with the `⋮⋮` handle. Property-type-aware sorting: text sorts alphabetically, numbers numerically, Select/Multi-select by custom drag order of the options.

- **Group controls**: Grouping by a property creates collapsible sections in table view or columns in board view. The group menu offers:
  - `Hide empty groups`: Remove sections/columns with no items
  - Manual group reordering via drag
  - Per-group visibility toggles with an eye icon
  - Calculation per group (count, sum, average, etc.)

- **Filter persistence**: Filters can be saved to the view (shared) or kept personal. A visual indicator (highlighted button or dot) shows when filters are active.

### Concrete UI Elements

| Element | Behaviour |
|---------|-----------|
| Filter row | `[Property dropdown] [Operator dropdown] [Value input]` with `X` to remove |
| AND/OR toggle | Switches logic between adjacent filter rows |
| Filter group | Nested container with its own AND/OR logic, up to 3 levels deep |
| Sort row | `[Property dropdown] [Asc/Desc toggle]` with `⋮⋮` drag handle and `X` to remove |
| Group property selector | Dropdown to select grouping property |
| `Hide empty groups` toggle | Removes empty sections/columns from view |
| Active filter indicator | Blue dot or highlighted button when filters are applied |
| `Save for everyone` toggle | Makes filter/sort configuration shared or personal |

### Saved View Pattern

Each view acts as a saved combination of layout + filters + sorts + groups + visible properties. This means common queries are encoded as named views rather than requiring users to rebuild filters each time:

| View Name | Layout | Filter | Sort | Group |
|-----------|--------|--------|------|-------|
| All Leads | Table | None | Created date desc | None |
| My Pipeline | Board | Assigned To is Me | Priority desc | Status |
| Follow-ups Today | List | Next Follow-up is Today | Time asc | None |
| New This Week | Table | Created within Past Week | Created date desc | Source |
| By Source | Chart (donut) | Status is not Disqualified | None | Source |

---

## Pattern 5: Page Detail View with Modular Layout and Property Sections

When a database item is opened as a full page, Notion displays a structured detail view with a heading section, property groups, a content body, and an optional collapsible panel (sidebar).

### How Notion Implements This

- **Heading section**: Displays the item's title prominently at the top. Up to **four properties** can be **pinned** to the heading for immediate visibility (e.g., Status, Assigned To, Priority, Due Date). Backlink display can be configured (always show, hover, or off).

- **Property group**: A module below the heading listing all remaining database properties in a two-column layout: property name on the left, editable value on the right. Properties are edited inline using the same widgets as in the table view (dropdowns, date pickers, member selectors). Properties can be organised into **labelled sections** within the group for logical grouping (e.g., "Contact Information", "Lead Details", "Activity Tracking").

- **Modules**: Individual properties can be "promoted" into their own module -- a standalone section on the page with its own heading. Useful for relation properties or text fields that deserve visual prominence. Modules can be reordered via drag-and-drop or menu actions (Move up, Move down, Move to panel, Move to page).

- **Details panel**: A collapsible right-side sidebar accessed via a **"View details"** button at the top of the page. Secondary or less-frequently-accessed properties are placed here to reduce visual clutter on the main page. The panel stores "less critical properties, allowing you to access them without cluttering the main view." Note: some property types like Relations cannot be moved to the panel.

- **Content body**: Below the property area, the full block editor is available. Any Notion block type can be added: text, headings, lists, images, embeds, sub-pages, synced blocks, tables, callouts, dividers, toggles, code blocks. This is where notes, meeting logs, and unstructured information lives.

- **Tabbed layout**: An alternative layout mode that organises the page into tabs. A "Content" tab holds the block content; additional tabs can link to related database views (e.g., a "Tasks" tab showing a filtered view of a related Tasks database, an "Emails" tab showing related email logs).

- **Comments**: Inline comments can be attached to any block. Page-level discussions appear at the top of the page. Comments support @mentions and are timestamped.

### Concrete UI Elements

| Element | Behaviour |
|---------|-----------|
| Pinned properties (heading) | Up to 4 properties displayed below the title; click to edit inline |
| Property group | Two-column list of all properties; click any value to edit |
| Section dividers | Labelled separators within the property group for logical organisation |
| Module | Standalone property section with its own heading; draggable |
| "View details" button | Toggles the right-side panel open/closed |
| Content body | Full block editor below properties; slash commands to add content |
| Tabs (tabbed layout) | Horizontal tabs at the top of the content area; "Content" + custom tabs |
| Breadcrumb | Shows database name > item title for navigation context |
| Cover image | Optional banner image at the top of the page |
| Icon | Emoji or custom icon displayed next to the page title |

### Detail View Layout Modes

Notion offers two layout structures for detail pages:

**Simple Layout**: Properties distributed between the main page body and the collapsible details panel. All content is on one scrollable page. Best for items with moderate numbers of properties.

**Tabbed Layout**: Content organised into horizontal tabs. The first tab ("Content") contains the block editor content. Additional tabs can embed filtered views of related databases. Best for items with complex relationships to other data -- a lead page could have tabs for "Overview" (content), "Communications" (related emails database), "Tasks" (related tasks database), and "Documents" (related files database).

---

## Supporting Patterns

### Template System for New Entries

Notion databases support **templates** -- pre-configured page structures that pre-fill properties and content blocks when a new item is created. Templates are accessed via the dropdown arrow next to the `+ New` button.

Key behaviours:
- Multiple templates can exist per database (e.g., "Inbound Lead", "Referral Lead", "Event Lead")
- Each template defines default property values (e.g., Status = "New", Source = "Website")
- Templates include pre-built content blocks (e.g., a "Discovery Notes" section with prompts, a "Next Steps" checklist)
- A default template can be set so the `+ New` button uses it without requiring selection
- "Suggested" templates are offered by Notion for common use cases
- Repeating templates can auto-create entries on a schedule (e.g., weekly status report)

### Slash Command System

Inside any database page, typing `/` opens a command palette providing quick access to:
- **Block types**: text, heading (H1/H2/H3), list (bullet/numbered/toggle), table, divider, callout, quote, code block, image, embed, sub-page
- **Content transformations**: `/turnbullet` converts to bullet list, `/turntoggle` converts to toggle list
- **Colour changes**: `/red`, `/blue`, etc. change text or background colour
- **Actions**: `/comment` adds a comment, `/duplicate` copies the block
- **Filtering**: Typing after `/` narrows the menu in real-time (e.g., `/tab` shows "Table" and "Tab" options)

### Button Property

A property type that triggers a predefined automation with a single click. The button appears as a clickable element in the table cell or on the page detail view. Use cases include one-click actions like "Send follow-up email", "Move to next stage", "Create onboarding task", or "Log call completed."

### Relation and Rollup Properties

**Relations** create bidirectional links between databases. A Lead can be related to a Company, and the Company page will automatically show all its related Leads. Relations are displayed as linked pills -- clicking a relation pill navigates to the related page.

**Rollups** aggregate data from related items via a relation property. Aggregation functions include:
- Count (number of related items)
- Sum, Average, Min, Max (for number properties on related items)
- Show original values (display all values from related items)
- Date-based (earliest, latest date from related items)

Example: A Company page with a "Leads" relation could have rollups for "Lead Count" (count), "Total Estimated Value" (sum of value property), and "Latest Activity" (latest date from activity property).

---

## Sources

- [Views, Filters, Sorts & Groups - Notion Help Center](https://www.notion.com/help/views-filters-and-sorts)
- [Board View - Notion Help Center](https://www.notion.com/help/boards)
- [Layouts - Notion Help Center](https://www.notion.com/help/layouts)
- [Database Properties - Notion Help Center](https://www.notion.com/help/database-properties)
- [Intro to Databases - Notion Help Center](https://www.notion.com/help/intro-to-databases)
- [Database Automations - Notion Help Center](https://www.notion.com/help/database-automations)
- [Using Slash Commands - Notion Help Center](https://www.notion.com/help/guides/using-slash-commands)
- [Simple CRM Guide - Notion Help Center](https://www.notion.com/help/guides/simple-crm-for-strengthening-client-relationships-and-managing-work)
- [Database Settings - Notion Help Center](https://www.notion.com/help/customize-your-database)
- [Button Properties Guide - Notion Help Center](https://www.notion.com/help/guides/make-work-more-efficient-database-button-property)
- [Compare Database Formats - Notion VIP](https://www.notion.vip/insights/compare-and-configure-notion-s-database-formats-tables-lists-galleries-boards-and-timelines)
- [Notion Databases: The Ultimate Beginners Guide - Thomas Frank](https://thomasjfrank.com/notion-databases-the-ultimate-beginners-guide/)
- [Database Automations Complete Guide - Thomas Frank](https://thomasjfrank.com/notion-database-automations-the-complete-guide/)
- [Sales Pipeline with Automations - Notion Template](https://www.notion.com/templates/sales-pipeline-with-automations)
- [Sales CRM Template - Notion](https://www.notion.com/templates/sales-crm)
- [Best CRM Templates - Notion Marketplace](https://www.notion.com/templates/category/crm)
