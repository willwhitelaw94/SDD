---
title: "Feature Specification: Consumer Mobile V1 (MOB1)"
description: "Specification for Phase 1 React Native mobile app - See and Sign"
---

> **[View Mockup](/mockups/consumer-mobile-v1/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2488 | **Initiative**: Consumer Mobile

---

## Overview

Consumer Mobile V1 (MOB1) delivers a React Native mobile application for iOS and Android that gives recipients a native mobile experience for viewing their Home Care Package information and performing high-impact actions. Themed "See and Sign", MOB1 is primarily read-only with targeted POST actions: viewing packages, budgets, bills, statements, goals, contacts, and documents; managing the Care Circle (CRUD); signing Home Care Agreements via e-signature; and receiving push notifications for key events. Actions that require complex backend workflows (invoice disputes, service changes, funding requests) are handled through an Intercom-first pattern using pre-filled ticket shortcuts. MOB1 targets the approximately 40% of recipients who currently access the web portal on mobile devices and have a suboptimal experience.

---

## User Scenarios & Testing

### User Story 1 - Authentication and Login (Priority: P1)

As a recipient, I want to log in to the mobile app securely and manage my password so that I can access my care information on my phone.

**Acceptance Scenarios**:
1. **Given** a recipient has valid credentials, **When** they enter their email and password and tap "Get Started", **Then** they should be authenticated via Laravel Sanctum and directed to the Home tab.
2. **Given** a recipient has forgotten their password, **When** they tap "Forgot Password" and enter their email, **Then** a reset link should be sent to their email and they should be able to set a new password.
3. **Given** a recipient is logged in, **When** they navigate to profile settings, **Then** they should be able to update their password with current password validation, new password confirmation, and real-time strength requirements display (uppercase, lowercase, number, special character).
4. **Given** a recipient taps a password reset link in email, **When** the app is installed, **Then** the deep link (`trilogycare://reset-password?token=...`) should open the app's reset password screen; if the app is not installed, it should fall back to the browser.
5. **Given** a recipient wants to remain logged in, **When** they check "Remember me", **Then** their auth token should persist in Expo SecureStore across app sessions.

### User Story 2 - Home Dashboard (Priority: P1)

As a recipient, I want to see a dashboard summarising my care package status when I open the app so that I can quickly assess my situation.

**Acceptance Scenarios**:
1. **Given** a recipient opens the app, **When** the Home tab loads, **Then** they should see action notifications (pending approvals, alerts, reminders), quick links to common tasks, and a recent spend graph.
2. **Given** a recipient has pending actions (bill approval, agreement signing), **When** the Home tab loads, **Then** those actions should appear as tappable notification cards.
3. **Given** a recipient has multiple packages, **When** they view the packages list, **Then** all accessible packages should be displayed with the ability to switch between them.
4. **Given** a recipient views the Home tab, **When** package data is loaded, **Then** they should see their SAH package level, Trilogy Care ID, Care Partner name with contact details, and commencement date.

### User Story 3 - View Financial Information (Priority: P1)

As a recipient, I want to view my package balance, budget items, bills, and statements on my phone so that I understand my financial position.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to the Finances tab, **When** the page loads, **Then** they should see their current package balance with budget items showing allocated, spent, committed, available amounts, and utilisation percentage per service category.
2. **Given** a recipient views their bills list, **When** they tap on a bill, **Then** they should see itemised transactions with date, description, quantity, unit price, amount, GST, and budget item.
3. **Given** a recipient wants to view a statement, **When** they tap on a monthly statement, **Then** the statement should display period, opening balance, charges, credits, closing balance, and offer PDF download.
4. **Given** a recipient has co-contributions, **When** they view the contributions section, **Then** they should see current daily rates (income-tested care fee, basic daily fee), payment method and frequency, and payment history.

### User Story 4 - Bills Approval and Rejection (Priority: P1)

As a recipient, I want to approve or reject bills that require my attention so that I maintain oversight of charges against my package.

**Acceptance Scenarios**:
1. **Given** a bill is in PENDING_APPROVAL status, **When** the recipient taps approve, **Then** the bill should move to APPROVED status with an optional comment and the approval recorded with timestamp and approver details.
2. **Given** a bill is in PENDING_APPROVAL status, **When** the recipient taps reject, **Then** they must select a reason code (Incorrect Dates, Incorrect Amount, Service Not Delivered, Duplicate, Other) and provide a mandatory comment, and the bill should be returned to the supplier.
3. **Given** a bill has been queried previously, **When** the recipient views the bill detail, **Then** the approval history should show all previous actions with actor, timestamp, and comments.

### User Story 5 - Manage Care Circle Contacts (Priority: P1)

As a recipient, I want to add, edit, and remove people in my care circle so that my support network is always current.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to the Care Circle section, **When** the page loads, **Then** all contacts should be displayed with name, relationship, phone, and email.
2. **Given** a recipient taps "Add new contact", **When** they fill in first name (required), last name (required), relationship (required), mobile phone (optional with country code), email (optional, validated), and notes (optional), **Then** the contact should be created and visible in the list.
3. **Given** a recipient taps on an existing contact, **When** they edit fields and save, **Then** the contact details should be updated with validation on email format and required fields.
4. **Given** a recipient wants to remove a contact, **When** they confirm deletion, **Then** the contact should be removed from the Care Circle.

### User Story 6 - Sign Home Care Agreement (Priority: P1)

As a recipient, I want to read and sign my Home Care Agreement on my phone so that I can commence services without needing a computer or paper form.

**Acceptance Scenarios**:
1. **Given** a Home Care Agreement is pending signature, **When** the recipient navigates to the Account tab, **Then** they should see a prominent "Sign Agreement" card with signature deadline.
2. **Given** a recipient views the agreement, **When** they scroll through all sections (Services, Fees and Charges, Responsibilities), **Then** a signature pad should appear allowing them to draw their signature.
3. **Given** a recipient draws their signature, **When** they submit, **Then** the signature should be captured as base64 image with full name, date, IP address, and device info; the agreement status should change to SIGNED; a PDF with embedded signature should be generated; and the care team should be notified.
4. **Given** a recipient does not agree with the terms, **When** they decline with a reason (Need More Information, Terms Not Acceptable, Seeking Alternative, Other) and comment, **Then** the decline should be recorded and a care manager should be notified to contact them.
5. **Given** a signed agreement exists, **When** the recipient taps download, **Then** a PDF with the embedded signature should be available for download.

### User Story 7 - Push Notifications (Priority: P1)

As a recipient, I want to receive push notifications for important events so that I take action promptly on bills, agreements, and updates.

**Acceptance Scenarios**:
1. **Given** a bill is submitted for approval, **When** the notification is dispatched, **Then** the recipient should receive a push notification with invoice title and amount, and tapping it should navigate to the bill detail screen.
2. **Given** a monthly statement is ready, **When** the notification fires, **Then** the recipient should be able to tap it and navigate directly to the statement.
3. **Given** an agreement is ready for signature, **When** the notification is sent, **Then** the recipient should be able to tap it and navigate to the agreement screen.
4. **Given** a recipient logs in on a new device, **When** the app starts, **Then** the FCM device token should be registered with platform (ios/android), app version, and device model.
5. **Given** a recipient logs out, **When** the logout completes, **Then** the device token should be unregistered to prevent further push notifications on that device.

### User Story 8 - View Services and Suppliers (Priority: P2)

As a recipient, I want to see my planned services and current suppliers so that I know what care is arranged and who provides it.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to the Services tab, **When** the page loads, **Then** they should see their planned services with service type, frequency, and supplier.
2. **Given** a recipient taps on a supplier, **When** the details load, **Then** they should see supplier name, ABN, trading name, contact details (email, phone, website), address, services with rates, status, total spent, and last service date.

### User Story 9 - View Care Goals and Profile (Priority: P2)

As a recipient, I want to view my personal information, care goals, and care needs so that I can confirm what Trilogy knows about me.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to the Profile tab, **When** the page loads, **Then** they should see their personal information (name, preferred name, gender, date of birth, contact details).
2. **Given** a recipient views their care goals, **When** the goals load, **Then** each goal should show title, description, category (Independence, Health, Social, Safety, Lifestyle), priority (High, Medium, Low), status (Active, In Progress, Achieved, On Hold, Archived), target date, and progress percentage with notes.

### User Story 10 - Documents (Priority: P2)

As a recipient, I want to view and download documents related to my care package so that I have access to important files on my phone.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to documents, **When** the list loads, **Then** all package documents should be displayed with name, type/category, upload date, and file size.
2. **Given** a recipient taps a document, **When** the download completes, **Then** the document should open in the device's default viewer for that file type.

### User Story 11 - Intercom Action Shortcuts (Priority: P2)

As a recipient, I want to request help or raise queries through pre-filled Intercom tickets so that I can get support without explaining context from scratch.

**Acceptance Scenarios**:
1. **Given** a recipient taps "Query Invoice" on a bill detail screen, **When** Intercom opens, **Then** the ticket should be pre-filled with title "Invoice Query: INV-{id}" and context including invoice ID, amount, date, and supplier.
2. **Given** a recipient taps "Request Service Change", **When** Intercom opens, **Then** the ticket should include package ID, current service type, and supplier.
3. **Given** a recipient taps "Request Callback", **When** Intercom opens, **Then** the ticket should include package ID and preferred callback time.
4. **Given** a recipient submits an Intercom ticket, **When** the care team responds, **Then** the recipient should receive a push notification with the reply via Intercom's own notification system.

### Edge Cases

- Recipient with no active packages (show appropriate empty state)
- Agreement model does not currently exist for recipients (only for suppliers) -- requires new polymorphic relationship, controller, e-signature capture, and PDF generation
- Push notification permissions denied by user (iOS explicit, Android 13+ explicit) -- in-app notification list still works
- FCM token expiration and refresh handling across app restarts
- Offline mode -- cached data should display; write actions should show an offline message
- Profile fields (Title, Pronouns, Aboriginal/Torres Strait Islander status) exist only in Zoho, not in portal database -- sync decision required
- Google Places API not yet configured for mobile address lookup
- Multiple devices registered for same user -- notifications should reach all active devices
- Deep link handling when app is not installed (fallback to browser)
- Bill auto-approval after 48 hours if not actioned by recipient
- Large signature images causing upload timeouts on slow connections
- Concurrent login on multiple devices (token management)
- App version mismatch with API version (graceful degradation via `/api/v1/` versioning)

---

## Functional Requirements

1. **Authentication** -- Laravel Sanctum token-based login/logout, forgot/reset/update password with deep link handling, secure token storage (Expo SecureStore), Remember Me persistence
2. **Home Dashboard** -- Action notifications list, quick action links, recent spend graph, package overview (SAH level, TC ID, Care Partner, commencement date)
3. **Financial Views** -- Budget items with allocation/spent/committed/available/utilisation, bills list with status/supplier/date filtering and pagination, bill detail with transactions, bill approve/reject workflows, monthly statements list with PDF download, contributions display with rates and payment history
4. **Care Circle Management** -- Full CRUD for contacts with validation (required: first name, last name, relationship; optional: phone with country code, email, notes)
5. **Home Care Agreement** -- View agreement sections, e-signature capture (drawn/typed/biometric), sign/decline workflows with reason codes, PDF generation with embedded signature; requires new database tables (`recipient_agreements`, `agreement_signatures`), new `RecipientAgreementController`, and PDF template
6. **Push Notifications** -- FCM integration with device token registration/unregistration, 12 notification types (BILL_NEEDS_APPROVAL, BILL_PAID, STATEMENT_READY, BUDGET_ACTIVATED, AGREEMENT_READY, DOCUMENT_UPLOADED, etc.), in-app notification list with read/unread state and badge count, deep link navigation on tap
7. **Services View** -- Planned services list, service history, supplier details with rates and contact information
8. **Profile View** -- Personal information display, clinical information (read-only), care goals (read-only with category/priority/status/progress), care needs (read-only)
9. **Documents** -- List and download package documents by type/category
10. **Intercom Shortcuts** -- Authenticated Intercom SDK session with pre-filled ticket shortcuts for finance actions (invoice query, charge dispute, statement request, payment question), service actions (change request, missed service, supplier feedback), care actions (goal update, concern report, callback request), and account actions (contact update, care circle, access help)
11. **Support and Settings** -- Help/contact options, login/security settings (password update), app version info

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Package** | Recipient's home care package with SAH level, IDs, dates, care partner, coordinator, goals, needs, risks |
| **BudgetItem** | Service category budget allocation with spent, committed, available amounts and utilisation percentage |
| **Bill** | Supplier invoice with line items/transactions, status workflow (Draft, Submitted, Pending Approval, Approved, Paid, Rejected, Resubmitted), and approval history |
| **Transaction** | Individual financial entry (charge, credit, payment, adjustment, refund, fee) with date, amount, supplier, and budget item |
| **Statement** | Monthly financial summary with opening/closing balance, charges, credits; downloadable as PDF |
| **RecipientContribution** | Co-contribution rates (income-tested care fee, basic daily fee) with payment method, frequency, and history |
| **CareCircleContact** | Person in the recipient's support network with relationship type and contact details |
| **RecipientAgreement** | Home Care Agreement with version, status (Draft, Pending Signature, Signed, Active, Declined, Expired, Terminated), content sections, and signature deadline (NEW entity) |
| **AgreementSignature** | E-signature record with type (drawn/typed/biometric), base64 data, full name, timestamp, IP, and device info (NEW entity) |
| **DeviceToken** | FCM push notification token with platform (ios/android), app version, device model, and active status (NEW entity) |
| **Notification** | In-app notification with type, title, message, action URL, read/unread state, and push delivery status |
| **Supplier** | Service provider with ABN, contact details, services, rates, and status |
| **Goal** | Care goal with category, priority, status, target date, and progress tracking |
| **Document** | Package document with name, type/category, upload date, file size, and S3 download URL |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Mobile app adoption (of existing mobile web users) | Greater than 50% within 3 months |
| Push notification opt-in rate | Greater than 70% |
| Support ticket reduction (mobile-related issues) | 30% reduction |
| HCA signing completion rate on mobile | Greater than 80% |
| Intercom shortcut usage (of total tickets created) | Greater than 50% |
| Intercom ticket context quality (full context attached) | Greater than 80% |
| Shortcut-created ticket resolution time improvement | 20% faster than manual tickets |
| App store rating | Greater than 4.0 stars |
| Crash-free session rate | Greater than 99.5% |

---

## Assumptions

- Recipients have smartphones with iOS 14+ or Android 10+
- Existing Laravel actions/services can be wrapped in versioned API endpoints (`/api/v1/recipient/...`)
- FCM can be integrated without major backend infrastructure changes
- App Store and Play Store developer accounts are available for submission
- The Intercom SDK is compatible with React Native (Expo) and supports authenticated sessions with shortcut pre-filling
- Most of the approximately 39 API endpoints wrap existing Portal business logic with minimal new backend development
- The Intercom-first action pattern is acceptable as an interim approach for complex workflows

---

## Dependencies

- **Laravel Sanctum** API authentication (partially complete -- forgot/reset/update password flows need work)
- **Portal API endpoints** -- approximately 39 endpoints required; many wrap existing logic, some need new implementation
- **FCM/Firebase** setup for push notifications (server key, sender ID, `device_tokens` table, `FcmService`, `FcmChannel`)
- **Home Care Agreement** -- biggest build effort: new `Package -> Agreement` relationship, `RecipientAgreementController`, `RecipientAgreement` and `AgreementSignature` models, mobile e-signature canvas, agreement PDF template with signature embedding, sign/decline workflow
- **Contributions endpoint** -- SAH contributions query logic needs refinement
- **App Store / Play Store** developer accounts and provisioning profiles
- **Intercom** React Native SDK integration and team routing configuration (Finance, Care Coordination, Clinical, Admin, Support)
- **Google Places API** for mobile address lookup (Firebase setup required on iOS and Android)
- **Zoho sync** decision for profile fields (Title, Pronouns, Aboriginal/Torres Strait Islander status) that exist only in Zoho
- **Mail driver** configuration in Laravel for password reset email sending
- UX design assets from Beth Poultney and NativeWind/tc-theme design system

---

## Out of Scope

- Service booking or marketplace browsing (MOB2)
- Care goal creation or editing (MOB2)
- Invoice submission by recipients (MOB2)
- Budget reallocation requests (MOB2)
- Find services and calendar view (MOB2)
- Package swap and termination (MOB2)
- AI assistance, Moonmart marketplace, health integrations (MOB3)
- Web portal recipient documents view (separate initiative)
- In-app document preview (future enhancement -- currently opens in external viewer)
- Document upload and deletion from mobile (backend not implemented)
- One-time PIN login (no SMS service configured)
- Offline-first architecture (network required for all data operations in MOB1)
- Biometric login (Face ID, fingerprint) as primary authentication method

## Clarification Outcomes

### Q1: [Dependency] Should a shared agreement signing infrastructure be built first?
**Answer:** Yes. The Client-HCA spec is the most comprehensive agreement signing implementation with 28 functional requirements (FR-017 through FR-028 for consent capture, plus ACER integration). The MOB1 spec proposes new entities (`RecipientAgreement`, `AgreementSignature`) that duplicate this. **The HCA epic should deliver the agreement signing backend first.** MOB1 should consume HCA's API endpoints rather than building parallel models. The existing `app/Models/Agreement.php` should be extended to support the HCA state model (Draft, Sent, Signed, Terminated). **Do not create `RecipientAgreement` as a separate model -- extend the existing Agreement model.**

### Q2: [Scope] How many of the ~39 endpoints are new vs. wrapping existing logic?
**Answer:** Based on codebase analysis: Budget items, bills, statements, care circle contacts, suppliers, and documents all have existing controllers and services in the Portal. **Estimated split: ~25 endpoints wrap existing logic (read operations), ~14 require new implementation (agreement signing, push notifications, device tokens, Intercom shortcuts, care goals write).** The risk of API surface divergence is real -- MOB1 should use versioned API endpoints (`/api/v1/recipient/...`) that call the same domain actions as the web portal. **Do not create separate mobile-only services.**

### Q3: [Data] What is the decision on syncing Zoho-only profile fields (Title, Pronouns, Aboriginal/Torres Strait Islander status)?
**Answer:** These fields exist only in Zoho and are not in the Portal database. The Lead model syncs some fields from Zoho, but profile fields for active recipients are not currently synced. **For MOB1 MVP, these fields should be omitted from the profile view** with a "Complete your profile at trilogycare.com.au" message. Adding Zoho sync for recipient profile fields is a dependency that requires: (a) new database columns on the User or Package model, (b) a Zoho-to-Portal sync job for active recipients. This should be a pre-requisite task, not part of MOB1 scope.

### Q4: [Edge Case] Is the 48-hour bill auto-approval an existing or new business rule?
**Answer:** The codebase has bill approval workflows in `app/Models/Bill/Bill.php` with status transitions. No evidence of auto-approval timer exists in the current codebase. **This appears to be a new business rule.** It has significant compliance implications -- auto-approving charges against a recipient's package without explicit consent may violate SAH consumer protection requirements. **This rule must be reviewed and approved by the compliance team before implementation.** If approved, it should be feature-flagged and the auto-approval should be logged as a system action (not attributed to the recipient).

### Q5: [Integration] Has Intercom SDK feasibility been confirmed for React Native Expo?
**Answer:** The Portal already uses Intercom on web -- `resources/js/composables/useIntercom.ts` and `resources/js/Components/Common/CommonFloatingHelpButton.vue` confirm existing integration. The Intercom React Native SDK (`@intercom/intercom-react-native`) supports Expo via config plugin. **Technical feasibility is confirmed.** However, shortcut pre-filling (contextual ticket creation) requires Intercom's `displayMessenger` with custom attributes, which is supported in the React Native SDK. **The main risk is Expo Go compatibility during development** -- Intercom requires a development build, not Expo Go.

### Q6: [Data] What is the push notification delivery architecture?
**Answer:** The spec lists 12 notification types. The Portal uses Laravel notifications (15+ classes found in `domain/*/Notifications/` and `app/Notifications/`). **FCM integration requires:** (a) a `device_tokens` table, (b) a `FcmService` for sending, (c) a `FcmChannel` for Laravel notification routing. None of these exist currently. This is net-new infrastructure. **The ETN (Email Templates & Notifications) epic should be coordinated** -- FCM is a new notification channel that fits within ETN's scope of unified notification infrastructure.

## Refined Requirements

1. **Agreement signing must use the Client-HCA backend** -- do not create parallel `RecipientAgreement`/`AgreementSignature` models.
2. **The 48-hour bill auto-approval rule requires compliance review** before implementation. Feature-flag it as `mob1-bill-auto-approval`.
3. **Zoho profile field sync should be a pre-requisite task** tracked separately, not embedded in MOB1 scope.
4. **FCM push notification infrastructure should be coordinated with the ETN epic** as a new notification channel.
5. **All ~39 API endpoints must call existing domain actions** -- do not create mobile-specific business logic that diverges from the web portal.
