---
title: "Design Challenge Comparison: Supplier Invoice Uplift"
---

# Design Challenge Comparison: Supplier Invoice Uplift

```
  ╔══════════════╗   ╔══════════════╗   ╔══════════════╗   ╔══════════════╗
  ║  LINEAR LISA ║   ║  NOTION NICK ║   ║  GITHUB GARY ║   ║ SUPERHUMAN   ║
  ║              ║   ║              ║   ║              ║   ║    SAM       ║
  ║  ▪ ▪ ▪ ▪ ▪  ║   ║  ⊞ ⊞ ⊞ ⊞   ║   ║  ✓ ✗ ✓ ✗   ║   ║  [J][K][R]  ║
  ║  ▪ ▪ ▪ ▪ ▪  ║   ║  Toggle ▶   ║   ║  #PR-style  ║   ║  Split │ Pan ║
  ║              ║   ║              ║   ║              ║   ║              ║
  ║  "Less, but  ║   ║"Everything   ║   ║  "Review,   ║   ║  "Speed is   ║
  ║   better"    ║   ║ is a DB"     ║   ║  approve,   ║   ║  a feature"  ║
  ╚══════════════╝   ╚══════════════╝   ║   ship"     ║   ╚══════════════╝
                                        ╚══════════════╝
```

---

## Screen-by-Screen Analysis

### 01. Dashboard

| Pattern | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| Email address display | Inline monospace text block in a quiet info card, copy icon on hover | Teal callout block with mail icon, monospace font, inline Copy button — unmissable | GitHub profile header with gradient banner, email shown as metadata below | Dark `bg-gray-800` card with teal monospace email — high contrast, "auto-processed" label |
| Stats layout | 4 minimal metric cards (total, pending, on hold, paid) in a 2x2 grid | 4 metrics + recent activity list with toggle blocks | Activity feed styled as a mini issue list with labels | Split layout: narrow left pane with metrics + email card, right pane with recent invoices list |
| Primary CTA | "New Invoice" button in header, right-aligned | "New Invoice" prominent in the page body, below metrics | "New Invoice" in header matching GitHub's primary button convention | Cmd+K command palette; "New Invoice" is a palette action not a button |
| Welcome/orientation | Breadcrumb nav only — trusts the user knows where they are | Brief subtitle below page title — "Track, manage and submit invoices" | GitHub-style profile card showing supplier name, ABN, joined date — anchoring context | Speed stats ("3 submitted this week, avg 18s") — orients power users to their own activity |
| Email UX | Copy icon appears on hover — zero clutter | One-click Copy button always visible inline | Copy button in sidebar metadata section | One-click copy with green flash feedback, keyboard hint `C` |

**Winner for this screen:** Superhuman Sam — the dark email card makes the most critical piece of information (the submission email) impossible to miss, while the split layout gives both a status summary and recent activity without scrolling.

---

### 02. Invoices List

| Pattern | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| Layout | Dense flat table; status dots in leftmost column; hover reveals row actions | View switcher (Table / Board / Calendar) — same data, three perspectives | GitHub issues-style list: each row is a card with icon, title, labels, and metadata | Split-pane: list on left (compact rows), full invoice detail on right — no page navigation |
| Status indicators | Small coloured dot (red/amber/green/gray) — minimal visual weight | Coloured pill chips (Draft=gray, Submitted=blue, On Hold=amber, Rejected=red, Paid=green) | Icon + label (green circle check, orange warning triangle, red X) with source-channel labels | Coloured dot + text label — identical to Linear but with split-pane benefit |
| Filtering | Filter bar above the table (status, date range, client) | Filter/sort controls above view switcher | Filter pills below header (Open / Closed / labels) matching GitHub PR tabs | Filter bar in left pane; keyboard shortcut `F` to focus filter |
| Batch actions | Checkboxes appear on hover; floating toolbar appears when rows selected | No explicit batch — board view enables drag-and-drop workflow changes | Checkbox column always visible; floating action bar appears on selection with count badge | Checkbox on hover; keyboard `X` to select, then batch action shortcut |
| Drag-to-upload | Drop zone embedded above the table — "drop PDFs here to upload" with hover state | Upload button in header opens a modal; no drop zone on list | No drop zone on list page — uploading is separate In Tray screen | No drop zone on list — In Tray is the dedicated upload flow |
| Empty state | Clean centered message: "No invoices yet. Submit your first invoice." | Notion-style: "This database is empty" + "New Invoice" button | GitHub-style: "No invoices match your filters" with filter reset link | "Inbox zero" style message with speed stat celebration |

**Winner for this screen:** GitHub Gary — the issue-style card rows give richer per-row information (status icon, source label, client name, amount) at a glance without requiring a click, while the filter tabs (Open/Closed) cleanly partition the most important distinction a supplier makes.

---

### 03. Invoice Detail

This is the most design-critical screen because it must handle three distinct states — On Hold (no supplier action needed), Rejected/Resubmit (action required), and Permanently Rejected (no resubmission) — while filtering internal OHB reasons from supplier-visible ones.

| Pattern | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| OHB display — On Hold | Red/amber action panel at the top with bulleted reason list; internal reasons shown as gray italic "Other processes being completed" bullet | Red callout block above properties section; individual toggle blocks per reason; internal reasons hidden behind "1 additional reason" toggle (collapsed by default) | "Checks" panel: individual pass/fail check rows with red X or green tick; internal reasons shown as a neutral gray check item ("Other processes being completed") | Dark header bar (bg-red-600) with "Rejected — Resubmission Required" label; resubmit button in header; reason list below |
| Resubmit action | "Resubmit Invoice" button inside the action panel; button is always visible once in REJECT-RESUBMIT state | "Resubmit Invoice" button below the toggle block list in the callout | "Resubmit" button in the Checks panel footer; disabled state when actionable checks remain unresolved (gate metaphor) | "Resubmit" button in the dark action bar at the top with keyboard shortcut `R` |
| Privacy filtering of internal OHB reasons | Gray italic bullet "Other processes being completed" mixed into the actionable reason list | Collapsed toggle "1 additional reason" — supplier must actively expand to see the placeholder message | Single neutral gray check item at bottom of Checks panel — consistent styling makes it feel like a routine validation step | Listed with X icon but styled differently (gray not red) with label "Other processes being completed" |
| Layout | 5-col document preview (sticky) + 7-col metadata + timeline on right | Notion page layout: properties block + content sections stacked vertically | Two-column: main content (invoice details + checks + timeline) + narrow sidebar (metadata, labels) | Header action bar + single-column content below; keyboard-first navigation |
| Invoice metadata display | Clean definition list rows (label / value) | Notion-style property rows (label width fixed at 144px, value fills remainder) — familiar to Notion users | Grid of metadata cards (2-col) above line items table | Definition list with kbd hints for actions inline |
| Timeline / audit | Timeline section below invoice details — automated events compact, human events as comment-style entries | Activity log at bottom of page — simple chronological list | GitHub-style timeline: system events (compact) vs human comments (styled as review comments) | Compact "Submitted X days ago via Portal" in the action bar; full history accessible via `H` shortcut |

**Winner for this screen:** GitHub Gary — the Checks panel is the most elegant solution to the OHB privacy problem. Each validation result is discrete and named. Supplier-actionable failures are red X items with descriptions. Internal reasons are a gray neutral item that doesn't demand attention. The gate metaphor (Resubmit locked until actionable checks resolve) is intuitive and correct.

---

### 04. Invoice Create/Edit

| Pattern | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| Form structure | Single-page form with field sections (Supplier Info, Client, Service Details, Upload, Line Items) — submit at bottom | Page-creation metaphor: title field at top, properties below, sections feel like building a document | Standard form layout inside a card with section headers; matches GitHub issue creation | Single-page form with keyboard tab-order hints and Cmd+Enter to submit |
| Client selection | Dropdown filtered by agreement status — only shows clients with active agreements | Inline relation selector — type to search, creates a chip | Dropdown with "With Agreements" indicator on each option | Dropdown + `C` shortcut to focus client field |
| Line items | Static table with +Add Row button at bottom | Inline editable table rows — click cell to edit, auto-save | Line items table with explicit +Add and Delete row controls | Line items table with keyboard row navigation (Tab to advance columns) |
| File upload | Drag-and-drop zone integrated into the form | File upload property on the page — click to attach | Drop zone card in "Attachments" section | Drop zone with Cmd+U shortcut; shows upload progress inline |
| Validation feedback | Inline field-level validation on blur; submit button disabled until required fields complete | Real-time validation as you type; errors appear below fields | Inline validation + top summary banner if form is invalid on submit | Inline validation with immediate feedback; no "submit failed" screens |
| ABN verification | Live ABN lookup on blur — green checkmark with matched company name | ABN field with spinner + inline "Verified: [name]" on success | ABN lookup inline — verified badge appears after 1s | ABN verification with `V` shortcut to re-verify |

**Winner for this screen:** Linear Lisa — the single-page form with clear sections is the safest choice for a supplier audience that is not necessarily tech-savvy. The ABN verification pattern (green checkmark with company name) builds confidence and catches errors early. No surprises.

---

### 05. Clients Page

| Pattern | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| Tab navigation | Tab bar: All / With Agreements / Invoiced / Archived — with count badges | Tab bar: All / With Agreements / Invoiced / Archived — identical structure | Tab bar: All / With Agreements / Invoiced / Archived — filter tabs matching GitHub PR tab convention | Tab bar: same four tabs with kbd hints `1-4` to switch |
| Client email display | Email shown in a truncated table cell; Copy icon on hover (hover-visible pattern) | Email shown as a property chip on each client card — click-to-copy | Email shown in the table row with an inline clipboard icon — always visible | Email column with `C` kbd shortcut to copy the focused row's email |
| Email generation | "Generate email" action in the row action menu (hover-visible) | "Generate email" as a button in the client detail flyout | "Generate email" button in the client row — visible as a secondary action | "Generate email" — `G` shortcut when a row is focused |
| Client metadata | Columns: Name, Email, Agreement Status, Last Invoice, Actions | Client cards with properties: name, email chip, agreement status chip, invoice count | Table columns: Name, Email, Agreement, Last Invoice, Amount Due — dense but scannable | Compact table rows with all key fields; split pane shows client detail on right on selection |
| Search | Search input above the table, standard | Filter input in the toolbar, Notion-style | Filter input + search within the GitHub filter-tab pattern | Search via Cmd+K — filters the left pane list |

**Winner for this screen:** GitHub Gary — the filter tabs with count badges solve the most common supplier task ("which clients can I actually invoice right now?") instantly. The "With Agreements" tab is the daily-use tab for most suppliers, and making it a first-class navigation element rather than a filter option is the right call. The inline email clipboard icon (always visible, not hover-dependent) is also the most copy-friendly for this high-frequency action.

---

### 06. In Tray

The most differentiated screen across all four students. This is a triage workflow — suppliers have uploaded a batch of PDFs, AI has split them into individual invoices, and the supplier must review and confirm each extracted document.

| Pattern | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| Upload zone | Full-width drag-and-drop zone at the top of the page; integrates into the list below | Drop zone + "Upload Documents" button in header; Kanban board below | Drop zone at top; document list below as expandable "workflow runs" | Upload zone is modal/separate; triage mode is the primary state of this page |
| Document review layout | Gallery grid of document cards — thumbnail + extracted summary + Accept/Re-split buttons | Kanban board: columns are "Needs Review", "Accepted", "Rejected" — drag cards between columns | Expandable accordion list: each source file expands to show its split invoices as check items | Split pane: document queue on left, PDF preview + extracted data on right; one item at a time |
| Triage interaction | Click "Accept" or "Re-split" buttons on each card; no keyboard | Drag card to the appropriate column; or click Accept/Reject buttons on card | Checkbox per split invoice; "Confirm & Submit All (N)" button in header when all checked | Keyboard triage: `A` Accept, `R` Re-split, `S` Skip, `X` Reject; auto-advance after each action |
| Batch progress | Progress bar showing X of N processed; batches grouped by upload date | Progress bar above the Kanban board; "5 of 6 documents processed" | "3 of 4 documents ready" in header; each accordion row shows individual status | Persistent progress bar below header: "3 of 12 processed — ~6 min remaining" with colour-coded breakdown (accepted/rejected/remaining) |
| AI split feedback | Each card shows filename, extracted client name, amount, service date — the AI's best guess | Each Kanban card shows AI-extracted fields; hover reveals confidence score | Accordion shows "2 invoices detected" badge per source file; expanding reveals individual invoices | Left pane queue shows thumbnails with AI extraction confidence indicators; right pane shows full extracted data for review |
| Empty/complete state | "All documents confirmed. Ready to submit." with a green banner + Submit All button | All cards in "Accepted" column + submit button appears | All accordion items checked; "Confirm & Submit All" button activates in header | "Triage Complete" screen with speed stat ("12 invoices processed in 4 minutes") |

**Winner for this screen:** Superhuman Sam — keyboard triage with auto-advance is the right interaction model for this workflow. Reviewing 12 split invoices with mouse clicks on cards (Lisa) or card drags (Nick) or accordion checkboxes (Gary) all require significantly more time and attention than `A, A, R, A, A, A, X, A...`. The split-pane with a document preview pane is also the only approach that lets the supplier verify the AI's work without leaving the triage mode. The time-remaining estimate is a thoughtful addition.

---

### 07. Public Bill Form

| Pattern | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| Branding | TC logo + "Supplier Invoice Submission" subtitle in a clean header; no sidebar | TC logo in header; minimal centered layout | TC logo + "Submit an Invoice" header; form below | TC logo + form; keyboard shortcut hints in header |
| ABN verification | Live lookup on blur; green verified badge with company name | Live lookup with spinner; verified callout block appears above form | Live lookup; verified badge inline with ABN field | Instant lookup; `V` to verify manually |
| Form fields | ABN, Client Name, Service Date, Invoice Number, Amount, File Upload; single-page | Same fields using property-style layout (label left, input right) | Same fields in a card with section grouping | Same fields with keyboard tab order shown |
| Success state | Green confirmation screen with reference number and "Sign in to track" CTA | Green callout block replacing the form, with reference number | GitHub-style success: "Invoice submitted" header + reference number + copy button | Instant success toast + reference number; "Press Enter to submit another" hint |
| "Sign in" nudge | "Sign in to Supplier Portal" link in the header top-right | "Create an account to track this invoice" callout in the sidebar | "Sign in or create an account to track your submission" below the success state | "Save time — create a supplier account" prompt in the success state |
| Trust signals | TC branding, ABN verified badge, reference number | TC branding, ABN callout, submission confirmation | TC branding + "Your invoice is in review" status message | TC branding + estimated review time ("typically reviewed within 2 business days") |

**Winner for this screen:** Linear Lisa — the public form should be the simplest screen in the product. It needs to work for a sole trader who has never used the portal before. Lisa's form is exactly that: clean fields, live ABN verification, no distractions, and a clear success state with a reference number. The "Sign in to Supplier Portal" link in the header is the right nudge without being pushy.

---

## Trade-off Matrix

| Criterion | Linear Lisa | Notion Nick | GitHub Gary | Superhuman Sam |
|-----------|:-----------:|:-----------:|:-----------:|:--------------:|
| Learnability (new users) | STAR STAR STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR | STAR STAR |
| Speed (repeat users) | STAR STAR STAR STAR | STAR STAR STAR | STAR STAR STAR | STAR STAR STAR STAR STAR |
| Status clarity | STAR STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR STAR STAR | STAR STAR STAR STAR |
| OHB privacy model | STAR STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR STAR STAR | STAR STAR STAR STAR |
| Bulk/triage UX | STAR STAR STAR | STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR STAR STAR |
| Mobile/responsive | STAR STAR STAR STAR | STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR |
| Visual consistency | STAR STAR STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR STAR |
| Scalability (high volume) | STAR STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR STAR STAR | STAR STAR STAR STAR STAR |
| Implementation cost | STAR STAR STAR STAR STAR | STAR STAR STAR | STAR STAR STAR STAR | STAR STAR STAR |

> Rating key: STAR STAR = poor, STAR STAR STAR = adequate, STAR STAR STAR STAR = strong, STAR STAR STAR STAR STAR = excellent

**Summary reading:**

- **Linear Lisa** is the safest baseline — consistent, learnable, responsive. Weakest on triage UX and power-user speed.
- **Notion Nick** gives the most flexibility (multi-view) but adds engineering cost and has the most unfamiliar metaphors for non-Notion users.
- **GitHub Gary** has the strongest status clarity and OHB pattern. The checks panel is the standout contribution.
- **Superhuman Sam** is the best experience for high-volume repeat users. The triage mode and keyboard model are genuinely superior for the In Tray. Weakest for new/casual users and mobile.

---

## Cherry-Pick Recommendations

### Adopt (Best of Each)

| Pattern | Source | Why |
|---------|--------|-----|
| Checks panel for OHB display | GitHub Gary | Discrete named checks with pass/fail icons cleanly separate actionable failures from internal holds. The gate metaphor (resubmit locked until actionable checks resolve) is self-explanatory. |
| Callout block for email address | Notion Nick | The teal callout with monospace email and inline Copy button is the clearest treatment of the most important piece of information on the dashboard. Stands out without being obnoxious. |
| Dark action bar on invoice detail | Superhuman Sam | The `bg-gray-800` action bar across the top of the invoice detail puts the primary action (Resubmit) at the top of the page with a keyboard shortcut hint — correct for a state that demands supplier attention. |
| Source-channel labels on invoice list | GitHub Gary | Coloured labels (Email / Portal / Public) in the list rows let suppliers instantly reconcile portal records against their own submission method without opening each invoice. |
| Keyboard triage for In Tray | Superhuman Sam | `A` / `R` / `S` / `X` with auto-advance is the only scalable interaction model for reviewing 10-20 AI-split documents. No other student got this right. |
| Toggle block for internal OHB reason | Notion Nick | Collapsing the "Other processes being completed" placeholder behind "1 additional reason" (collapsed by default) is elegant — the supplier sees it only if they look, which is the correct level of disclosure. |
| Filter tabs with count badges on Clients | GitHub Gary | All / With Agreements / Invoiced / Archived is the right taxonomy, and making them first-class tabs (not filter dropdowns) reduces clicks to zero. Count badges make the tabs self-describing. |
| Hover-reveal row actions on list | Linear Lisa | Row actions (View, Copy, Download) that appear only on hover keep the list scannable at scale. Applies to both the Invoices list and Clients list. |
| Progress bar with time estimate in In Tray | Superhuman Sam | "3 of 12 processed — ~6 min remaining" with colour-coded breakdown (accepted/rejected/remaining) transforms a tedious task into a legible process with a clear endpoint. |
| ABN live verification on public form | Linear Lisa | Green checkmark with company name on blur is the right UX for reducing submission errors from the public form. Catches wrong ABNs before submission, not after. |
| Invoice detail split layout (doc preview + metadata) | Linear Lisa | 5-column sticky document preview alongside 7-column metadata is the right proportion for a screen where the supplier needs to check the PDF against the extracted data. |
| Timeline for audit trail | GitHub Gary | Chronological timeline distinguishing automated events (compact) from human events (comment-style) builds supplier trust — "Where is my invoice?" support inquiries drop when suppliers can see their invoice is actively moving through a workflow. |

### Consider

**Notion multi-view (Table / Board / Calendar) on the Invoices list.** Useful for bookkeepers and schedulers. Adds complexity to build and test. Validate whether suppliers actually want a Kanban or calendar view before committing — a Table view with a strong status column may be sufficient. If implemented, make Table the default; other views are opt-in.

**Superhuman split-pane on the Invoices list.** Excellent for high-volume suppliers who check 10+ invoices per session. Overkill for suppliers with 2-3 invoices per month. Consider as a "power mode" toggle rather than the default layout.

**GitHub profile header on the Dashboard.** The gradient banner with avatar, company name, and ABN creates a sense of identity in the portal. Has zero functional value but may improve engagement and the feeling of "this is my portal". Keep if it tests well; cut if it feels cosmetic.

**Linear command palette (Cmd+K).** Very low implementation cost if using an existing command palette library. High value for suppliers who use the portal daily. Zero friction for suppliers who never discover it. Safe to include.

### Skip

**Notion Kanban In Tray.** Dragging cards between columns ("Needs Review" → "Accepted") is a slow interaction for a triage task. It has the right visual metaphor but the wrong interaction mechanic. Replace with the Superhuman keyboard model.

**Notion inline editing on the invoice list.** Clicking a table cell to edit a value directly is powerful in Notion where data is flexible. In the invoice domain, most fields are immutable once submitted (you cannot edit the amount on a submitted invoice; you must resubmit). Inline editing would require complex rules about which cells are editable in which status. Skip for MVP.

**GitHub gradient profile banner on the Dashboard.** The gradient banner from `teal-700` to `primary-blue-700` is a direct GitHub profile imitation. It adds no information. The supplier's company name and ABN belong in the header, not as decorative hero content.

**Superhuman speed metrics gamification on the Dashboard.** "Average submission time: 18s" is interesting as a concept but has no actionable value for the supplier and adds backend complexity to track per-supplier timing. Skip unless there is a clear business reason to encourage faster submissions.

**Notion calendar view.** Invoice management by date is useful for cash-flow planning. However, this is significantly harder to implement than a table or board view, and the supplier portal is not a cash-flow tool. The invoices list with date sorting achieves 90% of the value.

---

## Implementation Priority

### Phase 1 (MVP — Email Submission + Portal Upload)

The goal is to get invoices into the system through the two most common channels: email forwarding and direct portal upload.

- Dashboard with email address callout block (Notion-style teal callout, monospace, inline Copy)
- Invoices list with status dots (Linear) and source-channel labels (GitHub)
- Invoice detail with checks panel for OHB (GitHub) + toggle for internal reason (Notion)
- Invoice create form — single page, ABN verification, file upload (Linear)
- Public bill form — clean, no sidebar, ABN live verification (Linear)

### Phase 2 (OHB Display + Resubmit Flow)

The most complex business logic lives here. Get it right before scaling.

- Invoice detail: dark action bar with Resubmit button + `R` shortcut (Superhuman) for REJECT-RESUBMIT state
- Invoice detail: amber passive panel for ON HOLD (no supplier action) (Superhuman) — clearly differentiated from the resubmit state
- Invoice detail: "Rejected — Do Not Resubmit" dark state (Superhuman) — visually distinct from resubmit
- Checks panel gate: Resubmit button disabled until all actionable checks are in a resolved state (GitHub)
- Timeline below invoice details: automated vs human event distinction (GitHub)

### Phase 3 (Bulk Upload + In Tray)

High complexity, high value for suppliers who process batches of invoices.

- In Tray upload zone with drag-and-drop + file picker (consistent across all students — use Linear's clean minimal version)
- Keyboard triage: `A` Accept, `R` Re-split, `S` Skip, `X` Reject with auto-advance (Superhuman)
- Split-pane triage layout: document queue left, PDF preview + extracted data right (Superhuman)
- Progress bar with time estimate and colour-coded breakdown (Superhuman)
- Batch history: past uploads grouped by date with accordions for source files (GitHub)

### Phase 4 (Clients Page + Power Features)

Refinements that reward frequent users.

- Clients page with filter tabs (All / With Agreements / Invoiced / Archived) with count badges (GitHub)
- Inline email copy on client rows — always visible, not hover-dependent (GitHub)
- Generate client-specific email action per client row (consistent across students)
- Command palette Cmd+K (Linear/Superhuman — either works) for power users
- Hover-reveal row actions on all list views (Linear)
- Keyboard shortcut cheat sheet via `?` key (Superhuman)
