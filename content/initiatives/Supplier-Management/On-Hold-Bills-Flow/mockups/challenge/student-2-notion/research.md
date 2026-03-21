# Notion Nick -- Research: Notion Patterns for Bill Processing

## 1. Database Views (Table, Board, Calendar, Gallery, Timeline)

Notion treats every collection of data as a **database** with multiple switchable views. Each view presents the same underlying data through a different lens:

- **Table View** -- The workhorse. Rows are records, columns are properties. Every cell is inline-editable. This maps directly to the Bills Index where processors scan 5-6K bills/day. The dense tabular layout maximises information density while keeping every value clickable and editable.
- **Board View** -- Kanban-style grouping by a select property. For OHB, grouping bills by Comms Type (REJECT-RESUBMIT / REJECT PERIOD / ON HOLD) or by Cadence Day (Day 0/3/7/10) gives instant visual queue management. Processors drag bills between columns as status changes.
- **Timeline View** -- Plots items on a horizontal timeline by date range. For cadence tracking, this shows when bills entered hold, when follow-ups are due, and deadline pressure at a glance.
- **Calendar View** -- Date-property driven grid. Useful for follow-up scheduling and cadence milestone visibility.
- **Gallery View** -- Card-based layout highlighting a cover image or key property. Less useful for bill processing but could serve a dashboard "my assigned bills" quick-access panel.

**Key pattern**: The **view switcher** sits at the top of every database and lets users toggle between layouts without losing filters or sorts. This is a toolbar of tabs (Table | Board | Timeline) with a `+` to add new views.

**Source**: [Intro to databases -- Notion Help Center](https://www.notion.com/help/intro-to-databases), [Views, filters, sorts & groups](https://www.notion.com/help/views-filters-and-sorts)

---

## 2. Inline Property Editing

Every property value in a Notion database is editable in-place:

- **Select / Multi-select** -- Click the cell, a dropdown appears with colored pill options. Type to filter or create new options. This maps perfectly to Department Owner (Care / Compliance / Accounts), Status (BLOCKING / COMPLETE / etc.), and Comms Type selection.
- **Text / Number / Date** -- Click to type. No separate edit mode or modal required. For bill amounts, invoice dates, and supplier names, this means processors can correct data without leaving the table.
- **Relation** -- Click to search and link related records from another database. For linking reasons to bills or bills to suppliers.
- **Checkbox** -- Single-click toggle. For marking reasons as resolved.
- **Person / Assignee** -- Click to search team members. For assigning bills to processors or routing issues to department owners.

**Key pattern**: The cell transforms into its editor on click, with a subtle blue outline. Changes auto-save. No "Save" button, no modal -- direct manipulation.

**Source**: [Database properties -- Notion Help Center](https://www.notion.com/help/database-properties), [Easier database editing](https://www.notion.com/releases/2022-08-25)

---

## 3. Linked Databases and Relations

Notion's relation system creates connections between databases without duplicating data:

- **Relations** -- A property type that links rows across databases. A Bill can have a relation to multiple Reason records. Each reason row links back to its parent bill (two-way relation). This is the core of multi-issue tracking -- one bill, many reasons, each independently trackable.
- **Rollups** -- Aggregate data from related records. A bill could roll up "count of BLOCKING reasons" or "% of reasons COMPLETE" to show resolution progress without opening the bill. This drives the traffic-light summary in the Bills Index.
- **Linked Database Views** -- Embed a filtered view of another database inline on any page. The Bill Edit IDE's right panel (reasons checklist) is a linked database view of the Reasons database, filtered to `Bill = current bill`. The Department Queue is another linked view filtered to `Department = Care`.

**Key pattern**: Linked views share the source data but each view has independent filters, sorts, visible properties, and layout. Changes in any view update the source immediately.

**Source**: [Relations & rollups -- Notion Help Center](https://www.notion.com/help/relations-and-rollups), [Using relation & rollup properties](https://www.notion.com/help/guides/using-relation-and-rollup-properties)

---

## 4. Toggle Blocks / Collapsible Sections

Notion pages support **toggle blocks** -- headings that expand/collapse their children:

- **Toggle Heading** -- A heading with a triangle disclosure icon. Click to expand/collapse the content underneath. Perfect for the Bill Edit IDE's left panel: Documents (2), Notes (3), Activity are each toggle sections that expand to show their contents.
- **Nesting** -- Toggles can nest inside toggles. An Activity section could contain sub-toggles for each date's activity entries.
- **Default state** -- Toggles can be set to collapsed by default, keeping the interface clean until the processor needs that information.

**Key pattern**: Toggles reduce visual noise without hiding information. The count badge on collapsed toggles (e.g., "Documents (2)") tells users what's inside before expanding.

**Source**: [Notion Help Center -- Toggle blocks](https://www.notion.com/help/toggle-blocks)

---

## 5. Filter and Sort Systems

Notion's filter/sort UI is a distinctive pattern:

- **Filter bar** -- Active filters appear as **pills** above the database. Each pill shows the property name, operator, and value (e.g., `Status is BLOCKING`). An `x` on each pill removes it. This makes the current filter state always visible and adjustable.
- **Compound filters** -- AND/OR grouping for complex queries. For bill processing: `Department is Care AND Status is not COMPLETE AND Cadence Day >= 7`.
- **Sort controls** -- Multiple sort keys displayed as pills. Primary sort by Cadence Day descending (urgent first), secondary by Issue Count descending.
- **Saved views** -- Each named view saves its own filter/sort combination. A processor can have "My Bills -- Urgent" (filtered to assigned + Day 7+), "All BLOCKING" (filtered to status), and "Board by Department" as separate saved views.
- **Quick filter** -- A search box above the database for instant text filtering across all visible properties.

**Key pattern**: Filters are **visible, removable pills** -- not hidden behind a dropdown. The processor always knows what subset of data they're seeing. The `+ Add filter` button sits alongside the pills for quick additions.

**Source**: [Views, filters, sorts & groups](https://www.notion.com/help/views-filters-and-sorts), [Notion Databases: The Ultimate Beginner's Guide](https://thomasjfrank.com/notion-databases-the-ultimate-beginners-guide/)
