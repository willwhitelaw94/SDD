---
title: "Feature Specification: Recipient Uplift (RCU)"
description: "Specification for enhanced recipient portal experience with mobile-first design, self-service features, and SAH compliance"
---

> **[View Mockup](/mockups/recipient-uplift/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-1174 | **Initiative**: Consumer Onboarding (TP-1858)

---

## Overview

Recipient Uplift (RCU) redesigns and enhances the recipient-facing portal experience to address critical usability shortcomings -- replacing the current single long-scrollable page with an intuitive dashboard, simplified navigation, and self-service capabilities. With approximately 40% of recipients accessing the portal on mobile devices, RCU adopts a mobile-first design approach. The project also integrates Support at Home (SAH) mandated interactions, including digital Home Care Agreement signing and contribution transparency. RCU directly reduces support call volume by enabling recipients to independently manage routine tasks such as profile updates, invoice comments, and budget requests.

---

## User Scenarios & Testing

### User Story 1 - Dashboard Overview (Priority: P1)

As a recipient, I want to see my key package information at a glance when I log in so that I can quickly understand my care status without scrolling through a long page.

**Acceptance Scenarios**:
1. **Given** a recipient logs into the portal, **When** the dashboard loads, **Then** they should see a summary card showing their current package balance, next scheduled service, and any pending actions.
2. **Given** a recipient has pending actions (unsigned agreement, bill needing approval), **When** the dashboard loads, **Then** those actions should be prominently displayed with direct links to complete them.
3. **Given** a recipient has no pending actions, **When** the dashboard loads, **Then** it should show a clean summary without unnecessary alerts.

### User Story 2 - Simplified Navigation (Priority: P1)

As a recipient accessing the portal on a mobile device, I want intuitive navigation that works well on small screens so that I can find what I need without frustration.

**Acceptance Scenarios**:
1. **Given** a recipient is on a mobile device, **When** they view the portal, **Then** the navigation should be a bottom tab bar or hamburger menu optimised for thumb-reach zones.
2. **Given** a recipient navigates to any section, **When** the page loads, **Then** the content should be readable without horizontal scrolling on screens 375px and wider.
3. **Given** a recipient is on a desktop, **When** they view the portal, **Then** the navigation should be a sidebar or top navigation with the same information architecture.

### User Story 3 - Self-Service Profile Updates (Priority: P2)

As a recipient, I want to update my contact details and preferences directly in the portal so that I do not need to call support.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to their profile, **When** they edit their phone number or email, **Then** the change should save immediately with confirmation feedback.
2. **Given** a recipient updates their address, **When** they submit the change, **Then** the system should validate the address format and update all related records.
3. **Given** a recipient is a care partner updating on behalf of a recipient, **When** they make changes, **Then** the audit trail should record both the requester and the recipient affected.

### User Story 4 - SAH Agreement Signing (Priority: P1)

As a recipient, I want to read and digitally sign my Home Care Agreement within the portal so that I can commence services without paper-based processes.

**Acceptance Scenarios**:
1. **Given** a Home Care Agreement is ready for signing, **When** the recipient views it, **Then** the agreement should be displayed in a readable, scrollable format with a signature action at the bottom.
2. **Given** a recipient signs the agreement, **When** the signature is submitted, **Then** a signed PDF should be generated and available for download, and services should be unblocked.
3. **Given** a recipient declines the agreement, **When** they submit the decline with a reason, **Then** the care team should be notified and the decline should be recorded.

### User Story 5 - Budget and Payment Transparency (Priority: P2)

As a recipient, I want to see clear information about my budget utilisation, pending payments, and contribution amounts so that I understand my financial position.

**Acceptance Scenarios**:
1. **Given** a recipient views their finances section, **When** the page loads, **Then** they should see current balance, total allocated, total spent, and available funds with a visual progress indicator.
2. **Given** a recipient has pending co-contributions, **When** they view the contributions section, **Then** the amount, frequency, and next due date should be clearly displayed.
3. **Given** a recipient wants to understand a charge, **When** they tap on a bill, **Then** they should see itemised line items with service descriptions and dates.

### User Story 6 - Invoice Comment and Query (Priority: P3)

As a recipient, I want to comment on or query an invoice directly from the portal so that I can resolve billing questions without calling support.

**Acceptance Scenarios**:
1. **Given** a recipient is viewing a bill, **When** they tap "Query this invoice", **Then** they should be able to enter a comment that is sent to the care team for review.
2. **Given** a query has been submitted, **When** the care team responds, **Then** the recipient should see the response in-app and receive a notification.

### Edge Cases

- Recipient with multiple active packages (which dashboard to show first)
- Care partner viewing on behalf of a recipient who has their own login
- SAH agreement version changes after recipient has started but not completed signing
- Mobile browser variations (Safari, Chrome, Samsung Internet) and their signature capture support
- Accessibility requirements for elderly users (large text, high contrast, screen reader compatibility)
- Concurrent edits by recipient and care partner to the same profile data
- Portal session timeout during agreement signing (progress should be preserved)

---

## Functional Requirements

1. **Dashboard Window** -- Summary view showing package balance, pending actions, next scheduled service, and quick-access links to common tasks
2. **Responsive Navigation** -- Mobile-first navigation (bottom tabs or hamburger) that scales to desktop sidebar/top navigation with consistent information architecture
3. **Self-Service Profile Management** -- Enable recipients to update contact details, address, preferences, and communication settings directly
4. **Digital Agreement Signing** -- In-portal Home Care Agreement display with e-signature capture, PDF generation, and decline workflow
5. **Budget Transparency View** -- Visual display of budget allocation, utilisation, spending trends, and available funds per service category
6. **Contribution Display** -- Clear presentation of co-contribution amounts, frequency, income-tested fee details, and payment history (SAH requirement)
7. **Invoice Query Workflow** -- In-app invoice commenting and query submission with notification when care team responds
8. **Mobile-Optimised Bill View** -- Itemised bill display optimised for small screens with expandable line items
9. **Quick Action Links** -- One-tap access to frequent tasks (view budget, sign agreement, contact coordinator, view next service)
10. **Accessibility Compliance** -- WCAG 2.1 AA compliance with large tap targets, scalable text, high contrast mode, and screen reader support

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **RecipientDashboard** | Aggregated view model combining package, budget, actions, and schedule data |
| **HomeCareAgreement** | Digital agreement with version, status, content sections, and signature records |
| **InvoiceQuery** | Recipient-submitted query on a bill with comment, status, and care team response |
| **UserPreference** | Recipient's portal preferences (notification settings, display preferences, accessibility options) |
| **ActionItem** | Pending action requiring recipient attention (unsigned agreement, unapproved bill, overdue review) |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Support calls for routine queries (reduction) | 30% reduction within 6 months |
| Mobile usability score (System Usability Scale) | Greater than 75 |
| Self-service profile update adoption | Greater than 50% of active recipients |
| Digital HCA signing completion rate | Greater than 80% |
| Average time to find key information (user testing) | Less than 30 seconds |
| WCAG 2.1 AA compliance | 100% of recipient-facing pages |

---

## Assumptions

- SAH requirements for recipient interactions (agreement signing, contribution display) are finalised and stable
- Core portal infrastructure supports responsive design without major re-platforming
- Existing data models for packages, budgets, and bills can support the new dashboard aggregation
- Recipients will adopt self-service features given adequate onboarding guidance
- The recipient portal and the consumer mobile app (MOB1) will share API endpoints where possible

---

## Dependencies

- Supplier Onboarding and Budget V2 features completed (for accurate budget data)
- Updated contact data accuracy for communications and agreements
- SAH compliance requirements documentation (finalised)
- UX research and design phase (wireframes, prototypes, user testing with elderly users)
- Accessibility audit tooling and expertise
- Consumer Mobile V1 (MOB1) API development (shared endpoints reduce duplication)

---

## Out of Scope

- Full mobile app (handled by Consumer Mobile initiative MOB1/MOB2/MOB3)
- Service booking or marketplace features (MOB2/MOB3)
- Care plan editing by recipients (coordinator function)
- Automated budget reallocation suggestions
- Integration with external identity providers (SSO)
- Recipient-to-recipient communication features
- Rostering or scheduling system integration

## Clarification Outcomes

### Q1: [Scope] What is the delivery order between RCU (web) and MOB1 (native)? Should they share API endpoints?
**Answer:** RCU and MOB1 have significant overlap: dashboard, budget transparency, agreement signing, and mobile-optimised views. The MOB1 spec explicitly states: "The recipient portal and the consumer mobile app (MOB1) will share API endpoints where possible" (RCU Assumptions) and MOB1 lists "~39 API endpoints, many wrap existing Portal business logic." **Recommendation:** RCU should deliver the responsive web experience FIRST, building the API endpoints that MOB1 will consume. This avoids duplicate backend work. RCU focuses on web (responsive), MOB1 focuses on React Native (native). **Delivery order: RCU before or concurrent with MOB1.**

### Q2: [Dependency] Should there be a single shared agreement signing infrastructure?
**Answer:** The codebase has `app/Models/Agreement.php` and `app/Data/AgreementData.php` for the existing agreement model. The Client-HCA spec (FR-017 through FR-028) defines comprehensive consent capture (digital signature, PDF upload, verbal consent). MOB1 proposes NEW entities (`RecipientAgreement`, `AgreementSignature`). **There must be a single agreement signing infrastructure.** The Client-HCA spec is the most detailed and should be the canonical implementation. Both RCU and MOB1 should consume the HCA-defined signing endpoints. **Do not build parallel signing systems.**

### Q3: [Data] How many parallel query/dispute mechanisms should exist?
**Answer:** Currently there are three proposed mechanisms: (a) RCU invoice query workflow (US6), (b) Digital Statements dispute workflow, (c) MOB1 Intercom shortcuts. **Consolidate to two:** An in-Portal query/comment system (used by both RCU web and MOB1 native) and Intercom as the escalation path. The in-Portal system handles simple queries (comment on invoice, request clarification). Intercom handles complex disputes requiring human intervention. **RCU and MOB1 should share the same `InvoiceQuery` model and API endpoints.**

### Q4: [UX] Has the 60% desktop experience been validated against regression?
**Answer:** The current recipient portal is described as a "single long-scrollable page" with poor mobile experience. A mobile-first redesign risks desktop regression if not carefully managed. **The spec's FR-2 (Responsive Navigation) addresses this by requiring a sidebar/top nav on desktop.** However, there are no specific desktop acceptance criteria. **Add acceptance criteria:** "Desktop users (screens >1024px) should see a sidebar navigation with the same information architecture. No features visible on mobile should be hidden on desktop."

### Q5: [Edge Case] What is the authentication model for delegated access (care partner viewing on behalf)?
**Answer:** The codebase has no impersonation mechanism for recipient-to-care-partner delegation. The User model at `domain/User/Models/User.php` uses `current_role_id` for role switching. The existing `PackageContact` model links contacts to packages. **For MVP, delegated access should use the existing PackageContact/authority relationship model** -- authorised representatives already have their own Portal accounts and can view the package they are linked to. True impersonation (one user acting as another) should be deferred. The audit trail (US3 AC3) already accounts for recording both requester and recipient.

### Q6: [Compliance] What specific SAH requirements apply to the recipient portal?
**Answer:** SAH mandates: (a) digital HCA signing capability, (b) contribution transparency (income-tested fees, basic daily fee), (c) access to service plan information. The spec's FR-4 (Digital Agreement Signing) and FR-6 (Contribution Display) directly address these. **The RCU spec should reference specific SAH Program Manual sections** to ensure compliance is verifiable during audits.

## Refined Requirements

1. **RCU and MOB1 must share API endpoints** -- RCU should build the backend APIs that MOB1 consumes via React Native.
2. **Agreement signing must use the Client-HCA implementation** (FR-017 through FR-028), not a separate RCU-specific signing flow.
3. **Consolidate invoice query mechanisms** -- a single `InvoiceQuery` model shared between RCU web and MOB1 native, with Intercom as escalation.
4. **Add desktop-specific acceptance criteria** to prevent regression for the 60% desktop user base.
5. **WCAG 2.1 AA compliance (FR-10) should include specific elderly user requirements:** minimum 16px base font, minimum 44x44px tap targets, high contrast mode toggle, and screen reader landmarks on all sections.
