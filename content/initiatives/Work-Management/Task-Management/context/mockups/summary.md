---
title: "UI Mockup Summary: Rich Task Management Experience"
---


**Epic**: TP-2143-TMN-Task-Management
**Created**: 2025-12-31
**Purpose**: Visual design reference for implementation

---

## Overview

This document summarizes the UI mockup variations generated for the Rich Task Management Experience feature. All mockups are ASCII-based for quick reference during implementation planning.

---

## Mockup Files Generated

### 1. [Table Grouping Variations](01-table-grouping-variations.txt)

**Purpose**: Explore different approaches to implementing the "Group By" functionality on index tables.

**Options Presented** (8 variations):
- **Option A**: Inline Dropdown Selector (Compact) - Minimal space, dropdown in toolbar
- **Option B**: Toolbar Button with Modal (Explicit) - Dedicated modal with all options
- **Option C**: Slide-in Panel (Detail-Rich) - Persistent side panel with controls
- **Option D**: Contextual Chip Bar (Modern) - Active grouping chip with visual indicators
- **Option E**: Grouped Accordion Style (Compact) - Simplified accordion pattern
- **Option F**: Split View with Mini-Map (Advanced) - Distribution visualization
- **Option G**: Inline Toggle with Smart Defaults (Minimal) - Simple on/off toggle
- **Option H**: Tab-Based Grouping (Alternative Navigation) - Tab interface for grouping views

**Recommended Approach**:
> **Option D: Contextual Chip Bar** combined with **Option A: Inline Dropdown Selector**
> - Shows active grouping state clearly with removable chip
> - Dropdown provides quick access to change grouping
> - Color-coded group headers (🔴 URGENT, 🟠 HIGH, 🟡 MEDIUM, 🟢 LOW)
> - Task counts and percentage distribution per group
> - Collapsible groups (▼ expanded, ▶ collapsed)

**Key Features**:
- Persist user's grouping preference across sessions (stored in user settings)
- Support grouping by: Priority, Stage, Assignee (User/Team), Due Date, Associated Type
- Visual feedback: Color-coded headers, icons, task counts
- Performance target: <2 seconds to re-group large tables (tested with 500+ tasks)

---

### 2. [Inline Editing Variations](02-inline-editing-variations.txt)

**Purpose**: Design patterns for rich inline editing capabilities beyond current 3 fields (title, priority, stage).

**Options Presented** (8 variations):
- **Option A**: Popover Editor with Save/Cancel (Explicit Control) - Safe batching of changes
- **Option B**: Inline Dropdown with Auto-Save (Frictionless) - Immediate save on change
- **Option C**: Inline Text Input with Tag Autocomplete (Keyboard-First) - Fast typing experience
- **Option D**: Date Picker Cell (Inline Calendar) - Visual calendar with quick actions
- **Option E**: User/Team Assignment Selector (Avatar Interface) - Search-based selector with avatars
- **Option F**: Inline Checklist Editor (Drag & Drop) - Full CRUD with reordering
- **Option G**: Quick Edit Toolbar (Row-Level Actions) - Batch operations for multi-select
- **Option H**: Modal Editor for Complex Changes (Power User Mode) - Full-featured editor

**Recommended Hybrid Approach**:
> Combine patterns based on field complexity:
> - **Simple fields** (Priority, Stage): Auto-save dropdown (Option B)
> - **Tags**: Autocomplete input (Option C) with quick chips in cell
> - **Dates**: Calendar popover (Option D) with quick actions (Today, Tomorrow, Next Week)
> - **Assignments**: Avatar selector (Option E) with search
> - **Checklists**: Dedicated editor (Option F) in task detail view with drag-and-drop reordering
> - **Bulk updates**: Toolbar (Option G) for multi-select operations
> - **Complex scenarios**: Gear icon → Modal (Option H)

**Key Features**:
- **Validation**: Inline error messages with ⚠️ icon, red borders, error text below cell
- **Loading states**: Spinner icon, "Saving..." text, disable interaction during save
- **Success feedback**: Brief green checkmark animation on successful save
- **Undo**: Quick re-edit for auto-save fields, explicit Cancel for popover editors
- **Performance target**: <5 seconds from edit to save confirmation

**Checklist Editor Capabilities**:
- ☑/☐ Check/uncheck items (auto-saves)
- Click text to edit inline (saves on blur/Enter)
- Drag ⋮ handle to reorder items
- Click × to delete items (with confirmation)
- Add new items via "+ Add checklist item..." input
- Progress bar: "2 of 5 completed (40%)"

---

### 3. [Attachment Management Variations](03-attachment-management-variations.txt)

**Purpose**: Design file upload, preview, and management interfaces for task attachments.

**Options Presented** (8 variations):
- **Option A**: Inline Badge with Hover Preview (Compact) - Badge with tooltip on hover
- **Option B**: Attachment Panel Slide-in (Dedicated Space) - Side panel with gallery
- **Option C**: Modal Attachment Manager (Full-Featured) - Modal with grid/list views
- **Option D**: Inline Upload Cell with Dropzone (Direct) - Drag-and-drop to row
- **Option E**: Task Detail Panel with Gallery (Rich Context) - Attachments tab in details
- **Option F**: Attachment Thumbnail Stack in Cell (Visual) - Stacked thumbnails in table
- **Option G**: Context Menu Upload (Right-Click) - Right-click menu option
- **Option H**: Persistent Upload Button in Toolbar - Toolbar action for selected tasks

**Recommended Hybrid Approach**:
> Combine multiple entry points for complete solution:
> 1. **Table Cell**: Badge with count (e.g., "📎 3") - minimal footprint
> 2. **Hover Badge**: Preview tooltip (Option A) - shows recent 3 files with quick actions
> 3. **Click Badge**: Opens attachment panel/modal (Option B + C hybrid) - full management UI
> 4. **Drag-and-Drop on Row**: Inline dropzone (Option D) - single-file quick uploads
> 5. **Task Detail Panel**: Gallery view (Option E) - see attachments with full task context
> 6. **Context Menu**: Right-click upload (Option G) - power-user shortcut

**Key Features**:
- **Upload Methods**: Drag-and-drop, file picker, paste from clipboard
- **Progress Feedback**: Inline progress bars, percentage, estimated time remaining
- **File Type Icons**: 🖼️ (images), 📄 (text/docs), 📊 (spreadsheets), 📦 (archives), 📹 (videos)
- **Thumbnails**: Generate for images/PDFs, show in gallery/hover previews
- **Lightbox Viewer**: Full-screen preview with arrow key navigation, zoom, download
- **Permissions**: Inherit from task visibility (anyone who can view task can view attachments)
- **Performance**: Lazy-load thumbnails, chunk large file uploads, show progress for >1MB files
- **Validation**: Max file size 10MB (configurable), allowed types (images, docs, spreadsheets)

**Upload Progress States**:
```
📎 3 → 📎 4 (badge updates)
⏳ Uploading screenshot.png
[████████░░] 78% · 2s remaining
✅ File uploaded: screenshot.png (2.1 MB)
❌ Upload failed: File too large (>10MB) [Retry]
```

---

### 4. [Integrated Table View](04-integrated-table-view.txt)

**Purpose**: Show how all features work together in realistic usage scenarios.

**Scenarios Presented** (10 scenarios):
1. **Default View with Grouping Active** - Full table with priority grouping, task counts, overdue indicators
2. **Inline Editing Active (Tags Cell)** - Popover editor for tags with multi-select checkboxes
3. **Attachment Hover Preview** - Tooltip showing 3 recent files with file sizes and times
4. **Multi-Select with Toolbar Actions** - Bulk assignment modal for 3 selected tasks
5. **Date Picker Inline Editor** - Calendar popover with quick actions (Today, Tomorrow, Next Week)
6. **Task Detail Panel with Attachments Gallery** - Gallery view with thumbnails and upload zone
7. **Drag-and-Drop File Upload to Row** - Dropzone appears on drag, progress bar after drop
8. **Validation Errors and Loading States** - Inline validation errors and save spinners
9. **Checklist Editor in Task Details** - Progress bar, drag-and-drop reordering, inline editing
10. **Empty States and First-Time Use** - "No tasks yet" with CTA, "No search results", "No attachments"

**Interaction Flows** (documented):
- **Quick Task Update (Tags)**: 3 seconds from click to save
- **Bulk Assignment**: 8 seconds to assign 3 tasks to a user
- **Upload Attachment via Drag-and-Drop**: 5 seconds (depends on file size)
- **View and Manage Attachments**: 15 seconds full workflow
- **Create Task with Checklist**: 20 seconds with 3 checklist items

**Responsive Behavior**:
- **Desktop (>1200px)**: Full table, all columns, side panels, hover interactions
- **Tablet (768px - 1200px)**: Some columns hidden, popovers as modals, 2-column attachment grid
- **Mobile (<768px)**: Card-based view, fullscreen modals, list view for attachments, collapsible groups

**Keyboard Shortcuts**:
- `Tab` / `Shift+Tab`: Navigate cells
- `Enter`: Start editing cell
- `Escape`: Cancel editing
- `Ctrl/Cmd + N`: New task
- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + G`: Toggle grouping menu
- `Space`: Check/uncheck checkbox
- `↑/↓`: Navigate rows
- `←/→`: Navigate columns
- `Shift + Click`: Select range
- `Ctrl/Cmd + A`: Select all

**Accessibility Features**:
- ARIA labels for all interactive elements
- Live regions announce changes (saves, uploads)
- Focus indicators clearly visible
- High contrast mode support
- Minimum touch target: 44×44px
- Respect `prefers-reduced-motion`

**Performance Considerations**:
- Virtual scrolling for 1000+ tasks
- Lazy load attachment thumbnails
- Debounce search (300ms)
- Paginate groups (first 10 tasks, "Load more")
- Optimistic UI updates (save in background)
- Skeleton screens for initial load

---

## Implementation Priorities

Based on the feature specification priorities and mockup analysis:

### Phase 1: Table Grouping (P1 - High Priority)
**Recommended UI Pattern**: Option D (Contextual Chip Bar) + Option A (Inline Dropdown)

**Implementation Steps**:
1. Build grouping logic in common table component (reusable across all tables)
2. Add dropdown selector in table toolbar: `Group by: [▼ Priority]`
3. Add contextual chip when grouping active: `[● Priority ✕]`
4. Implement collapsible group headers with counts and percentages
5. Store user preference in backend (persist across sessions)
6. Add color-coding for priority groups (🔴 URGENT, 🟠 HIGH, etc.)

**Success Criteria**:
- Grouping applies within 2 seconds for tables with 500+ items
- User's preference persists after logout/login
- Works on all index tables (tasks, bills, packages, etc.)

---

### Phase 2: Rich Inline Editing (P2 - Medium Priority)
**Recommended UI Pattern**: Hybrid approach (different patterns per field type)

**Implementation Steps**:
1. **Tags**: Autocomplete input with dropdown (Option C)
   - Multi-select checkboxes
   - Create new tag inline
   - Auto-save on selection
2. **Dates**: Calendar popover with quick actions (Option D)
   - Today, Tomorrow, Next Week shortcuts
   - Clear date option
   - Auto-save on selection
3. **Assignments**: Avatar selector with search (Option E)
   - User/team search
   - Visual avatars
   - Auto-save on assignment
4. **Checklists**: Dedicated editor in task details (Option F)
   - Full CRUD (check/uncheck, add, remove, reorder)
   - Drag-and-drop handles
   - Progress bar
   - Auto-save on changes
5. **Bulk Operations**: Toolbar for multi-select (Option G)
   - Batch tag updates
   - Batch assignments
   - Batch date changes

**Success Criteria**:
- Inline edits save within 5 seconds
- Validation errors shown inline with clear messaging
- Checklist supports full CRUD operations without leaving table context
- No data loss on network errors (retry mechanism)

---

### Phase 3: Photo/Attachment Support (P3 - Lower Priority)
**Recommended UI Pattern**: Hybrid approach (multiple entry points)

**Implementation Steps**:
1. **Badge in Table Cell**: Count indicator (📎 3)
2. **Hover Preview**: Tooltip with recent 3 files (Option A)
   - File names, sizes, upload times
   - Quick "View All" and "+ Upload" buttons
3. **Click Badge**: Opens attachment panel/modal (Option B/C hybrid)
   - Gallery view for images (thumbnails)
   - List view for documents
   - Grid/list toggle
   - Drag-and-drop upload zone
4. **Drag-and-Drop to Row**: Quick single-file upload (Option D)
   - Dropzone appears on drag over
   - Inline progress bar
   - Badge updates after upload
5. **Task Detail Panel**: Attachments tab (Option E)
   - Gallery layout
   - Full-size previews
   - Download/delete actions
6. **Lightbox Viewer**: Full-screen image preview
   - Arrow key navigation
   - Zoom support
   - Download button

**Success Criteria**:
- Upload completes within 10 seconds for files <5MB
- Thumbnails generated automatically for images/PDFs
- Lightbox preview opens in <1 second
- Attachment visibility inherits task visibility (permission model)

---

## Architecture Recommendations

### Common Table Component Enhancement

The table grouping functionality should be implemented as part of the **common table component infrastructure** (as noted in spec clarifications), making it reusable across all index tables.

**Directory Structure**:
```
resources/js/Components/Common/table/
├── cells/               # Existing cell components
├── CommonTable.vue      # Main table component (existing)
├── TableGrouping.vue    # NEW: Grouping controls
├── TableGroupHeader.vue # NEW: Group header component
├── useTableGrouping.ts  # NEW: Composable for grouping logic
└── useTableState.ts     # NEW: Composable for table state (grouping, sorting, filters)
```

**Backend Support**:
```
app/Tables/                      # Existing table classes
├── Concerns/
│   ├── HasGrouping.php         # NEW: Trait for groupable tables
│   └── HasInlineEditing.php    # NEW: Trait for editable tables
├── BillsTable.php              # Existing
├── TasksTable.php              # Existing - will implement traits
└── PackagesTable.php           # Existing
```

**User Preferences Storage**:
```php
// Store grouping preference
UserPreference::set(auth()->id(), 'table.tasks.grouping', [
    'enabled' => true,
    'field' => 'priority',
    'collapsed_groups' => ['LOW', 'MEDIUM'], // Track which groups are collapsed
]);
```

---

### Inline Editing Architecture

**Frontend (Vue Components)**:
```
resources/js/Components/Tasks/
├── Cells/
│   ├── TaskTagsCell.vue        # NEW: Tags editor
│   ├── TaskDateCell.vue        # NEW: Date picker
│   ├── TaskAssignmentCell.vue  # NEW: User/team selector
│   └── TaskChecklistCell.vue   # NEW: Checklist editor
└── Index.vue                   # Existing - integrate new cells
```

**Backend (Controllers/Actions)**:
```
domain/Task/Actions/
├── UpdateTaskTags.php           # NEW
├── UpdateTaskDueDate.php        # NEW
├── AssignTask.php               # NEW
└── UpdateTaskChecklist.php      # NEW
```

**Validation (Form Requests)**:
```
domain/Task/Requests/
├── UpdateTaskTagsRequest.php       # NEW
├── UpdateTaskDueDateRequest.php    # NEW
└── UpdateTaskChecklistRequest.php  # NEW
```

---

### Attachment Management Architecture

**Frontend (Vue Components)**:
```
resources/js/Components/Tasks/
├── Attachments/
│   ├── AttachmentBadge.vue         # NEW: Badge with count
│   ├── AttachmentPreview.vue       # NEW: Hover tooltip
│   ├── AttachmentManager.vue       # NEW: Modal/panel UI
│   ├── AttachmentGallery.vue       # NEW: Gallery grid view
│   ├── AttachmentLightbox.vue      # NEW: Full-screen viewer
│   └── AttachmentUploader.vue      # NEW: Drag-and-drop zone
└── Index.vue                       # Integrate attachment badge
```

**Backend (Models/Controllers)**:
```
domain/Task/Models/
└── TaskAttachment.php              # NEW: Attachment model

domain/Task/Actions/
├── UploadTaskAttachment.php        # NEW
├── GenerateAttachmentThumbnail.php # NEW
└── DeleteTaskAttachment.php        # NEW

domain/Task/Controllers/
└── TaskAttachmentController.php    # NEW: CRUD for attachments
```

**Storage Configuration**:
```php
// config/filesystems.php
'disks' => [
    'task_attachments' => [
        'driver' => 's3', // or 'local' for development
        'bucket' => env('AWS_TASK_ATTACHMENTS_BUCKET'),
        'visibility' => 'private', // Inherit task permissions
    ],
],
```

**Database Schema**:
```php
Schema::create('task_attachments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('task_id')->constrained()->onDelete('cascade');
    $table->foreignId('uploaded_by')->constrained('users');
    $table->string('filename');
    $table->string('original_filename');
    $table->string('mime_type');
    $table->unsignedBigInteger('size'); // bytes
    $table->string('storage_path');
    $table->string('thumbnail_path')->nullable(); // for images/PDFs
    $table->timestamps();

    $table->index(['task_id', 'created_at']);
});
```

---

## Technical Considerations

### Performance Optimization

**Grouping**:
- Use server-side grouping for large datasets (>1000 tasks)
- Cache grouped results for 5 minutes (clear on task updates)
- Implement pagination within groups (load first 10 tasks, "Load more")
- Use virtual scrolling for groups with 100+ items

**Inline Editing**:
- Debounce auto-save inputs (300ms delay)
- Optimistic UI updates (show change immediately, revert on error)
- Queue rapid edits (coalesce multiple saves into single request)
- Show inline loading spinners during save

**Attachments**:
- Lazy-load thumbnails (only generate when badge clicked or hovered)
- Chunk large file uploads (5MB chunks for files >10MB)
- Use signed URLs for private file access (expire after 1 hour)
- Implement progressive JPEG loading for images

### Security

**File Upload Validation**:
- Server-side validation: file type, size, virus scanning
- Client-side validation: file type, size (pre-upload feedback)
- Sanitize filenames (remove special characters, limit length)
- Store files with UUID filenames (prevent path traversal)

**Permissions**:
- Attachment visibility inherits task visibility (spec clarification)
- Verify user has task view permission before serving files
- Use signed URLs with expiration for S3 downloads
- Log all file access for audit trail

**XSS Prevention**:
- Sanitize user input in tags, checklist items
- Use Content Security Policy headers
- Serve user-uploaded files from separate domain (prevent cookie theft)

### Error Handling

**Network Errors**:
- Auto-retry failed saves (3 attempts with exponential backoff)
- Show toast notification: "Save failed. Retrying... (2/3)"
- Allow manual retry via toast action button
- Cache edits locally (localStorage) if all retries fail

**Validation Errors**:
- Show inline errors immediately (no need to submit form)
- Provide clear, actionable error messages
- Highlight invalid fields with red border + ⚠️ icon
- Prevent navigation away with unsaved changes (confirm prompt)

**File Upload Errors**:
- Handle quota exceeded (storage limit)
- Handle network interruption (resume upload)
- Handle file type rejection (clear error message)
- Provide "Retry" button for failed uploads

---

## Next Steps

### Before Implementation

1. **Review with Team**:
   - Share mockups with design team for feedback
   - Review hybrid approach recommendations with tech lead
   - Confirm architecture patterns with backend team
   - Validate responsive behavior with mobile-first testing

2. **Create Technical Plan** (`/speckit.plan`):
   - Break down each phase into tasks
   - Estimate effort for each task
   - Identify dependencies and blockers
   - Define database migrations needed
   - Plan API endpoints and routes

3. **Database Schema Design** (`/trilogy.clarify-db`):
   - Design `task_attachments` table schema
   - Design `user_preferences` table for grouping state
   - Plan indexes for performance (grouping queries, file lookups)
   - Consider soft deletes for attachments (audit trail)

4. **Design Review** (`/trilogy.clarify-design`):
   - Finalize color palette for group headers
   - Define spacing/sizing for popovers and modals
   - Create component library for new cells
   - Define animation/transition timing

### During Implementation

1. **Phase 1: Table Grouping**:
   - Build common table grouping composable
   - Implement backend grouping logic
   - Add user preference storage
   - Create collapsible group headers
   - Test with large datasets (500+ tasks)

2. **Phase 2: Inline Editing**:
   - Build tag autocomplete component
   - Build date picker component
   - Build user/team selector component
   - Build checklist editor component
   - Add validation and error handling
   - Test auto-save behavior

3. **Phase 3: Attachments**:
   - Build file upload infrastructure
   - Generate thumbnails for images/PDFs
   - Build lightbox preview component
   - Implement drag-and-drop
   - Add permission checks
   - Test with various file types and sizes

### Testing Strategy

**Unit Tests**:
- Grouping logic (group by different fields)
- Validation rules (tags, dates, checklists)
- File upload validation (type, size)
- Thumbnail generation

**Feature Tests**:
- Create task with attachments
- Update task via inline editing
- Bulk assign tasks
- Group table by priority/stage/assignee
- Delete attachment

**Browser Tests** (Dusk):
- Drag-and-drop file upload
- Inline editing with keyboard navigation
- Multi-select and bulk operations
- Grouping state persistence across sessions
- Lightbox preview navigation

---

## Conclusion

The mockups provide a comprehensive visual reference for implementing the Rich Task Management Experience feature. The recommended hybrid approaches balance **usability** (minimal clicks), **discoverability** (clear UI affordances), and **performance** (lazy loading, optimistic updates).

**Key Takeaways**:
1. **Grouping** should be part of common table infrastructure (reusable)
2. **Inline editing** should use different patterns based on field complexity (autocomplete for tags, calendar for dates, etc.)
3. **Attachments** need multiple entry points (badge, hover, drag-and-drop, detail panel)
4. **Responsive design** and **accessibility** are critical for all features
5. **Performance optimization** required for large datasets (virtual scrolling, lazy loading)

All mockups are reference materials only. Final implementation should follow existing design system patterns and be validated with usability testing.

---

**Generated**: 2025-12-31
**Next Command**: `/speckit.plan` - Create technical implementation plan
