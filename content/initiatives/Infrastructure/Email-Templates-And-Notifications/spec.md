---
title: "Feature Specification: Email Templates & Notifications (ETN)"
---

> **[View Mockup](/mockups/email-templates-and-notifications/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: ETN | **Initiative**: Infrastructure

---

## Overview

TC Portal currently sends ~72 notification classes across `app/Notifications/` and `domain/*/Notifications/`, covering transactional emails (invoice lifecycle, budget proposals, onboarding), in-app notifications (bell icon with unread counts), and system alerts. However, the system has significant gaps: email templates are hardcoded in PHP notification classes, there is no admin UI for managing email content, template changes require code deployments, there is no central notification preferences system for users, and the notification architecture is split inconsistently between `app/Notifications/` and `domain/*/Notifications/` directories.

This epic introduces a managed email template system and a unified notification infrastructure: a template management UI for administrators to create and edit email templates without code changes, user-configurable notification preferences (email, in-app, or both), a standardized notification pipeline that consolidates the split architecture, template versioning and testing capabilities, and expansion of the email template catalogue from 4 care management templates to 50+.

---

## User Scenarios & Testing

### User Story 1 - View and Edit Email Templates (Priority: P1)

As an administrator, I want to view and edit email templates in the Portal so that I can update email content, subject lines, and formatting without requiring a code deployment.

**Why this priority**: Every email content change currently requires engineering intervention. Giving admins template control is the core value proposition of this epic.

**Independent Test**: Can be fully tested by navigating to the template management page, editing a template's subject or body, and sending a test email.

**Acceptance Scenarios**:

1. **Given** an administrator navigates to Settings > Email Templates, **When** the page loads, **Then** they see a list of all email templates organized by category (Supplier, Package Contact, Staff, Admin, Authentication) with template name, subject line, last edited date, and status (active/draft)
2. **Given** an administrator clicks "Edit" on a template, **When** the editor opens, **Then** they see a rich text editor with the current template content, available merge fields (e.g., `{{recipient_name}}`, `{{invoice_reference}}`), and a preview pane showing the rendered email
3. **Given** an administrator edits a template and clicks "Save", **When** the save completes, **Then** the template is versioned (previous version retained), the change is recorded in the audit log, and the updated template is used for all subsequent sends

### User Story 2 - Send Test Emails (Priority: P1)

As an administrator, I want to send a test email for any template so that I can verify the content, formatting, and merge field rendering before the template goes live.

**Why this priority**: Without testing, template edits are high-risk changes that could produce broken or confusing emails to external stakeholders.

**Independent Test**: Can be tested by selecting any template, clicking "Send Test", entering a test email address, and verifying the received email matches the preview.

**Acceptance Scenarios**:

1. **Given** an administrator is editing a template, **When** they click "Send Test Email", **Then** a modal prompts for a recipient email address and shows sample data that will populate merge fields
2. **Given** the administrator sends the test, **When** the email is received, **Then** it renders identically to the preview pane with all merge fields populated with sample data
3. **Given** a template has a syntax error in a merge field, **When** the test is sent, **Then** the system displays a clear error message identifying the problematic field rather than sending a broken email

### User Story 3 - Manage Notification Preferences (Priority: P1)

As a portal user, I want to configure which notifications I receive and through which channels (email, in-app, or both) so that I am not overwhelmed by irrelevant notifications.

**Why this priority**: Users currently have no control over notification volume. This causes notification fatigue and missed important alerts.

**Independent Test**: Can be tested by navigating to notification preferences, toggling a notification channel off, triggering the notification event, and verifying it is suppressed.

**Acceptance Scenarios**:

1. **Given** a user navigates to Profile > Notification Preferences, **When** the page loads, **Then** they see all notification types grouped by category with toggles for email and in-app channels
2. **Given** a user disables email for "Invoice on Hold" notifications, **When** an invoice is placed on hold, **Then** they receive an in-app notification but no email
3. **Given** a user has customized preferences, **When** a new notification type is added to the system, **Then** it defaults to both channels enabled until the user explicitly configures it
4. **Given** certain critical notifications (e.g., security alerts, password changes), **When** a user attempts to disable them, **Then** the system prevents disabling with an explanation that these are mandatory

### User Story 4 - Create New Email Templates (Priority: P2)

As an administrator, I want to create new email templates from scratch or by duplicating existing ones so that new communication needs can be addressed without engineering work.

**Why this priority**: The care management team needs to expand from 4 to 50 templates. Creating templates via UI avoids a backlog of engineering tickets.

**Independent Test**: Can be tested by creating a new template, associating it with a notification type, and verifying it renders correctly when the notification fires.

**Acceptance Scenarios**:

1. **Given** an administrator clicks "Create Template", **When** the creation form opens, **Then** they can enter a template name, select a category, define the subject line with merge fields, and compose the body in the rich text editor
2. **Given** the administrator saves the new template, **When** a developer links it to a notification class, **Then** subsequent notifications of that type use the new template
3. **Given** the administrator clicks "Duplicate" on an existing template, **When** the duplicate is created, **Then** it copies all content and merge fields with a "(Copy)" suffix on the name

### User Story 5 - Template Version History (Priority: P2)

As an administrator, I want to view the version history of an email template so that I can review changes, compare versions, and restore a previous version if needed.

**Why this priority**: Template edits affect external communications. Being able to review and revert changes is essential for quality control.

**Independent Test**: Can be tested by editing a template multiple times and verifying each version is listed with diff capability.

**Acceptance Scenarios**:

1. **Given** an administrator views a template's version history, **When** the history loads, **Then** they see each version with date, editor, and a summary of changes
2. **Given** the administrator selects two versions, **When** they click "Compare", **Then** a side-by-side diff highlights the changes between versions
3. **Given** the administrator clicks "Restore" on a previous version, **When** confirmed, **Then** the template reverts to that version (creating a new version entry) and the restore is audit-logged

### Edge Cases

- What happens when a template is edited while an email using it is being queued? The queued email uses the version at time of queueing; edits apply only to future sends.
- What happens when a merge field referenced in the template is removed from the notification class? The system renders an empty string for the missing field and logs a warning for admin review.
- What happens when a user disables all notification channels for a category? The system allows it for non-critical notifications but displays a warning about potential missed information.
- What happens when an email template has no associated notification class? The template remains in draft state and cannot be activated until linked.
- What happens when the email queue (Redis/Horizon) is unavailable? Emails fall back to synchronous sending for critical notifications; non-critical notifications are retried when the queue recovers.

---

## Functional Requirements

**Template Management (P0 - MVP)**:

- **FR-001**: Administrators MUST be able to view all email templates organized by recipient category
- **FR-002**: Administrators MUST be able to edit template subject lines and body content via a rich text editor
- **FR-003**: Template edits MUST create a new version (previous versions retained)
- **FR-004**: Administrators MUST be able to send test emails with sample merge field data
- **FR-005**: Merge fields MUST be validated at save time to prevent broken templates
- **FR-006**: All template changes MUST be recorded in the audit log

**Notification Preferences (P0 - MVP)**:

- **FR-007**: Users MUST be able to view their notification preferences grouped by category
- **FR-008**: Users MUST be able to toggle email and in-app channels independently per notification type
- **FR-009**: Critical/security notifications MUST NOT be disableable by users
- **FR-010**: New notification types MUST default to all channels enabled

**Template Creation & Lifecycle (P1)**:

- **FR-011**: Administrators MUST be able to create new templates with category, subject, body, and merge field definitions
- **FR-012**: Administrators MUST be able to duplicate existing templates
- **FR-013**: Administrators MUST be able to view and compare version history
- **FR-014**: Administrators MUST be able to restore previous template versions
- **FR-015**: Administrators MUST be able to deactivate templates (preventing sends)

**Architecture Consolidation (P1)**:

- **FR-016**: All notifications MUST use a consistent base class with standard payload structure
- **FR-017**: Notification classes MUST be consolidated from split `app/Notifications/` and `domain/*/Notifications/` directories into a unified structure
- **FR-018**: All notifications MUST support the `DatabaseNotificationData` format for in-app display

**Care Management Templates (P1)**:

- **FR-019**: The template catalogue MUST expand from 4 to 50+ templates covering common care scenarios
- **FR-020**: Care management templates MUST support email thread tracking with unique identifiers

---

## Key Entities

- **EmailTemplate**: A versioned email content record with name, category (Supplier/Package Contact/Staff/Admin/Auth), subject line (supporting merge fields), body (rich HTML), status (active/draft/archived), and linked notification class. Stored in database, not in code.
- **EmailTemplateVersion**: An immutable snapshot of a template at a point in time, with version number, content, editor, and timestamp. Supports comparison and restoration.
- **NotificationPreference**: A user-level configuration record linking a user to a notification type with channel toggles (email: boolean, in_app: boolean). Stored in `notification_preferences` table.
- **MergeField**: A defined variable available within a template (e.g., `recipient_name`, `invoice_reference`), with name, description, sample value, and source notification class. Validated at template save time.
- **NotificationLog**: An existing record (`LoggableNotification` trait) tracking sent notifications with recipient, channel, template version used, status, and timestamp.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Template content changes completed by administrators without engineering involvement for 90%+ of email updates within 3 months of launch
- **SC-002**: Time to update an email template reduced from 2-5 days (dev ticket + deployment) to under 10 minutes (self-service)
- **SC-003**: Care management email templates expanded from 4 to 50+ within 2 months of template management launch
- **SC-004**: Notification preference adoption: 50%+ of active users configure at least one preference within 3 months
- **SC-005**: Zero broken emails sent due to template edits (validated by mandatory test send workflow)
- **SC-006**: Notification architecture consolidated: 100% of notification classes using unified base class and payload format

---

## Assumptions

- The existing Laravel notification system and Horizon queue infrastructure will continue to be used
- Email templates can be stored in the database without significant performance impact (templates are cached after first load)
- Administrators (not individual team leaders) are the appropriate owners for email template content
- The existing `LoggableNotification` trait and `DatabaseNotificationData` class provide a suitable foundation for consolidation
- Mailtrap will continue to be used for email testing in non-production environments
- The 50-template expansion for care management can be content-authored by the care team with admin template creation tools

---

## Dependencies

- **Roles & Permissions Refactor (RAP)**: Admin permissions for template management depend on the new role/permission model
- **Existing notification infrastructure**: Laravel Mail, Horizon queues (`mail` and `single-mail`), Redis for queue processing
- **Mailtrap**: Testing environment for email delivery verification
- **Care Management Activities (CMA)**: Source of requirements for the 50-template expansion and email thread tracking
- **Design team**: UI mockups for template editor, preference management, and version history views
- **Content team**: Authoring of 50+ care management email template content

---

## Out of Scope

- SMS or push notification channels (email and in-app only for this epic)
- Marketing email campaigns or bulk email sending
- Email analytics (open rates, click tracking)
- Multi-language template support
- External template marketplace or sharing
- Drag-and-drop email builder (rich text editor only for MVP)
- Automated A/B testing of email templates
- Integration with third-party email service providers (continues using Laravel Mail with current SMTP config)
- Notification scheduling (send at specific time) -- may be a future enhancement

## Clarification Outcomes

### Q1: [Scope] How many of the 72 notification classes need template conversion?
**Answer:** The codebase has notifications spread across `app/Notifications/` (5+ classes found) and `domain/*/Notifications/` (10+ classes found in Supplier, Budget, Statement domains). **Not all 72 need immediate conversion.** The spec's priority is: (a) P0: Make existing email templates editable via UI (the 4 care management templates), (b) P1: Expand to 50+ templates (new care scenarios), (c) P1: Architecture consolidation. **Recommendation:** Phase 1 converts the highest-volume notification classes (bill lifecycle, budget proposals, supplier onboarding) to templates. Remaining classes can continue using hardcoded content and migrate incrementally.

### Q2: [Dependency] Should ETN be delivered before other epics that reference email notifications?
**Answer:** ETN as infrastructure is valuable but not strictly blocking. **Recommendation:** Other epics should ship with hardcoded email content using a consistent base class (FR-016) and migrate to templates later. The ETN base class and `DatabaseNotificationData` format should be defined early as a lightweight "ETN Phase 0" so other epics can comply with the pattern without the full template management UI. **CMA is the most dependent epic** -- it needs 5 email templates for care management communications and should coordinate directly with ETN.

### Q3: [Data] What is the template storage model?
**Answer:** Per the Key Entities section: "EmailTemplate: Stored in database, not in code." FR-003 requires versioning (previous versions retained). **Templates should be stored in an `email_templates` table** with columns: id, name, category, subject, body (HTML), status (active/draft/archived), notification_class, version, created_by, and timestamps. Versions are stored in an `email_template_versions` table with: id, template_id, version_number, subject, body, created_by, created_at. **The Assumptions section confirms:** "templates can be stored in the database without significant performance impact (templates are cached after first load)."

### Q4: [Edge Case] What is the complete list of mandatory notifications?
**Answer:** The spec mentions "security alerts, password changes" as examples. Based on codebase analysis: `VerifyEmailAddressNotification` (email verification) is clearly mandatory. Password reset notifications are mandatory. **The complete mandatory list should include:** (a) Password reset/change, (b) Email verification, (c) Account lockout, (d) Two-factor authentication codes, (e) Terms of service/agreement updates, (f) Data breach notifications (regulatory requirement). **This list should be maintained as a configuration array** (not hardcoded in logic) so it can be updated without code changes.

### Q5: [Integration] Is the notification architecture consolidation included in this epic?
**Answer:** FR-016 states "All notifications MUST use a consistent base class" and FR-017 states notifications "MUST be consolidated from split directories." **Yes, consolidation is in scope** as P1 priority. However, this is a significant refactor across 72+ classes. **Recommendation:** Do not physically move files in Phase 1. Instead: (a) Define the unified base class, (b) New notifications use the unified pattern, (c) Existing notifications are migrated incrementally as they are touched by other epics. Physical directory consolidation is a cosmetic refactor that can be done anytime.

### Q6: [Performance] What is the expected email sending volume?
**Answer:** With 10,000 active clients and notifications for bill lifecycle, budget updates, statements, and care management: estimated 5,000-10,000 emails per week. CMA alone adds up to 10,000 emails per month (one per active client). **The existing Horizon queue infrastructure (with `mail` and `single-mail` queues per the Assumptions) can handle this volume.** Redis queue processing should be monitored for backlog during bulk campaigns (HCA recontracting sends to ~10,000 recipients simultaneously).

## Refined Requirements

1. **Define the unified notification base class as "ETN Phase 0"** -- a lightweight pre-requisite that other epics can adopt immediately.
2. **Do not physically consolidate notification directories in Phase 1** -- adopt the pattern for new classes and migrate existing ones incrementally.
3. **Maintain the mandatory notifications list as a configuration array** -- not hardcoded in business logic.
4. **Template caching strategy:** Cache templates with a 1-hour TTL (configurable). Cache bust on template save.
5. **Coordinate with CMA for the first 5 templated communications** -- CMA is the highest-priority consumer of the template system.
