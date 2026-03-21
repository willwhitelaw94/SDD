---
title: "Feature Specification: Supplier Bill Submission"
description: |-
  Feature Branch: SBS-supplier-bill-submission
  Created: 2025-12-30
  Status: Draft
  Linear Project: SBS-Supplier-Bill-Submission
---

> **[View Mockup](/mockups/supplier-bill-submission/index.html)**{.mockup-link}

**Feature Branch**: `SBS-supplier-bill-submission`
**Created**: 2025-12-30
**Status**: Draft
**Linear Project**: [SBS-Supplier-Bill-Submission](https://linear.app/trilogycare/project/sec-supplier-email-clients-9f484da573d8)

## User Scenarios & Testing

### User Story 1 - Submit Invoice via Email (Priority: P1)

As a supplier, I want to submit invoices by emailing them to a unique email address so that I don't have to log into the portal for every submission.

**Why this priority**: This is the core value proposition - reducing friction for invoice submission, which is the supplier's most frequent interaction with the system.

**Independent Test**: Can be fully tested by sending an email with a PDF attachment to a supplier's unique email address and verifying a bill is created in the system.

**Acceptance Scenarios**:

1. **Given** a supplier with a unique inbound email address, **When** they send an email with a PDF invoice attachment to their address, **Then** a new bill is created in SUBMITTED status linked to that supplier
2. **Given** a supplier sends an email with multiple PDF attachments, **When** the system processes the email, **Then** each attachment creates a separate bill
3. **Given** a supplier's email contains an invoice with a recognizable client name, **When** the system processes it, **Then** the bill is linked to the correct package/client

---

### User Story 2 - View My Unique Email Address (Priority: P1)

As a supplier, I want to see my unique submission email address in the portal so that I know where to send invoices.

**Why this priority**: Without visibility of the email address, suppliers cannot use the email submission feature.

**Independent Test**: Can be tested by logging in as a supplier and verifying the email address is displayed on the dashboard and invoices page.

**Acceptance Scenarios**:

1. **Given** a supplier is logged into the portal, **When** they view the dashboard, **Then** they see their unique inbound email address with a copy button
2. **Given** a supplier views the Invoices page, **When** the page loads, **Then** the inbound email address is displayed in the header
3. **Given** a supplier clicks "Copy" on their email address, **When** the action completes, **Then** the email is copied to clipboard with visual confirmation

---

### User Story 3 - Per-Client Email Addresses (Priority: P2)

As a supplier with multiple clients, I want unique email addresses for each client so that invoices are automatically routed to the correct client without manual selection.

**Why this priority**: Enhances the P1 feature by eliminating the need for AI/manual client matching for suppliers with multiple clients.

**Independent Test**: Can be tested by generating a per-client email, sending an invoice to it, and verifying the bill is created with the correct package pre-selected.

**Acceptance Scenarios**:

1. **Given** a supplier views their Clients page, **When** they click "Generate Email" for a client, **Then** a unique email address is created for that supplier-client pair
2. **Given** a per-client email exists, **When** an invoice is sent to that address, **Then** the bill is created with both supplier AND package pre-populated
3. **Given** a client already has a per-client email, **When** the supplier views that client, **Then** the email is displayed with a copy button

---

### User Story 4 - View Clients with Agreements (Priority: P2)

As a supplier, I want to see which clients I have formal agreements with (am attached to their budget items) separately from clients I've just invoiced.

**Why this priority**: Helps suppliers understand their formal relationships vs. ad-hoc billing, supporting better business management.

**Independent Test**: Can be tested by viewing the Clients page tabs and verifying clients appear in the correct tab based on their relationship type.

**Acceptance Scenarios**:

1. **Given** a supplier is attached to a client's budget item, **When** they view the "With Agreements" tab, **Then** that client appears in the list
2. **Given** a supplier has invoiced a client but is NOT attached to budget items, **When** they view the tabs, **Then** the client appears only in "Invoiced" tab
3. **Given** a client has both an agreement AND invoices, **When** the supplier views tabs, **Then** the client appears in both "With Agreements" and "Invoiced" tabs
4. **Given** the "All Clients" tab is selected, **When** viewing the list, **Then** all clients from both relationships are shown (deduplicated)

---

### User Story 5 - View Archived Clients (Priority: P3)

As a supplier, I want to see archived/inactive clients separately so I can focus on active relationships.

**Why this priority**: Nice-to-have for organization, but not critical for core functionality.

**Independent Test**: Can be tested by archiving a client's package and verifying they move to the Archived tab.

**Acceptance Scenarios**:

1. **Given** a client's package is archived/inactive, **When** viewing the Clients page, **Then** they appear in the "Archived" tab only
2. **Given** the Archived tab is selected, **When** viewing the list, **Then** only clients with inactive packages are shown

---

### User Story 6 - Submit Invoice via Public Link (Priority: P2)

As a supplier without a portal account, I want to submit invoices through a public web form so that I can bill clients without needing to create an account or remember login credentials.

**Why this priority**: Reduces friction for ad-hoc suppliers who may only submit occasional invoices. Complements the email submission feature by providing an alternative channel that doesn't require account setup.

**Independent Test**: Can be tested by visiting `/bills` as an unauthenticated user, completing the form with supplier details and invoice attachment, and verifying a bill is created in SUBMITTED status.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user visits the public bills page, **When** the page loads, **Then** they see a streamlined invoice submission form
2. **Given** a supplier fills in the form with ABN, client name, and attaches an invoice PDF, **When** they submit, **Then** a bill is created and linked to the matching supplier (by ABN) or flagged for manual matching
3. **Given** a supplier submits via the public form, **When** the submission completes, **Then** they see confirmation with a reference number they can use to track status
4. **Given** the form includes service picklist fields, **When** the supplier selects services from the picklist, **Then** the invoice line items are pre-populated to assist BP processing

---

### User Story 7 - Bulk Invoice Upload with Document Splitting (Priority: P2)

As a supplier with multiple invoices, I want to upload a batch of documents (or a single multi-invoice PDF) and have the system split them into individual bills so that I can submit many invoices at once without repeating the form for each.

**Why this priority**: Suppliers often have batches of invoices to submit (e.g. monthly billing run). One-at-a-time submission creates significant friction for high-volume suppliers.

**Independent Test**: Can be tested by uploading a multi-page PDF containing 3 separate invoices and verifying 3 separate bills are created in SUBMITTED status.

**Acceptance Scenarios**:

1. **Given** a supplier is on the Invoices page, **When** they drag multiple PDF files into the dropzone, **Then** each file creates a separate bill in SUBMITTED status
2. **Given** a supplier uploads a single PDF containing multiple invoices (e.g. 10-page PDF with 3 invoices), **When** the system processes it, **Then** AI splits the document into individual invoices and creates a separate bill for each
3. **Given** a bulk upload is in progress, **When** the supplier views the upload status, **Then** they see a progress indicator showing "3 of 5 invoices processed" with success/failure per document
4. **Given** one document in a bulk upload fails (corrupted, not an invoice), **When** processing completes, **Then** the successful documents create bills and the failures are listed with reasons

---

### Edge Cases

- What happens when an email is sent from an unrecognized sender address? → Bill is still created using ABN/vendor matching from the invoice (permissive approach — domain is a soft signal, not a gate)
- What happens when a supplier's token is regenerated? → Old token stops working, new token takes over
- What happens when a per-client email is used after the client relationship ends? → Bill is still created (preserves historical routing)
- What happens if the same invoice is sent twice? → Deduplication by document hash prevents duplicate bills
- What happens when a supplier emails a non-PDF attachment? → Auto-reply: "Please resubmit as PDF". Non-PDF attachments are discarded. Only PDF creates a bill.
- What happens when an email has no attachment? → Auto-reply: "No invoice attachment found. Please attach a PDF."
- What happens when a PDF is password-protected or corrupted? → Bill created in DRAFT with error flag for manual review
- What happens when a multi-invoice PDF can't be reliably split? → Create single bill with the full PDF attached, flag for manual splitting by bill processor
- What happens when bulk upload exceeds 50 files? → Rate limit at 50 files per upload session. Show "Upload up to 50 files at a time" message.
- What happens when AI splits a PDF incorrectly (e.g. splits mid-invoice)? → Supplier reviews splits in In Tray before confirming. Can merge/re-split manually.

## Requirements

### Functional Requirements

- **FR-001**: System MUST generate a unique inbound email address for each supplier. Existing suppliers backfilled via migration; new suppliers get token on creation.
- **FR-002**: System MUST accept emails sent to supplier inbound addresses and create bills from PDF attachments
- **FR-003**: System MUST display the supplier's inbound email address on the dashboard and invoices page
- **FR-004**: System MUST allow suppliers to copy their email address to clipboard with one click
- **FR-005**: System MUST allow suppliers to generate unique email addresses for individual clients
- **FR-006**: System MUST route emails sent to per-client addresses to the correct supplier AND package
- **FR-007**: System MUST display clients in tabs: All Clients, With Agreements, Invoiced, Archived
- **FR-008**: System MUST show clients under "With Agreements" when supplier is on a client's budget OR has approved bills for that client (formal relationship derived from budget line items + approved bill history)
- **FR-009**: System MUST show clients under "Invoiced" when supplier has submitted bills for them
- **FR-010**: System MUST show clients under "Archived" when their package is inactive
- **FR-011**: System MUST deduplicate clients in the "All Clients" tab
- **FR-012**: System MUST preserve existing ABN-based matching as fallback when token matching fails
- **FR-013**: System SHOULD use the supplier's registered email domain as a soft signal for matching, but MUST NOT reject emails solely based on domain mismatch (permissive with ABN fallback)
- **FR-014**: System MUST auto-reply to emails with non-PDF attachments instructing the supplier to resubmit as PDF
- **FR-014a**: System MUST auto-reply to emails with no attachments instructing the supplier to attach a PDF invoice
- **FR-015**: System MUST log the sender email address with each bill for audit purposes
- **FR-016**: System MUST provide a public bill submission form at `/bills` accessible without authentication, protected by reCAPTCHA v3 and IP-based rate limiting (5 submissions/hour per IP)
- **FR-017**: System MUST match public form submissions to existing suppliers by ABN
- **FR-018**: System MUST provide service picklist on public form to assist with invoice line item creation
- **FR-019**: System MUST return the standard bill reference (#TC-XXXX) to suppliers after public form submission for tracking

**Bulk Upload / In Tray**:
- **FR-025**: System MUST provide a dropzone on the Invoices page for bulk PDF upload (drag-and-drop + file picker)
- **FR-026**: System MUST create a separate bill for each uploaded PDF file in a bulk upload
- **FR-027**: System MUST use AI to detect and split multi-invoice PDFs into individual invoices, creating a bill per invoice
- **FR-028**: System MUST show upload progress with per-document status (processing / success / failed) in an "In Tray" view
- **FR-029**: System MUST allow supplier to review and correct AI-split bills before final submission
- **FR-030**: System MUST handle partial failures gracefully — successful documents create bills, failures listed with reasons

**OHB Supplier-Side (cross-epic)**:
- **FR-020**: Bills list MUST show a summary badge for on-hold bills (e.g. "2 issues — action required") with full detail on the bill Show page
- **FR-021**: Bill Show page MUST display privacy-filtered on-hold reasons: only `Touches_Invoice = true` reasons shown with actionable detail; `Requires_Internal_Action` reasons shown as "Other processes being completed"
- **FR-022**: REJECT-RESUBMIT bills MUST show a [Resubmit] action that reopens the existing bill for editing (upsert pattern — supplier corrects issues and resubmits the same bill, not a new one)
- **FR-023**: REJECT PERIOD bills MUST show "Do not resubmit" messaging with NO resubmit action
- **FR-024**: ON HOLD bills MUST show "No action needed from you" messaging when all reasons are internal

### Key Entities

- **Supplier Inbound Email Token**: Unique identifier for a supplier's general submission email address. Format: `supplier-{token}@inbound.trilogycare.com.au` where token is a short random string. Stored on supplier record. Backfilled for all existing suppliers.
- **Supplier Package Email Address**: Junction entity linking a supplier to a specific package with a unique email token. Format: `{token}@inbound.trilogycare.com.au`. Created on demand when supplier clicks "Generate Email" for a client.
- **Client Relationship Type**: Derived concept distinguishing agreement-based (on budget + approved bills) vs. invoice-based (any submitted bill) relationships

## Clarifications

### Session 2025-12-30

- Q: Should the system verify sender email matches supplier's registered email? → A: Strict - only accept from domains associated with the supplier
- Q: How to determine allowed sender domains? → A: Extract domain from supplier's registered email (e.g., `john@acme.com.au` allows `*@acme.com.au`)
- Q: Can suppliers regenerate their inbound email token? → A: No - tokens are permanent for MVP (admin can manually update if needed)

### Session 2026-03-07

- Q: FR-013 domain restriction vs edge case "unrecognized sender still creates bill" — which takes priority? → A: Permissive with fallback. Accept any sender, use ABN from the invoice PDF to match supplier. Domain is a soft signal, not a gate. (Updated FR-013/FR-014)
- Q: Should SBS token emails use the existing CreateBillFromEmail webhook or separate route? → A: Separate inbound route. New endpoint specifically for token-based emails, keeps SBS logic isolated from legacy email flow.
- Q: What happens when a supplier emails a non-PDF attachment? → A: Accept PDF only, auto-reply to supplier asking them to resubmit as PDF. Non-PDF attachments discarded.
- Q: What defines "attached to budget items" for the With Agreements tab? → A: Supplier on a client's budget OR has approved bills for that client. Formal relationship derived from budget line items + approved bill history.
- Q: Should tokens be backfilled for all existing suppliers or generated lazily? → A: Backfill all existing suppliers via migration. New suppliers get token on creation.
- Q: What prevents abuse on the public form (US6)? → A: reCAPTCHA v3 (invisible) + IP-based rate limiting (5 submissions/hour per IP).
- Q: Should on-hold reasons show in the bills list or only on detail page? → A: Summary badge in list ("2 issues — action required") + full detail on the bill Show page.
- Q: Is the public form reference number the existing bill ref or separate? → A: Use existing #TC-XXXX bill reference. Simple, consistent, already generated on creation.
- Q: What format for unique email addresses? → A: `supplier-{token}@inbound.trilogycare.com.au` — short random token, human-readable prefix, catch-all domain routing.
- Q: When supplier clicks Resubmit, does it create a new bill or update existing? → A: Upsert the existing bill. Supplier corrects issues and resubmits the same bill record, not a new one. (Updated FR-022)
- Q: Which email provider for inbound? → A: AWS SES. SES receiving rules route to our endpoint.
- Q: Max email attachment size? → A: 25MB per email (standard email limit, matches Gmail/Outlook defaults).
- Q: Resubmit stage transition for rejected bills? → A: REJECTED → SUBMITTED. Bill re-enters normal pipeline. rejected_at preserved, submitted_at updates.
- Q: Confirmation email after email-submitted bill processed? → A: Yes, always. Auto-reply: "Invoice received, reference #TC-XXXX. Track status in the portal."
- Q: Are ON HOLD bills editable by supplier? → A: Read-only. Supplier can view but not edit. On-hold means internal processing in progress.
- Q: Email processing SLA? → A: Within 5 minutes (queued). Email received → job queued → bill created within 5 min.
- Q: Bulk upload needed? → A: Yes. MYOB In Tray pattern — dropzone for bulk PDF upload, AI splits multi-invoice PDFs, progress tracking per document, review before confirm. (Added US7, FR-025 to FR-030)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Suppliers can submit an invoice via email in under 30 seconds (vs. 2+ minutes via portal form)
- **SC-002**: 95% of emails sent to valid supplier addresses result in successful bill creation
- **SC-003**: Per-client emails achieve 100% accurate package routing (vs. \~70% for AI-based matching)
- **SC-004**: Suppliers can find and copy their email address within 10 seconds of landing on dashboard
- **SC-005**: Clients page loads and displays correct tab counts within 2 seconds
- **SC-006**: Suppliers report improved clarity on client relationships via the tabbed interface


## Clarification Outcomes

### Q1: [Scope] How does this differ from "Portal Bill Submission (PBS)"?
**Answer:** SBS IS the supplier bill submission feature — the old "PBS" reference was the original working name. This spec covers ALL supplier-facing submission channels: (1) email submission via unique inbound addresses (US1, P1), (2) portal-based submission through the existing supplier bill UI, (3) per-client email addresses (US3, P2), (4) public web form for unauthenticated suppliers (US6, P2), and (5) bulk upload with AI document splitting (US7, P2). These all feed into the same `Bill` model with `SUBMITTED` status.

### Q2: [Dependency] Does SBS require SOP2 for supplier authentication?
**Answer:** Partially. Email submission (US1) requires NO authentication — the unique inbound email address (`supplier-{token}@inbound.trilogycare.com.au`) identifies the supplier via token matching. The public form (US6) is also unauthenticated. However, the portal-based features (US2: view email address, US3: generate per-client emails, US7: bulk upload) require supplier portal access. The V2 supplier auth routes (`domain/Supplier/Routes/v2/authRoutes.php`) and `SupplierApiRefreshToken` model already exist, confirming portal auth is available. SBS can proceed for email/public form features without SOP2; portal features need the existing auth.

### Q3: [Data] What submission formats are supported?
**Answer:** PDF only for email submission (FR-014: "auto-reply to emails with non-PDF attachments instructing the supplier to resubmit as PDF"). The portal form and public form accept structured data + PDF upload. All submissions create `Bill` records in `SUBMITTED` status, entering the same processing pipeline. The V2 `BillSubmissionController` and `CreateBillAction` / `SubmitBillAction` in the codebase confirm the pipeline integration.

### Q4: [Edge Case] What validation rules apply at submission?
**Answer:** Email submissions have MINIMAL validation — the PDF is attached to a new bill for processing. The public form (US6) validates: ABN (supplier matching), client name, and invoice attachment. The portal form uses the existing bill creation validation. OHB's FR-001 through FR-006 handle post-submission diagnosis (ALL issues identified at once). So submission-time validation is lightweight; thorough validation happens at the `SUBMITTED → IN_REVIEW` transition.

### Q5: [Data] The inbound email token — what is the format and how is it stored?
**Answer:** The clarification session (2026-03-07) decided: `supplier-{token}@inbound.trilogycare.com.au` with short random tokens. Existing suppliers are backfilled via migration (FR-001). The `SupplierApiRefreshToken` model already exists for API auth tokens; the email token would be stored differently — likely as a new column on the `Supplier` model or a dedicated `supplier_inbound_email_tokens` table. Given the per-client email feature (US3) needs a junction table, a dedicated `supplier_email_tokens` table linking `supplier_id` and optional `package_id` with a `token` field is appropriate.

### Q6: [Integration] AWS SES for inbound email — how does this work?
**Answer:** The clarification session decided on AWS SES receiving rules. SES receives emails to `*@inbound.trilogycare.com.au`, extracts the token from the local part, routes to a webhook endpoint. The endpoint matches the token to a supplier, extracts PDF attachments, and creates bills. The 5-minute SLA (email → bill created) is achieved via queued job processing. This is a standard SES inbound pattern.

### Q7: [Scope] The "In Tray" pattern (US7) — is this the MYOB In Tray concept?
**Answer:** Yes. The clarification session references "MYOB In Tray pattern." This is a bulk upload area where suppliers drop multiple PDFs, the system processes them (including AI splitting of multi-invoice PDFs), and shows results in a review view before final submission. The supplier can review, correct splits, and confirm. FR-025 to FR-030 define this. The V2 `BillController` already exists to support this.

### Q8: [Data] How does deduplication work for emailed invoices?
**Answer:** Edge case: "If the same invoice is sent twice → Deduplication by document hash prevents duplicate bills." This is content-hash based (e.g., SHA-256 of the PDF file). If a hash matches an existing bill's document, the system rejects with "This invoice has already been submitted" auto-reply. The existing `BillsEditDuplicateCheck.vue` confirms duplicate detection is an established pattern.

### Q9: [UX] The OHB supplier-side features (FR-020 to FR-024) — are these in SBS or OHB?
**Answer:** These are cross-epic features listed in SBS because they affect the supplier portal's bill views. SBS implements the supplier-facing VIEW of OHB data. OHB provides the business logic and data (reasons, communication types). SBS displays: summary badges in list, privacy-filtered reasons on show page, resubmit action for REJECT-RESUBMIT, "do not resubmit" for REJECT PERIOD, and "no action needed" for ON HOLD. This separation is correct — SBS owns the supplier UI, OHB owns the logic.

### Q10: [Edge Case] The upsert resubmit pattern (FR-022) — this is unusual. Why not create a new bill?
**Answer:** The clarification session decided: "Supplier corrects issues and resubmits the same bill record, not a new one." This preserves the bill reference number (#TC-XXXX), maintains the full audit trail on one record, and avoids creating orphan rejected bills. The stage transition is `REJECTED → SUBMITTED`. The `rejected_at` timestamp is preserved; `submitted_at` updates. OHB's FR-024 links resubmissions for audit trail purposes. This is consistent with the "linked resubmissions" pattern.

### Q11: [Security] The public form (US6) — what prevents abuse?
**Answer:** FR-016 specifies: reCAPTCHA v3 (invisible) + IP-based rate limiting (5 submissions/hour per IP). The form matches submissions to existing suppliers by ABN (FR-017). If no ABN match, the bill is "flagged for manual matching." This is appropriate for v1. **Recommendation:** Add email verification on the public form to prevent completely anonymous submissions.

## Refined Requirements

1. **Data Model**: Create `supplier_email_tokens` table: `id`, `supplier_id` (FK), `package_id` (FK, nullable), `token` (unique), `type` (general/per_client), `created_at`. General tokens have null `package_id`; per-client tokens have a specific `package_id`.

2. **New AC for US7**: Given a supplier uploads a 10-page PDF containing 3 invoices, When AI splitting detects the boundaries, Then the supplier sees 3 split previews in the In Tray with page ranges (pages 1-3, 4-7, 8-10) and can adjust splits before confirming.

3. **Cross-Epic Dependency Matrix**: SBS depends on OHB for on-hold reason data and communication types. SBS must be developed AFTER OHB's core reason taxonomy is defined (or mocked with stub data during development).
