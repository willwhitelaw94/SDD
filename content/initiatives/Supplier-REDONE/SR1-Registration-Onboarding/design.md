---
title: "Design: Supplier Registration & Onboarding"
---

**Status:** Draft
**Designer:** Bruce (AI) / Vishal (progress indicator redesign)
**Feature Spec:** [spec.md](/initiatives/supplier-redone/sr1-registration-onboarding/spec)
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Overview

SR1 is the primary consumer-facing entry point for the supplier portal. Suppliers register via ABN lookup, then complete a 5-step sequential onboarding wizard (Business Details, Locations, Pricing, Documents, Agreements) with an always-visible progress indicator. After onboarding, suppliers enter verification (lite or heavy path) with EFTSure bank verification. The entire flow must work flawlessly on mobile — suppliers register on phones and iPhone-specific failures have been flagged.

---

## Design Resources

### Figma

| File | Link | Description |
|------|------|-------------|
| Onboarding Progress Indicator | TBD — Vishal's redesign in backlog | Step indicator component for all onboarding screens |
| Registration & Onboarding Flows | TBD | Full flow screens |

### Other Resources

| Type | Link | Description |
|------|------|-------------|
| TC Brand Guidelines | Internal | Navy #2C4C79, Teal #007F7E, Green #4DC375, Orange #FF8F51, Red #E04B51 |
| Shadcn/ui | https://ui.shadcn.com | Component library for the React frontend |
| ABR API | https://abr.business.gov.au/ | Australian Business Register — ABN lookup |

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | Supplier (new registrant, Organisation Administrator for Tier 2) | Registration is the entry point for all suppliers |
| **Device Priority** | Mobile-first | Suppliers register on phones; iPhone bugs flagged. Mobile completion must be within 10% of desktop (SC-004). |
| **Usage Pattern** | One-time registration, sequential onboarding over days/weeks | Not a daily task — clarity and progress visibility are critical |
| **Information Density** | Spacious-friendly | One step at a time. Reduce cognitive load. No dense tables or multi-column forms during onboarding. |

---

## Layout & Structure

### Page Types

- **Registration**: Single-page form (ABN lookup + account creation)
- **Onboarding Wizard**: Multi-step wizard with persistent progress indicator
- **Verification Dashboard**: Status page with read-only preview

### Navigation Pattern

- **Registration**: No navigation (pre-auth, single purpose)
- **Onboarding**: Vertical progress indicator (sidebar on desktop, horizontal stepper on mobile) + step content area
- **Verification**: Standard app shell with dashboard navigation

### Content Layout — Onboarding (Desktop)

```
+-----------------------------------------------------------+
| [TC Logo]                          [Acme Pty Ltd v] [?]   |
+-----------------------------------------------------------+
| +---------------+ +-------------------------------------+ |
| |               | |                                     | |
| | PROGRESS      | |         STEP CONTENT                | |
| |               | |                                     | |
| | * Business    | |   [Form fields for current step]    | |
| |   Details     | |                                     | |
| |               | |                                     | |
| | o Locations   | |                                     | |
| |               | |                                     | |
| | o Pricing     | |                                     | |
| |               | |                                     | |
| | o Documents   | |                                     | |
| |               | |                                     | |
| | o Agreements  | |                                     | |
| |               | |                                     | |
| +---------------+ +-------------------------------------+ |
|                    |          [Back]  [Continue]          | |
|                    +-------------------------------------+ |
+-----------------------------------------------------------+
```

### Content Layout — Onboarding (Mobile)

```
+---------------------------+
| [=] TC Logo     [Acme v]  |
+---------------------------+
| [*]--[o]--[o]--[o]--[o]  |
|  1    2    3    4    5    |
+---------------------------+
|                           |
|   Step 1: Business        |
|   Details                 |
|                           |
|   Legal Name              |
|   [____________________]  |
|                           |
|   Trading Name            |
|   [____________________]  |
|                           |
|   Business Type           |
|   [____________________]  |
|                           |
|   ... more fields ...     |
|                           |
|   [====== Continue ======]|
|                           |
+---------------------------+
```

---

## Component Inventory

### Shadcn/ui Components Used

| Component | Usage | Notes |
|-----------|-------|-------|
| `Card` | Registration form, each onboarding step content area | White card on gray-50 background |
| `Input` | All text fields (ABN, names, addresses, contacts) | With label and inline validation |
| `Button` | Continue, Back, Submit, Add Location | Primary = Navy, Secondary = outline |
| `Select` | Business name dropdown (from ABR), business type, service model | Shadcn Select with search for ABR results |
| `RadioGroup` | Service delivery model (Direct/Subcontractor/Both) | Horizontal on desktop, vertical on mobile |
| `Checkbox` | Agreement consent, document checklist | |
| `Badge` | Step status, verification status, EFTSure indicators | Green/Yellow/Red for verification |
| `Alert` | ABN errors, duplicate ABN, validation errors | Destructive for errors, warning for duplicates |
| `Progress` | Step completion within progress indicator | Visual bar showing overall completion |
| `Skeleton` | Loading states for ABR lookup, step transitions | Prevents layout shift |
| `Accordion` | Document categories in Documents step | Group documents by type |
| `ScrollArea` | Agreement text (must scroll before signing) | Tracks scroll position for informed consent |
| `Stepper` (custom) | Progress indicator (see below) | Based on Vishal's redesign |

### New Components Needed

- [ ] **OnboardingProgress** — Always-visible progress indicator showing 5 onboarding steps. States: complete (green checkmark), current (teal highlight + ring), upcoming (gray), rejected (red warning icon with tooltip). Vertical sidebar on desktop, horizontal stepper on mobile. Vishal has a redesign in backlog.
- [ ] **AbnLookupField** — Input field with ABN formatting (XX XXX XXX XXX), debounced ABR API lookup on valid 11-digit entry, shows business name results in a selectable dropdown. Handles ABR unavailability with clear error.
- [ ] **EftSureIndicator** — Traffic light component (green/yellow/red) showing bank verification stage. Three dots with progressive fill. Red includes actionable message.
- [ ] **VerificationStatusCard** — Card showing current portal stage (PENDING_VERIFICATION) with expected timeline, EFTSure status, and document review status.
- [ ] **DocumentUploadChecklist** — Checklist of required documents by type. Shows upload status (not uploaded / uploaded / approved / rejected with reason). Upload button per item. Groups by org-level vs supplier-level.
- [ ] **AgreementViewer** — Scrollable agreement text with scroll-tracking. "Sign" button disabled until user scrolls to bottom. Shows agreement version and type.

### Pattern References

| Aspect | Reference | Notes |
|--------|-----------|-------|
| Multi-step wizard | Shadcn Stepper pattern | Adapt for 5-step sequential flow |
| ABN lookup | Existing `useAbnLookup` composable | Validate v2 API compatibility |
| Address autocomplete | Google Places API | Australian address search with auto-fill for suburb/state/postcode (CL-005) |
| File upload | Shadcn file upload patterns | Drag-and-drop on desktop, tap-to-upload on mobile |
| Traffic light status | EFTSure 3-stage model | Green = verified, Yellow = pending, Red = refused |

---

## Interaction Design

### Registration Flow

| Aspect | Decision | Details |
|--------|----------|---------|
| **ABN Entry** | Formatted input (XX XXX XXX XXX) | Auto-formats as user types, debounced ABR lookup after 11 digits entered |
| **ABR Lookup** | Async with loading spinner in field | Shows results dropdown on success, error alert on failure |
| **Business Name Selection** | Dropdown from ABR results | Pre-selects if only one result; user picks if multiple |
| **Duplicate ABN Detection** | Server-side on submit | Shows alert with link to request access from existing Organisation Administrator |
| **reCAPTCHA** | Invisible reCAPTCHA v3 | No user interaction required; block + error on failure |
| **Validation** | Inline on blur + submit-time | Field-level errors appear below each field |

### Onboarding Wizard

| Aspect | Decision | Details |
|--------|----------|---------|
| **Step Navigation** | Sequential first pass (forward-only until completed); free navigation after all steps done | Back button returns to previous step; progress indicator is clickable only for completed steps |
| **Draft Persistence** | Auto-save on blur / every 30 seconds | Uses API to persist partial data; no "Save Draft" button needed |
| **Validation** | Per-step client-side + server-side on Continue | Continue button triggers validation; errors shown inline |
| **Step Transitions** | Animate slide-left/slide-right | Content area transitions between steps |
| **Mobile Gestures** | Swipe not supported | Prevents accidental navigation; explicit button taps only |
| **Return Visit** | "Welcome back" banner + resume on last step | Auto-saved draft pre-filled; banner dismissible (CL-001) |
| **Reminder Emails** | Deep-link to exact step | URL includes step param, routes after auth (CL-003) |

### Document Upload

| Aspect | Decision | Details |
|--------|----------|---------|
| **Upload Method** | Click to browse (all devices) + drag-and-drop (desktop) | Mobile-optimised file picker |
| **File Types** | PDF, JPG, PNG | Validated client-side and server-side |
| **Max Size** | 10MB per file | Client-side check with clear error |
| **Upload Feedback** | Progress bar per file | Show percentage during upload |
| **Rejection Resubmission** | Replace button on rejected documents | Old document archived, new one uploaded |

### Agreement Signing

| Aspect | Decision | Details |
|--------|----------|---------|
| **Scroll Requirement** | Must scroll to bottom before Sign button enables | Tracks scroll position; button shows "Scroll to continue reading" while disabled |
| **Signature** | Checkbox consent ("I agree to the terms") + name field | Not a drawn signature |
| **Subcontractor** | Shows both Supplier Agreement and APA | Must sign both; sequential presentation |

### Special Interactions

| Feature | Needed? | Details |
|---------|---------|---------|
| Bulk actions | No | Single-step at a time |
| Drag & drop | Yes (desktop only) | Document upload |
| Search | No | Not needed during onboarding |
| Keyboard shortcuts | No | Mobile-first; no keyboard shortcuts |
| Real-time updates | Yes — polling | Verification status during PENDING_VERIFICATION (poll every 30s) |

---

## States

### Loading States

| Context | Treatment | Duration Threshold |
|---------|-----------|-------------------|
| ABN lookup | Spinner inside input field + "Looking up ABN..." | Immediate on valid 11 digits |
| Business name dropdown | Skeleton list items | Show after 200ms |
| Step content load | Skeleton form matching field layout | Show after 200ms |
| Document upload | Progress bar per file | Immediate |
| Step transition | Slide animation with skeleton content | Immediate |
| Verification status | Polling skeleton refresh | Every 30 seconds |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No locations added yet | "Add your first service location to continue." | "Add Location" button |
| No documents uploaded | "Upload the required documents below to proceed." | Upload buttons per document type |
| No pricing set | "Set your service rates for each location." | Per-location pricing form |
| Verification in progress | "We're reviewing your application. This usually takes less than 48 hours." | None (informational) |
| ABR API unavailable | "We're unable to verify your ABN right now. Please try again shortly." | "Try Again" button |

### Error States

| Scenario | Handling |
|----------|----------|
| Invalid ABN format | Inline error: "Please enter a valid 11-digit ABN." |
| ABN not found in ABR | Alert: "This ABN was not found in the Australian Business Register. Please check and try again." |
| ABR API unavailable | Alert: "We're unable to verify your ABN right now. Please try again shortly." + retry button |
| Duplicate ABN | Warning alert: "An organisation with this ABN already exists. You can request access from the existing administrator." + "Request Access" link |
| reCAPTCHA failure | Alert: "Verification failed. Please try again." |
| File too large | Inline error below upload: "File must be under 10MB. Your file is [X]MB." |
| Wrong file type | Inline error: "Only PDF, JPG, and PNG files are accepted." |
| Document rejected by Compliance | Red badge on document + rejection reason visible on hover/tap. Step re-opens with warning icon in progress indicator. |
| EFTSure refused (red) | Red indicator with message: "Bank verification could not be completed. Please update your bank details or contact support." |
| Network error during save | Toast: "Unable to save. Your changes will be saved when your connection returns." + auto-retry |
| Session expired during onboarding | Redirect to login; draft data preserved server-side; user returns to where they left off |

---

## Progress Indicator Design

The progress indicator is the most important UX element in onboarding. Vishal has a redesign in the backlog.

### Step States

| State | Visual | Icon | Text Style |
|-------|--------|------|------------|
| **Complete** | Green circle | Checkmark | Normal weight, gray-700 |
| **Current** | Teal circle with ring/pulse | Step number | Bold, gray-900 |
| **Upcoming** | Gray circle | Step number | Normal weight, gray-400 |
| **Rejected** | Red circle with warning | Exclamation | Normal weight, red-600 |

### Desktop Layout (Vertical Sidebar)

```
+-------------------+
|   YOUR PROGRESS   |
|                   |
|   [*] Business    |
|    |  Details     |
|    |              |
|   [@] Locations   |  <-- @ = current (teal, pulsing)
|    |              |
|   [ ] Pricing     |  <-- upcoming (gray)
|    |              |
|   [ ] Documents   |
|    |              |
|   [ ] Agreements  |
|                   |
|   +-----------+   |
|   | 1 of 5    |   |
|   | completed |   |
|   +-----------+   |
+-------------------+

Legend: [*] = complete (green check)
        [@] = current (teal ring)
        [ ] = upcoming (gray)
        [!] = rejected (red warning)
```

### Mobile Layout (Horizontal Stepper)

```
+-------------------------------------------+
|  [*]----[@]----[ ]----[ ]----[ ]          |
|   1      2      3      4      5          |
|  Biz   Loc   Price  Docs   Agree        |
+-------------------------------------------+
```

- Abbreviated labels on mobile
- Connected by a line showing progress (solid teal for completed segments, dashed gray for upcoming)
- Current step has a subtle pulse animation
- Tap on completed step navigates back (after initial completion)

### Rejected Step (Desktop)

```
+-------------------+
|   YOUR PROGRESS   |
|                   |
|   [*] Business    |
|    |  Details     |
|    |              |
|   [*] Locations   |
|    |              |
|   [*] Pricing     |
|    |              |
|   [!] Documents   |  <-- red warning, tooltip: "1 document rejected"
|    |              |
|   [*] Agreements  |
|                   |
|   +-----------+   |
|   | Action    |   |
|   | required  |   |
|   +-----------+   |
+-------------------+
```

---

## Wireframes

### Registration Page — ABN Lookup

```
+-----------------------------------------------+
|            [TC Logo]                           |
|                                                |
|    +------------------------------------+      |
|    |    Register Your Business          |      |
|    |                                    |      |
|    |    ABN *                           |      |
|    |    [12 345 678 9__|  [Searching...] |     |
|    |                                    |      |
|    |    +------------------------------+|      |
|    |    | Acme Services Pty Ltd        ||      |
|    |    | Acme Holdings Pty Ltd        ||      |
|    |    +------------------------------+|      |
|    |                                    |      |
|    |    Selected: Acme Services Pty Ltd |      |
|    |                                    |      |
|    |    Your Name *                     |      |
|    |    [____________________________] |      |
|    |                                    |      |
|    |    Email *                         |      |
|    |    [____________________________] |      |
|    |                                    |      |
|    |    Password *                      |      |
|    |    [____________________________] |      |
|    |                                    |      |
|    |    Confirm Password *              |      |
|    |    [____________________________] |      |
|    |                                    |      |
|    |    [===== Create Account =====]   |      |
|    |                                    |      |
|    |    Already have an account?        |      |
|    |    Log in                          |      |
|    +------------------------------------+      |
|                                                |
+-----------------------------------------------+
```

**Notes:** ABN field auto-formats with spaces. Dropdown appears when ABR returns results. If ABR returns a single trading name, it auto-selects and shows as "Selected: [name]" without a dropdown.

### Registration Page — Duplicate ABN

```
+------------------------------------+
|    Register Your Business          |
|                                    |
|    ABN *                           |
|    [12 345 678 901____________]    |
|                                    |
|    +------------------------------+|
|    | /!\ This ABN is already      ||
|    | registered. Contact the      ||
|    | existing administrator to    ||
|    | request access.              ||
|    |                              ||
|    | [Request Access]             ||
|    +------------------------------+|
|                                    |
+------------------------------------+
```

### Registration Page — Mobile

```
+---------------------------+
| [TC Logo]                 |
|                           |
| Register Your Business    |
|                           |
| ABN *                     |
| [12 345 678 9__]          |
|   Looking up ABN...       |
|                           |
| +------------------------+|
| | Acme Services Pty Ltd  ||
| | Acme Holdings Pty Ltd  ||
| +------------------------+|
|                           |
| Your Name *               |
| [______________________]  |
|                           |
| Email *                   |
| [______________________]  |
|                           |
| Password *                |
| [______________________]  |
|                           |
| Confirm Password *        |
| [______________________]  |
|                           |
| [=== Create Account ===]  |
|                           |
| Already have an account?  |
| Log in                    |
+---------------------------+
```

**Notes:** Full-width form, no card border on mobile. Touch targets 48px minimum. Keyboard-appropriate input types (email for email, tel for ABN if numeric-only keyboard helps).

### Onboarding — Business Details Step

```
+-----------------------------------------------------------+
| [TC Logo]                           [Acme Pty Ltd v] [?]  |
+-----------------------------------------------------------+
| +---------------+ +-------------------------------------+ |
| | YOUR PROGRESS | |  Step 1: Business Details            | |
| |               | |                                     | |
| | [@] Business  | |  Legal Name                         | |
| |  |  Details   | |  [Acme Services Pty Ltd_________]   | |
| |  |            | |                                     | |
| | [ ] Locations | |  Trading Name (if different)        | |
| |  |            | |  [_____________________________]    | |
| | [ ] Pricing   | |                                     | |
| |  |            | |  Business Type *                    | |
| | [ ] Documents | |  [v Sole Trader______________ ]     | |
| |  |            | |                                     | |
| | [ ] Agreements| |  Service Delivery Model *           | |
| |               | |  ( ) Direct Provider                | |
| |               | |  ( ) Subcontractor                  | |
| |               | |  ( ) Both                           | |
| |               | |                                     | |
| | +-----------+ | |  Primary Contact Name *             | |
| | |  0 of 5   | | |  [_____________________________]    | |
| | | completed | | |                                     | |
| | +-----------+ | |  Primary Contact Email *            | |
| +---------------+ |  [_____________________________]    | |
|                    |                                     | |
|                    |  Primary Contact Phone *            | |
|                    |  [_____________________________]    | |
|                    |                                     | |
|                    |          [Continue -->]              | |
|                    +-------------------------------------+ |
+-----------------------------------------------------------+
```

### Onboarding — Locations Step

```
+-----------------------------------------------------------+
| +---------------+ +-------------------------------------+ |
| | YOUR PROGRESS | |  Step 2: Locations                   | |
| |               | |                                     | |
| | [*] Business  | |  Add the locations where you        | |
| |  |  Details   | |  provide services.                  | |
| |  |            | |                                     | |
| | [@] Locations | |  +-------------------------------+  | |
| |  |            | |  | 123 Main St, Sydney NSW 2000  |  | |
| | [ ] Pricing   | |  | Service radius: 25km          |  | |
| |  |            | |  | Contact: Jane (0400 000 000)  |  | |
| | [ ] Documents | |  |               [Edit] [Remove] |  | |
| |  |            | |  +-------------------------------+  | |
| | [ ] Agreements| |                                     | |
| |               | |  [+ Add another location]           | |
| +---------------+ |                                     | |
|                    |        [<-- Back]  [Continue -->]   | |
|                    +-------------------------------------+ |
+-----------------------------------------------------------+
```

### Onboarding — Documents Step

```
+-----------------------------------------------------------+
| +---------------+ +-------------------------------------+ |
| | YOUR PROGRESS | |  Step 4: Documents                   | |
| |               | |                                     | |
| | [*] Business  | |  Organisation Documents (shared)    | |
| |  |  Details   | |                                     | |
| |  |            | |  [*] Public Liability Insurance     | |
| | [*] Locations | |      uploaded 2 Mar 2026            | |
| |  |            | |  [*] ABN Verification               | |
| | [*] Pricing   | |      uploaded 2 Mar 2026            | |
| |  |            | |  [ ] Workers Compensation           | |
| | [@] Documents | |      [Upload]                       | |
| |  |            | |                                     | |
| | [ ] Agreements| |  Service-Specific Documents         | |
| |               | |                                     | |
| |               | |  [ ] Professional Indemnity         | |
| | +-----------+ | |      [Upload]                       | |
| | |  3 of 5   | | |  [!] Police Check Certificate       | |
| | | completed | | |      REJECTED: "Expired. Please     | |
| | +-----------+ | |      upload a current certificate."  | |
| +---------------+ |      [Re-upload]                     | |
|                    |                                     | |
|                    |        [<-- Back]  [Continue -->]   | |
|                    +-------------------------------------+ |
+-----------------------------------------------------------+
```

**Notes:** Organisation-level documents are shared across all supplier entities under the same ABN (FR-017). When adding a second supplier entity, org-level documents are pre-populated (FR-018). Rejected documents show the reason inline with a red badge and "Re-upload" button.

### Onboarding — Agreements Step

```
+-----------------------------------------------------------+
| +---------------+ +-------------------------------------+ |
| | YOUR PROGRESS | |  Step 5: Agreements                  | |
| |               | |                                     | |
| | [*] Business  | |  Supplier Agreement v2.1             | |
| |  |  Details   | |  +-------------------------------+  | |
| |  |            | |  |                               |  | |
| | [*] Locations | |  |  1. DEFINITIONS               |  | |
| |  |            | |  |  In this Agreement:            |  | |
| | [*] Pricing   | |  |  "Provider" means...           |  | |
| |  |            | |  |  "Services" means...           |  | |
| | [*] Documents | |  |  ...                           |  | |
| |  |            | |  |  (scroll to continue)          |  | |
| | [@] Agreements| |  |                               |  | |
| |               | |  +-------------------------------+  | |
| |               | |                                     | |
| | +-----------+ | |  [ ] I have read and agree to the   | |
| | |  4 of 5   | | |      terms of this agreement.       | |
| | | completed | | |                                     | |
| | +-----------+ | |  Full Name: [_________________]     | |
| +---------------+ |                                     | |
|                    |  [Scroll to continue reading]       | |
|                    |  (becomes [Sign Agreement] after    | |
|                    |   scrolling to bottom)              | |
|                    +-------------------------------------+ |
+-----------------------------------------------------------+
```

**Notes:** The "Sign Agreement" button is disabled and shows "Scroll to continue reading" until the user scrolls to the bottom of the agreement text. For subcontractors, after signing the Supplier Agreement, the APA is presented as a second agreement to sign (FR-015).

### Verification Dashboard — PENDING_VERIFICATION

```
+-----------------------------------------------------------+
| [TC Logo]  Dashboard  Profile  Documents  | Acme Pty v |  |
+-----------------------------------------------------------+
|                                                            |
|  +------------------------------------------------------+ |
|  |  Verification In Progress                             | |
|  |                                                       | |
|  |  Your application is being reviewed. This usually     | |
|  |  takes less than 48 hours.                            | |
|  |                                                       | |
|  |  +-------------+  +-------------+  +-------------+   | |
|  |  | Documents   |  | Bank Details|  | Compliance  |   | |
|  |  |   [*]       |  |   [O]       |  |   [O]       |   | |
|  |  |  Complete   |  |  Verifying  |  |  Reviewing  |   | |
|  |  +-------------+  +-------------+  +-------------+   | |
|  +------------------------------------------------------+ |
|                                                            |
|  +------------------------------------------------------+ |
|  |  Dashboard Preview (Read-Only)                        | |
|  |                                                       | |
|  |  You can explore your profile, but billing and        | |
|  |  service matching are available after verification.   | |
|  |                                                       | |
|  |  [Profile]  [Locations]  [Pricing]  [Documents]       | |
|  +------------------------------------------------------+ |
|                                                            |
+-----------------------------------------------------------+

Legend: [*] = complete (green), [O] = in progress (yellow)
```

### EFTSure Verification Indicators

```
Stage 1 pending:    [O]---[ ]---[ ]   "Bank verification started"
Stage 1 complete:   [*]---[O]---[ ]   "Stage 1 complete"
All 3 complete:     [*]---[*]---[*]   "Bank details verified" (green)
Refused:            [X]               "Verification failed" (red)
                                      "Please update your bank details
                                       or contact support."
```

### Verification Dashboard — Mobile

```
+---------------------------+
| [=] TC Logo    [Acme v]   |
+---------------------------+
|                           |
| Verification In Progress  |
|                           |
| Your application is being |
| reviewed. Usually < 48hrs.|
|                           |
| +------------------------+|
| | Documents    [*]       ||
| | Complete               ||
| +------------------------+|
| | Bank Details [O]       ||
| | Verifying              ||
| +------------------------+|
| | Compliance   [O]       ||
| | Reviewing              ||
| +------------------------+|
|                           |
| Dashboard Preview         |
| (Read-Only)               |
|                           |
| [Profile] [Locations]     |
| [Pricing] [Documents]     |
|                           |
+---------------------------+
```

### Add Supplier Entity (Tier 2)

```
+-----------------------------------------------------------+
| [TC Logo]  Dashboard                  [Acme Pty Ltd v]    |
+-----------------------------------------------------------+
|                                                            |
|  Your Supplier Entities                                    |
|                                                            |
|  +------------------------+  +------------------------+   |
|  | Acme Cleaning          |  | Acme Gardening         |   |
|  | [*] VERIFIED           |  | [@] ONBOARDING (2/5)   |   |
|  | 3 locations            |  | 0 locations            |   |
|  | [Manage]               |  | [Continue Onboarding]  |   |
|  +------------------------+  +------------------------+   |
|                                                            |
|  [+ Add Supplier Entity]                                   |
|                                                            |
+-----------------------------------------------------------+
```

---

## Responsive Behavior

### Desktop (1024px+)

- Vertical progress sidebar (240px wide) + step content area
- Two-column layouts for address + map in Locations step
- Document checklist with inline status badges
- Agreement viewer with comfortable reading width (max 680px)

### Tablet (768-1023px)

- Progress indicator collapses to a compact horizontal bar at top
- Single-column form layout
- Document checklist full-width

### Mobile (320-767px)

```
+---------------------------+
| [=] TC Logo    [Acme v]   |
+---------------------------+
| [*]--[@]--[ ]--[ ]--[ ]  |
|  1    2    3    4    5    |
+---------------------------+
|                           |
|  [Step content — full     |
|   width, single column,   |
|   all fields stacked      |
|   vertically]             |
|                           |
|                           |
| [====== Continue ======]  |
+---------------------------+
```

- Horizontal stepper with abbreviated labels
- Full-width form fields, single column
- Continue button fixed at bottom of scroll area (not fixed to viewport — avoids iOS keyboard issues)
- Touch targets 48px minimum (larger than standard 44px for accuracy on phone)
- File upload via system file picker (no drag-and-drop)
- Agreement viewer full-width, auto-scrollable
- No horizontal overflow on any step

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG Level** | AA |
| **Keyboard Navigation** | Tab through fields, Enter for Continue, Escape to close modals |
| **Focus Indicators** | Visible focus rings (`:focus-visible`) on all interactive elements |
| **Screen Reader** | Progress indicator announces: "Step 2 of 5: Locations. Steps 1 complete, steps 3 through 5 upcoming." |
| **Focus Trapping** | Add Location modal traps focus; agreement viewer is focusable |
| **Color Independence** | Step states use icon + text (checkmark, number, exclamation), not just colour. EFTSure uses icon + label, not just green/yellow/red. |
| **Error Announcements** | Validation errors use `aria-live="polite"` for screen reader announcement |
| **Mobile** | All touch targets minimum 48px. No hover-only interactions. |

---

## Visual Design

### Colors (TC Brand — React App)

| Usage | Color | Tailwind Class |
|-------|-------|----------------|
| Primary actions (Continue, Submit) | Navy #2C4C79 | `bg-[#2C4C79] text-white` |
| Current step / active state | Teal #007F7E | `text-[#007F7E] ring-[#007F7E]` |
| Completed step | Green #4DC375 | `text-green-600 bg-green-50` |
| Rejected step / EFTSure refused | Red #E04B51 | `text-red-600 bg-red-50` |
| EFTSure pending | Yellow/Orange | `text-orange-500 bg-orange-50` |
| Upcoming step | Gray | `text-gray-400` |
| Page background | Gray-50 | `bg-gray-50` |
| Card / step content background | White | `bg-white` |
| Secondary actions (Back) | Outline | `border-gray-300 text-gray-700` |

### Typography

| Element | Style |
|---------|-------|
| Page title (step heading) | `text-2xl font-bold text-gray-900` |
| Step description | `text-base text-gray-600` |
| Form labels | `text-sm font-medium text-gray-700` |
| Form helper text | `text-sm text-gray-500` |
| Error text | `text-sm text-red-600` |
| Progress step labels | `text-sm font-medium` (active: `text-gray-900`, upcoming: `text-gray-400`) |

### Spacing

| Context | Value |
|---------|-------|
| Page padding | `p-6` (desktop), `p-4` (mobile) |
| Progress sidebar width | `w-60` (240px) |
| Step content max-width | `max-w-2xl` (672px) for forms |
| Form field gaps | `space-y-4` |
| Section gaps | `space-y-6` |
| Button height | `h-10` (desktop), `h-12` (mobile) |
| Touch targets | `min-h-[48px]` on mobile |

---

## Open Questions

- [ ] Vishal's progress indicator redesign — when will the design be finalised? Current wireframes are a best-guess based on common patterns.
- [x] ~~Should the agreement text be rendered as a PDF viewer or as formatted HTML?~~ **Resolved: Formatted HTML** — see CL-002
- [ ] What are the exact document requirements per supplier type and service category? Sophie Pickett needs to provide the matrix (Go/No-Go dependency).
- [x] ~~Should abandoned onboarding reminder emails (3, 7, 14 days) include a direct deep-link to the exact step where the supplier left off?~~ **Resolved: Yes, deep-link to step** — see CL-003
- [x] ~~For Tier 2 supplier entity creation — should the "Add Supplier Entity" button be in the header switcher dropdown or only on the organisation dashboard?~~ **Resolved: Dashboard only** — see CL-004
- [x] ~~Address autocomplete — should Locations step use Google Places API or a local address database?~~ **Resolved: Google Places** — see CL-005
- [ ] Should the read-only dashboard preview during PENDING_VERIFICATION show real data or placeholder/sample data?

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | Will Whitelaw | | [ ] Approved |
| Designer | Vishal | | [ ] Approved |
| Developer | | | [ ] Approved |
| Compliance | Sophie Pickett | | [ ] Approved |

---

## Next Steps

- [ ] Vishal to finalise progress indicator redesign
- [ ] Sophie to provide document requirements matrix by supplier type/service
- [ ] Define ABR API error handling and fallback strategy
- [ ] `/trilogy-mockup` — Create interactive mockups for registration and onboarding flows
- [ ] `/speckit-plan` — Create technical implementation plan

---

## Clarification Log

### UX Clarifications

**CL-001: What happens when a supplier abandons onboarding mid-step and returns days later?**
- **Option A (Recommended): Resume on the exact step they left off, with all draft data pre-filled.** Auto-save has persisted their progress. A "Welcome back" banner confirms where they are. Progress indicator shows completed vs remaining steps.
- Option B: Resume on the step, but show a summary modal of what they have completed so far before continuing.
- Option C: Always restart from a review summary page that shows all steps.
- **Decision: Option A** — Direct resume on the last incomplete step. The progress indicator already shows context. A "Welcome back, pick up where you left off" banner above the step content provides orientation without adding friction.

**CL-002: Should agreement text be rendered as a PDF viewer or formatted HTML?**
- **Option A (Recommended): Formatted HTML.** Enables native scroll tracking (required for the "scroll to bottom before signing" feature), works well on mobile, allows responsive text sizing, and supports accessibility (screen readers, text selection).
- Option B: Embedded PDF viewer (iframe or react-pdf).
- Option C: PDF download link + separate checkbox consent ("I have read the agreement").
- **Decision: Option A** — Formatted HTML. Scroll tracking is a core requirement for informed consent UX. PDF viewers have inconsistent mobile behavior (pinch-zoom, scroll detection issues on iOS). HTML gives full control over the reading experience.

**CL-003: Should abandoned onboarding reminder emails include a deep-link to the exact step?**
- **Option A (Recommended): Yes — deep-link to the exact step.** Email CTA button says "Continue Step 3: Pricing" with a link that routes directly to that step after login. Reduces friction for return users.
- Option B: Link to the onboarding start page (step 1) and let the progress indicator guide them.
- Option C: Link to a summary page showing all step statuses before continuing.
- **Decision: Option A** — Deep-link to the exact step. The URL includes a step parameter (e.g., `/onboarding?step=3`). After authentication, the user lands directly on their incomplete step.

### UI Clarifications

**CL-004: Where should the "Add Supplier Entity" button live for Tier 2 creation?**
- **Option A (Recommended): Organisation dashboard only.** The add-entity action is a significant, infrequent operation. Placing it only on the dashboard (as a dashed-border card) avoids cluttering the header switcher dropdown, which should be a quick navigation tool.
- Option B: Both in the dashboard and as an option in the header switcher dropdown.
- Option C: Only in the header switcher dropdown (saves a navigation step).
- **Decision: Option A** — Dashboard only. The header switcher stays lean for fast context-switching. Adding an entity is a deliberate decision that deserves its own space. Applied to existing wireframes (confirmed the "Add Supplier Entity" card is already dashboard-only).

**CL-005: Should the Locations step use Google Places API for address autocomplete?**
- **Option A (Recommended): Google Places API.** Industry standard for Australian address autocomplete, handles unit numbers, postcodes, state resolution. Well-supported on mobile. Already used by many similar portals.
- Option B: Australia Post PAF (Postcode Address File) via a third-party service.
- Option C: Manual address entry only (street, suburb, state, postcode as separate fields).
- **Decision: Option A** — Google Places API. Provides the best UX for address entry, especially on mobile. Auto-fills suburb, state, and postcode from a single search field. Added to Component Inventory notes.
