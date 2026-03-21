---
title: "Mockup: Call Review Modal"
---

# Mockup: Call Review Modal

## Overview

The Call Review Modal is displayed when a coordinator clicks "Review" on a call. It provides all the information needed to review a call and log it as a care management activity.

---

## Full Modal Layout

```
+====================================================================================+
|                                                                                    |
|  +-- CALL REVIEW MODAL (Large) -------------------------------------------------+  |
|  |                                                                              |  |
|  |  +-- HEADER -------------------------------------------------------------+  |  |
|  |  |                                                        [X] Close      |  |  |
|  |  |  CALL REVIEW                                                          |  |  |
|  |  |                                                                       |  |  |
|  |  |  +-- CALL METADATA ------------------------------------------------+  |  |  |
|  |  |  |                                                                 |  |  |  |
|  |  |  |  [->] INBOUND CALL                         04 Feb 2026, 4:32 PM |  |  |  |
|  |  |  |                                                                 |  |  |  |
|  |  |  |  CALLER                    DURATION          YOUR EXTENSION     |  |  |  |
|  |  |  |  John Smith                12:45             Ext 2041           |  |  |  |
|  |  |  |  +61 400 123 456           (12m 45s)         Jane Doe           |  |  |  |
|  |  |  |  Care Circle Contact                                            |  |  |  |
|  |  |  |                                                                 |  |  |  |
|  |  |  +----------------------------------------------------------------+  |  |  |
|  |  |                                                                       |  |  |
|  |  +----------------------------------------------------------------------+  |  |
|  |                                                                              |  |
|  |  +-- AI SUMMARY (Collapsible - Expanded by default) ---------------------+  |  |
|  |  |                                                                       |  |  |
|  |  |  [v] AI SUMMARY                                          [Copy]      |  |  |
|  |  |  -----------------------------------------------------------------   |  |  |
|  |  |                                                                       |  |  |
|  |  |  John Smith called regarding his mother Mary Johnson's upcoming       |  |  |
|  |  |  physiotherapy appointment scheduled for next Tuesday. Key points:    |  |  |
|  |  |                                                                       |  |  |
|  |  |  * Requested appointment time change from 10am to 2pm                 |  |  |
|  |  |  * Confirmed transport is still needed                                |  |  |
|  |  |  * Asked about adding hydrotherapy to care plan                       |  |  |
|  |  |  * Mentioned Mary has been experiencing increased hip pain            |  |  |
|  |  |                                                                       |  |  |
|  |  |  ACTION ITEMS:                                                        |  |  |
|  |  |  - Reschedule physio appointment to 2pm Tuesday                       |  |  |
|  |  |  - Discuss hydrotherapy options with case manager                     |  |  |
|  |  |  - Note hip pain for next GP review                                   |  |  |
|  |  |                                                                       |  |  |
|  |  +----------------------------------------------------------------------+  |  |
|  |                                                                              |  |
|  |  +-- FULL TRANSCRIPTION (Collapsible - Collapsed by default) ------------+  |  |
|  |  |                                                                       |  |  |
|  |  |  [>] FULL TRANSCRIPTION (12:45)                      [Expand]        |  |  |
|  |  |                                                                       |  |  |
|  |  +----------------------------------------------------------------------+  |  |
|  |                                                                              |  |
|  |  +-- PACKAGE LINK -------------------------------------------------------+  |  |
|  |  |                                                                       |  |  |
|  |  |  LINKED PACKAGE                                                       |  |  |
|  |  |  -----------------------------------------------------------------   |  |  |
|  |  |                                                                       |  |  |
|  |  |  +-- PACKAGE CARD (Auto-matched) ---------------------------------+  |  |  |
|  |  |  |                                                                |  |  |  |
|  |  |  |  [CHECK ICON] Auto-matched from phone number                   |  |  |  |
|  |  |  |                                                                |  |  |  |
|  |  |  |  #12345 - Mary Johnson                          [View Package] |  |  |  |
|  |  |  |  Home Care Package - Level 3                                   |  |  |  |
|  |  |  |  Care Coordinator: Jane Doe                                    |  |  |  |
|  |  |  |                                                                |  |  |  |
|  |  |  |  Care Circle Contact: John Smith (Son)                         |  |  |  |
|  |  |  |  +61 400 123 456                                               |  |  |  |
|  |  |  |                                                                |  |  |  |
|  |  |  +----------------------------------------------------------------+  |  |  |
|  |  |                                                                       |  |  |
|  |  |  [Change Package]                                                     |  |  |
|  |  |                                                                       |  |  |
|  |  +----------------------------------------------------------------------+  |  |
|  |                                                                              |  |
|  |  +-- CASE NOTE (Optional) -----------------------------------------------+  |  |
|  |  |                                                                       |  |  |
|  |  |  ADD CASE NOTE (Optional)                                             |  |  |
|  |  |  -----------------------------------------------------------------   |  |  |
|  |  |                                                                       |  |  |
|  |  |  +---------------------------------------------------------------+   |  |  |
|  |  |  |                                                               |   |  |  |
|  |  |  | Add any additional notes about this call...                   |   |  |  |
|  |  |  |                                                               |   |  |  |
|  |  |  |                                                               |   |  |  |
|  |  |  +---------------------------------------------------------------+   |  |  |
|  |  |                                                                       |  |  |
|  |  |  [ ] Use AI summary as case note                                      |  |  |
|  |  |                                                                       |  |  |
|  |  +----------------------------------------------------------------------+  |  |
|  |                                                                              |  |
|  |  +-- FOOTER/ACTIONS -----------------------------------------------------+  |  |
|  |  |                                                                       |  |  |
|  |  |  [Mark as Non-Package Call]           [Cancel]  [Complete Call Review]|  |  |
|  |  |                                        (gray)         (primary)       |  |  |
|  |  |                                                                       |  |  |
|  |  +----------------------------------------------------------------------+  |  |
|  |                                                                              |  |
|  +------------------------------------------------------------------------------+  |
|                                                                                    |
+====================================================================================+
```

---

## Expanded Transcription View

```
+-- FULL TRANSCRIPTION (Collapsible - EXPANDED) --------------------------------+
|                                                                               |
|  [v] FULL TRANSCRIPTION (12:45)                         [Collapse] [Copy]    |
|  -----------------------------------------------------------------------------
|                                                                               |
|  +-- TRANSCRIPTION VIEWER ------------------------------------------------+  |
|  |                                                                        |  |
|  |  [4:32:15] CALLER (John Smith):                                        |  |
|  |  Hi, this is John Smith calling about my mother Mary Johnson.          |  |
|  |                                                                        |  |
|  |  [4:32:22] COORDINATOR (Jane Doe):                                     |  |
|  |  Hello John, thanks for calling Trilogy Care. I can see Mary's         |  |
|  |  file here. How can I help you today?                                  |  |
|  |                                                                        |  |
|  |  [4:32:35] CALLER (John Smith):                                        |  |
|  |  I need to change her physiotherapy appointment that's scheduled       |  |
|  |  for next Tuesday. The 10am slot doesn't work anymore, is there        |  |
|  |  any chance we could move it to the afternoon?                         |  |
|  |                                                                        |  |
|  |  [4:32:52] COORDINATOR (Jane Doe):                                     |  |
|  |  Let me check the physio's availability for Tuesday afternoon...       |  |
|  |  I can see there's a 2pm slot available. Would that work?              |  |
|  |                                                                        |  |
|  |  [4:33:08] CALLER (John Smith):                                        |  |
|  |  Yes, 2pm would be perfect. She still needs the transport too.         |  |
|  |                                                                        |  |
|  |  ... [continues]                                                       |  |
|  |                                                                        |  |
|  |  +-- SCROLL INDICATOR -----------------------------------------------+ |  |
|  |  |                    [Scroll for more]                              | |  |
|  |  +-------------------------------------------------------------------+ |  |
|  |                                                                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## Unlinked Package State

When no package is auto-matched, the Package Link section shows a search interface:

```
+-- PACKAGE LINK (UNLINKED STATE) ---------------------------------------------+
|                                                                              |
|  LINKED PACKAGE                                                              |
|  ----------------------------------------------------------------------------
|                                                                              |
|  +-- WARNING BANNER -----------------------------------------------------+  |
|  |  [!] No package match found. Please search and link a package to      |  |
|  |      complete this review, or mark as a non-package call.             |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  +-- SEARCH INTERFACE ---------------------------------------------------+  |
|  |                                                                       |  |
|  |  Search for Package                                                   |  |
|  |  +-------------------------------------------------------------------+|  |
|  |  | [Search icon] Search by name, package #, TC customer #...         ||  |
|  |  +-------------------------------------------------------------------+|  |
|  |                                                                       |  |
|  |  +-- SEARCH RESULTS (after typing) -------------------------------+  |  |
|  |  |                                                                 |  |  |
|  |  |  +-- RESULT ROW (clickable) --------------------------------+  |  |  |
|  |  |  | #12345 - Mary Johnson                                    |  |  |  |
|  |  |  | Home Care Package - Level 3                              |  |  |  |
|  |  |  | Care Circle: John Smith (Son) - matches caller           |  |  |  |
|  |  |  +----------------------------------------------------------+  |  |  |
|  |  |                                                                 |  |  |
|  |  |  +-- RESULT ROW (clickable) --------------------------------+  |  |  |
|  |  |  | #12567 - Mary Johnston                                   |  |  |  |
|  |  |  | Home Care Package - Level 2                              |  |  |  |
|  |  |  | Care Circle: Peter Johnston (Husband)                    |  |  |  |
|  |  |  +----------------------------------------------------------+  |  |  |
|  |  |                                                                 |  |  |
|  |  +----------------------------------------------------------------+  |  |
|  |                                                                       |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Multiple Package Match State

When the phone number matches multiple packages:

```
+-- PACKAGE LINK (MULTIPLE MATCHES) -------------------------------------------+
|                                                                              |
|  LINKED PACKAGE                                                              |
|  ----------------------------------------------------------------------------
|                                                                              |
|  +-- INFO BANNER --------------------------------------------------------+  |
|  |  [i] This phone number is associated with multiple packages.          |  |
|  |      Please select the correct package for this call.                 |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  +-- PACKAGE OPTIONS (radio selection) ----------------------------------+  |
|  |                                                                       |  |
|  |  ( ) #12345 - Mary Johnson                                            |  |
|  |      Home Care Package - Level 3                                      |  |
|  |      John Smith is Care Circle Contact (Son)                          |  |
|  |                                                                       |  |
|  |  ( ) #12678 - Robert Smith                                            |  |
|  |      Home Care Package - Level 4                                      |  |
|  |      John Smith is Care Circle Contact (Son)                          |  |
|  |                                                                       |  |
|  |  ( ) #12891 - Elizabeth Smith                                         |  |
|  |      Respite Care Package                                             |  |
|  |      John Smith is Care Circle Contact (Nephew)                       |  |
|  |                                                                       |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  [Search for different package]                                              |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Validation States

### Missing Package Link Warning

```
+-- FOOTER/ACTIONS (with validation) ------------------------------------------+
|                                                                              |
|  +-- VALIDATION WARNING -------------------------------------------------+  |
|  |  [!] Please link a package or mark as non-package call to continue   |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  [Mark as Non-Package Call]              [Cancel]  [Complete Call Review]   |
|                                                     (disabled/grayed)       |
|                                                                              |
+------------------------------------------------------------------------------+
```

### Success State (after completion)

```
+-- SUCCESS TOAST (appears briefly) -------------------------------------------+
|                                                                              |
|  [CHECK] Call review completed. Activity logged to Package #12345.          |
|                                                                [Undo - 10s] |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Modal States

### Loading State

```
+-- CALL REVIEW MODAL (LOADING) -----------------------------------------------+
|                                                                              |
|  CALL REVIEW                                                     [X] Close  |
|                                                                              |
|  +-- METADATA SKELETON --------------------------------------------------+  |
|  |  ████████████████     ████████████                                    |  |
|  |  ░░░░░░░░░░░░░░░     ░░░░░░░░░░░░                                    |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  +-- AI SUMMARY SKELETON ------------------------------------------------+  |
|  |  ████████████████████████████████████████████████████████████████     |  |
|  |  ████████████████████████████████████████████████████                 |  |
|  |  ████████████████████████████████████████████                         |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  +-- PACKAGE SKELETON ---------------------------------------------------+  |
|  |  ██████████████████████                                               |  |
|  |  ░░░░░░░░░░░░░░░░░░░░░░                                               |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
|  (████ = Pulsing skeleton bars)                                              |
|                                                                              |
+------------------------------------------------------------------------------+
```

### Transcription Processing

```
+-- FULL TRANSCRIPTION (PROCESSING) -------------------------------------------+
|                                                                              |
|  [>] FULL TRANSCRIPTION                                                      |
|                                                                              |
|  +-- PROCESSING STATE ---------------------------------------------------+  |
|  |                                                                       |  |
|  |      [Spinner]  Transcription processing...                           |  |
|  |                                                                       |  |
|  |      Estimated time remaining: 2 minutes                              |  |
|  |                                                                       |  |
|  +-----------------------------------------------------------------------+  |
|                                                                              |
+------------------------------------------------------------------------------+
```

---

## Responsive Behavior

- **Desktop (1200px+)**: Full modal as shown, side-by-side metadata
- **Tablet (768-1199px)**: Stacked layout, full-width sections
- **Mobile**: Out of scope for MVP

---

## Component Mapping (Storybook)

| Element | Component | Props |
|---------|-----------|-------|
| Modal container | `CommonModal` | size="lg" |
| AI Summary | `CommonCollapsible` | defaultOpen=true |
| Transcription | `CommonCollapsible` + `TranscriptionViewer` (new) | defaultOpen=false |
| Package card | `CommonCard` | - |
| Search input | `CommonInput` | type="search" |
| Case note textarea | `CommonTextarea` | rows=4 |
| Action buttons | `CommonButton` | variant="primary/secondary/text" |
| Validation warning | `CommonAlert` | type="warning" |
| Success toast | `CommonToast` | type="success" |
