---
title: "Design: Threads"
description: |-
  Pixel-perfect design specification from Figma
  Figma: CWD - Threads (j22eTAvr3HqEVNI9CkIqHT)
---

# Design: Threads

**Figma Source**: [CWD - Threads](https://www.figma.com/design/j22eTAvr3HqEVNI9CkIqHT/CWD---Threads?node-id=3-4718)
**Key Frames**:
- `3:4718` - Email and SMS (Reply to) - original exploration
- `3:16501` - Threads (main screen with timeline)
- `3:16774` - Thread detail expanded (full timeline)
- `3:16715` - Thread detail with email view
- `3:16899` - AI Summary panel
- `3:16939` - Assign to Package panel
- `3:16707` - Tab navigation (All threads / Suggested replies / Archived threads)

---

## 1. Page Layout

### Overall Structure
The Threads page uses a **3-column layout**:

| Column | Width | Content |
|--------|-------|---------|
| **Sidebar (navigation)** | 288px | Standard TC Portal sidebar |
| **Thread list** | ~380px | Scrollable list of thread previews |
| **Thread detail** | Remaining (~1052px) | Timeline + right-side action panels |

The thread detail area itself splits into:
- **Timeline content** (left, ~668px) - Chronological activity feed
- **Action panel** (right, 320px) - Reply / AI Summary / Assign (contextual, appears when triggered)

### Page Header
- Title: "Threads" (20px, bold, `#13171d`)
- "CREATE NEW +" button: Top-right corner, teal background (`bg-[#007f7e]`), white text, rounded-full (`rounded-[20px]`), 36px height

---

## 2. Tab Navigation

Positioned below the page header, full width of the content area (excluding sidebar).

| Tab | Badge | Active Style |
|-----|-------|-------------|
| All threads | `12` (count badge) | Teal text `#007f7e`, bottom border 2px teal |
| Suggested replies | `3` (count badge) | Same when active |
| Archived threads | No badge | Same when active |

- Tab icons: Thread icon (message bubble), document icon, archive icon
- Tab height: 36px
- Bottom border separator: `#dbdbdb`
- Badge: Teal background `#007f7e`, white text, rounded-full, small (min-width ~20px)

---

## 3. Thread List (Left Panel)

### Search Bar
- Full-width search input at top of list panel
- Placeholder: "Search..."
- Magnifying glass icon on left
- Height: 56px with padding
- Border: `#dbdbdb`, rounded-md (6px)

### Filter Tiles
Below search, horizontal toggle tiles:
- **Filter** | **Email** | **SMS**
- Active tile: Teal border `#007f7e`, teal text
- Inactive tile: Gray border `#dbdbdb`, gray text
- Height: 32px, rounded-md

### Thread List Items

Each thread preview card:

**Layout** (vertical stack, 16px padding):
```
[Chevron?] [Avatar] [Sender Name] [Dot?] [Timestamp]
           [Subject Line - bold, 1 line]
           [Message Preview - 2 lines, gray text]
           [Avatars Group] [-- spacer --] [Metadata Counters]
```

**Dimensions**:
- Card padding: 15-16px horizontal, 16px vertical
- Card separator: 1px border bottom `#dbdbdb`
- Active/selected card: White background (same, but could highlight - TBD)

**Unread Indicator**:
- Blue dot (8px circle, `Ellipse 11`) next to sender name
- Sender name: Bold when unread

**Sender Row**:
- Avatar: 24px circle with initials, coloured background per user
- Sender name: 14px, bold, `#13171d`
- Timestamp: 14px, `#808080` (tertiary text), right-aligned
- Spacing: 10px gap between avatar and name

**Subject**:
- Font: 16px (larger than body), semibold, `#13171d`
- Truncate to 1 line

**Preview**:
- Font: 14px, `#666` (secondary text)
- Max 2 lines, truncated with "..."

**Expandable Threads** (with replies):
- Chevron-right icon (16px, `heroicons-solid/chevron-right`) on the left margin
- Content indented by ~24px when chevron present

**Metadata Row**:
- Avatar group: 24px avatars with -6px overlap (18px offset per additional avatar)
- Overflow: "+N" pill (24px height, small text)
- Counters (right-aligned): icon + count pairs
  - Envelope icon (`heroicons-outline/envelope`) + count
  - Paperclip icon (`heroicons-solid/paper-clip`) + count
  - Message icon (custom `message`) + count
  - Clipboard icon (`heroicons-outline/clipboard-document-list`) + count
- Counter spacing: ~39px between each counter group
- Counter text: 14px, `#666`
- Icon size: 16px

**CC Recipients** (some threads):
- "CC:" label in gray, followed by avatar group
- Appears in the metadata row for threads with CC'd recipients

---

## 4. Thread Detail (Main Content)

### Thread Header

**Row 1** (top):
```
[Subject Text] [Status Badge] [-- spacer --] [SUMMARISE btn] [Action Icons] [Kebab Menu]
```

- Subject: 20px, semibold, `#13171d`
- Status badge variants:
  - **Assigned**: Green/teal badge (`#bae8e7` bg, `#235234` text), checkmark icon
  - **Activity unassigned**: Red/orange badge (`#be373c` related), warning style
- SUMMARISE button: Sparkle icon + "SUMMARISE" text, no background (ghost button style)
- Action icons (24px each, 10px gap):
  - Undo (rotate-left arrow)
  - Reply (reply arrow)
  - Forward (share/forward arrow)
- Kebab menu: `heroicons-solid/ellipsis-vertical`, 24px

**Row 2** (metadata):
```
[Avatar Group] [-- spacer --] [Metadata Counters]
```
- Same avatar group and counter pattern as thread list
- Additional counter: Phone icon (`calls count`)

### Timeline

The timeline is a vertical stack of activity cards, grouped by date.

**Date Separators**:
- Right-aligned timestamp text: "Oct 09, 11:10AM", "Oct 10, 1:12PM"
- Font: 14px, `#666`
- Margin: 8px vertical spacing around

**Activity Type Icons** (left margin, outside content area):
Each activity has a small icon in the left gutter indicating its type:
- **Email**: Envelope icon (outline)
- **Call**: Phone icon
- **Internal Note**: Document/copy icon
- **Task**: Clipboard icon

Icon size: ~16px, color: `#666`, positioned at top of each activity card

---

## 5. Activity Card Types

### Email Card
```
[Avatar] [Sender Name]        [Timestamp] [Kebab]
[To] [Badge: Recipient 1] [Badge: Recipient 2]

[Email body text - full content]

[Attachment card if present]
```

- Sender avatar: 24px circle
- Sender name: 14px, bold, `#13171d`
- Timestamp: 14px, `#666`
- "To" label: 14px, `#666`
- Recipient badges: Light gray bg `#f3f4f6`, rounded-full, 20px height, 12px text
- Email body: 14px, `#13171d`, full whitespace-pre-wrap
- Background: White (default)

**Attachment**:
- Container: Light background `#f6fbfe`, rounded-md, 8px padding
- File icon: `file-check` icon, 24px, teal color
- Filename: 14px, teal `#007f7e` (clickable link style)
- File size: 14px, `#666`, right side

### Internal Note Card
- Background: **Teal/mint** `#f0fafa` or `#bae8e7` (distinguishing colour)
- "Internal Only" badge: Teal-outlined badge with checkmark, `#007f7e` border, `#003d3d` text
- Content: Same layout as email but with teal-tinted background
- Left margin icon: Document/copy icon

### Call Card
```
[Avatar] [Caller Name]
[Inbound Call badge] [Phone icon] [+1 (555) 123-4567]
```

- "Inbound Call" / "Outbound Call" badge: Teal text `#007f7e`, no background (inline label)
- Phone icon: Teal colour, inline with badge
- Phone number: 14px, `#13171d`
- Left margin icon: Phone icon
- Background: White

### Task Card (in timeline)
```
[Avatar] [Author Name]  [Complete badge]     [Timestamp] [Kebab]
[Task description text]
```

- "Complete" badge: Green background `#bae8e7`, dark green text `#235234`, rounded
- Task description: 14px, `#13171d`
- Tasks appear inline in the timeline chronologically

---

## 6. Right-Side Action Panels (320px)

### Reply Panel

**Header**:
```
Reply to                                    [X close]
```
- "Reply to": 16px, semibold
- X button: `heroicons-outline/x-mark`, 24px

**To Field**:
```
To  [John Davis X] [Steven Boge X]
```
- "To" label: 14px, `#666`
- Recipient badges: `#f3f4f6` bg, 20px height, with X remove button
- Badge text: 14px, `#13171d`

**Subject Field**:
```
Subject
[Re: Reimbursement for physiotherapy bill]
```
- Label: "Subject", 14px, `#666`
- Input: Standard text input, pre-filled

**Rich Text Editor**:
- Textarea/editor area: ~280px height, border `#dbdbdb`, rounded-md
- Formatting toolbar at bottom:
  - Bold, italic, underline, color picker, bullet list, etc.
  - Separator line above toolbar

**Action Buttons**:
```
[Sparkle GENERATE]                    [SEND]
```
- GENERATE: Sparkle icon + "GENERATE" text, teal text `#007f7e`, ghost button
- SEND: Teal background `#007f7e`, white text, rounded-md, right-aligned

### AI Summary Panel

**Header**:
```
AI Summary                                  [X close]
```

**Summary Content**:
- Light background card containing the summary text
- Font: 14px, `#13171d`
- Padding: 16px

**Action Buttons**:
```
[Sparkle REGENERATE]          [SAVE AS NOTE]
```
- REGENERATE: Sparkle icon + "REGENERATE", teal text, ghost button
- SAVE AS NOTE: Teal bg `#007f7e`, white text, rounded-md

**Suggested Tasks Section**:
```
Tasks
[Sparkle icon] [Task description]           [+]
[Sparkle icon] [Task description]           [+]
```
- "Tasks" heading: 14px, semibold
- Task cards: Light teal border `#bae8e7`, rounded-md, 8px padding
- Sparkle icon: Teal, 16px
- Task text: 14px, `#13171d`
- "+" button: Right-aligned, add to task list

### Assign to Package Panel

**Header**:
```
Assign to package                           [X close]
```

**Fields** (vertical stack):
```
[Person icon] Package
[Dropdown: Assign package ▼]
[Selected: Sarah Johnson - SJ-123456 +]

[Thread icon] Thread

[Tag icon] Tags
```

- Package dropdown: Standard select, full-width, `#dbdbdb` border
- Selected package: Teal-highlighted badge with "+" icon, teal text `#007f7e`, light teal bg
- Thread and Tags: Labeled fields (appear to be optional/expandable)

**Submit Button**:
```
                              [ASSIGN AND SAVE]
```
- Full-width at bottom of panel
- Teal bg `#007f7e`, white text, rounded-md

---

## 7. Design Tokens Summary

### Colours
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Teal | `#007f7e` | Active nav, buttons, links, badges, borders |
| Light Teal BG | `#f0fafa` | Internal note background |
| Teal Badge BG | `#bae8e7` | Status badges, task borders, selection highlight |
| Dark Teal Text | `#003d3d` | Badge text on teal backgrounds |
| Green Badge Text | `#235234` | "Complete" badge text |
| Red/Error | `#be373c` | Unassigned status, alerts |
| Primary Text | `#13171d` | Main content text |
| Secondary Text | `#666` | Timestamps, labels, counters |
| Tertiary Text | `#808080` | Faded timestamps, hints |
| Border | `#dbdbdb` | Card borders, separators, inputs |
| Light Gray BG | `#f3f4f6` | Badges, inactive tiles, input backgrounds |
| Page BG | `#f6fbfe` | Subtle background tint (attachment cards) |
| White | `#ffffff` | Card backgrounds, email cards |

### Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 20px | Semibold | `#13171d` |
| Thread subject | 16px | Semibold | `#13171d` |
| Body text | 14px | Regular | `#13171d` |
| Secondary text | 14px | Regular | `#666` |
| Tertiary/timestamp | 14px | Regular | `#808080` |
| Counter text | 14px | Regular | `#666` |
| Badge text | 12px | Medium | Varies |
| Small text | 10px | Regular | Varies |

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| Card padding | 16px | Thread list items, panels |
| Content gap (tight) | 4px | Icon + text pairs |
| Content gap (default) | 8px | Between elements |
| Content gap (medium) | 12px | Between cards |
| Content gap (large) | 16px | Section spacing |
| Avatar overlap | -6px (18px offset) | Avatar groups |
| Avatar size | 24px | All avatars |
| Icon size (inline) | 16px | Metadata counters, type indicators |
| Icon size (button) | 24px | Action buttons, close buttons |

### Border Radius
| Element | Radius |
|---------|--------|
| Cards / inputs | 6px (`rounded-md`) |
| Buttons | 6-8px |
| Badges (pill) | 20px (`rounded-full`) |
| Avatar | 50% (circle) |
| CREATE NEW button | 20px |

---

## 8. Sidebar Navigation Changes

The Figma design shows a restructured sidebar:

### Current Navigation (existing)
```
ACTIVITIES
  Home
  Tasks and reminders
  Email and SMS         <-- REMOVED
```

### New Navigation (from Figma)
```
[Dashboard icon] Dashboard
[Task icon] Tasks and reminders

COMMUNICATION
  [Phone icon] Calls
  [Thread icon] Threads  <-- NEW (highlighted when active, teal bg)

OPERATIONS
  [Plan icon] Service plans
  [Bill icon] Bills

CARE CIRCLE
  [Person icon] Clients
  [People icon] Care Coordinators
  [Building icon] Suppliers
```

Key changes:
- "Email and SMS" is **removed** from the sidebar
- New "COMMUNICATION" section groups Calls and Threads
- "Threads" replaces the Email and SMS concept
- "CARE CIRCLE" section now groups client/coordinator/supplier
- When active, Threads has teal background highlight (`bg-[#007f7e]`, white text)

---

## 9. Responsive Behaviour

Based on the Figma (desktop-only design at 1720px viewport):
- Thread list panel: Fixed 380px width
- Thread detail: Fills remaining width
- Action panels: Fixed 320px width, overlays/pushes content
- Minimum supported width: ~1280px (sidebar 288 + list 380 + detail ~612)
- No mobile/tablet designs present in Figma

---

## 10. Component Mapping to TC Portal

| Figma Element | TC Portal Component | Notes |
|--------------|-------------------|-------|
| Search Field | `CommonSearchInput` | Existing search component |
| Filter tiles | `CommonSelectTiles` (Legacy) | Used for Email/SMS toggle |
| Avatar | `CommonAvatar` | 24px size |
| Avatar Group | `CommonAvatarGroup` | With overlap and +N overflow |
| Badges (recipient, status) | `CommonBadge` | Various colour variants |
| Tab navigation | `CommonTabs` | `:items` prop with `title` field |
| Button (SEND, SAVE) | `CommonButton` | Teal primary variant |
| Button (GENERATE, REGENERATE) | `CommonButton` | Ghost/outline variant with icon |
| Kebab menu | `CommonDropdownMenu` | With `heroicons-solid/ellipsis-vertical` trigger |
| Text input | `CommonTextInput` | For subject, search |
| Textarea | `CommonTextArea` | For reply body |
| Select dropdown | `CommonSelectMenu` | For package assignment |
| Icons | `CommonIcon` | Heroicons + custom icons |
| Sidebar nav item | `CommonNavItems` | Existing sidebar pattern |
