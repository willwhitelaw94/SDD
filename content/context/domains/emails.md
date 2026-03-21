---
title: "Emails"
description: "All transactional and notification emails sent by TC Portal, organized by recipient type"
---

> Keeping stakeholders informed through timely, relevant email communications

## Overview

TC Portal sends transactional emails to notify users about important events, required actions, and status changes. This document catalogues all emails organized by **recipient type** to help understand what communications each stakeholder receives.

## Recipient Types

| Recipient Type | Description |
|----------------|-------------|
| **Supplier** | External service providers who submit invoices |
| **Package Contact** | Recipients, representatives, or nominees managing care packages |
| **Staff** | Internal Trilogy Care employees (coordinators, processors, managers) |
| **Admin** | System administrators and finance team members |
| **Any User** | Authentication emails sent to all user types |

---

## Supplier Emails

Suppliers receive emails about their invoice submissions and payment status.

### Invoice Lifecycle

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [InvoiceOnHoldNotification](#invoiceonholdnotification) | "Invoice on hold" | Invoice placed on hold | Hold reason, support contact |
| [OnHoldBillReminderNotification](#onholdbillremindernotification) | "Payment Required" / "Action Required" | Reminder intervals | Fingerprinted (24hr dedup) |
| [InvoiceHasBeenPaidNotification](#invoicehasbeenpaidnotification) | "Invoice has been paid" | Payment processed | Payment confirmation |
| [InvoiceHasBeenRejectedNotification](#invoicehasbeenrejectednotification) | "Invoice has been rejected" | Invoice rejected | Rejection reason |
| [BillAutoRejectedNotification](#billautorejectednotification) | "Invoice {ref} - Auto Rejected" | On-hold expired | Fingerprinted (24hr dedup) |
| [OnHoldInvoiceAuthorisedNotification](#onholdinvoiceauthorisednotification) | "On hold invoice authorised" | On-hold approved | Approval details |
| [OnHoldInvoiceRejectedByCcOrCpNotification](#onholdinvoicerejectedbycorcpnotification) | "On hold invoice rejected" | On-hold rejected by CC/CP | Rejection reason |

---

## Package Contact Emails

Package contacts (recipients, representatives, nominees) receive emails about their care package.

### Statements

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [YourMonthlyStatementNotification](#yourmonthlystatementnotification) | "Your Home Care Package statement is ready" | Monthly statement generated | PDF attachment |

### Invoice Approvals

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [InvoiceOnHoldRequiresApprovalNotification](#invoiceonholdrequiresapprovalnotification) | "Invoice on hold - Requires approval" | Invoice needs approval | Signed URL, document attachments |

### Budget Proposals

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [ProposalApprovalNotification](#proposalapprovalnotification) | "Budget Proposal Has Been Approved" | Proposal approved | Budget item details |
| [ProposalRejectedNotification](#proposalrejectednotification) | "Budget Proposal Has Been Rejected" | Proposal rejected | Rejection reason |

### Portal Access

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [InvitePackageContactForPortalAccessNotification](#invitepackagecontactforportalaccessnotification) | "Invite Package Contact For Portal Access" | Portal invitation sent | Dashboard link |

---

## Staff Emails

Internal staff (coordinators, processors, managers) receive operational emails.

### Bill Processing

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [AssignedBillNotification](#assignedbillnotification) | "You have been assigned bills" | Bills assigned to user | Bill count, direct link |
| [EscalatedBillNotification](#escalatedbillnotification) | "Escalated bill: {reference}" | Bill escalated | LoggableNotification |
| [AllAssignedBillsHaveBeenProcessedNotification](#allassignedbillshavebeenprocessednotification) | "All assigned bills have been processed" | Team member finished | Manager notification |
| [AuthoriseOnHoldInvoiceNotification](#authoriseonholdinvoicenotification) | "Authorise on hold invoice" | Invoice needs authorisation | Invoice details |

### Consumer Actions

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [InvoiceHasBeenApprovedByConsumerNotification](#invoicehasbeenapprovedbyconsumernotification) | "Invoice has been approved by consumer" | Consumer approves | LoggableNotification |
| [InvoiceHasBeenRejectedByConsumerNotification](#invoicehasbeenrejectedbyconsumernotification) | "Invoice has been rejected by consumer" | Consumer rejects | LoggableNotification |

### Check-Ins & Clinical

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [CheckInsNotification](#checkinsnotification) | "Check Ins" | Upcoming/overdue check-ins | Package links |
| [ClinicalRiskIdentifiedInCheckInNoteNotification](#clinicalriskidentifiedincheckinnotenotification) | "Clinical risk identified in check in note" | Clinical risk flagged | Clinical context |
| [NewDementiaCognitionSupplementReceivedNotification](#newdementiacognitionsupplementreceivednotification) | "New Dementia & Cognition Supplement Received" | Supplement received | Compliance alert |

### Budget Proposals

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [BudgetProposalNeedsYourApprovalNotification](#budgetproposalneedsyourapprovalnotification) | "Budget Proposal Needs Your Approval" | Proposal submitted | Review link |

### Notes & Collaboration

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [UserTaggedInNoteNotification](#usertaggedinnotenotification) | "You were just tagged in..." | User tagged in note | Dynamic subject, multiple note types |

### Exports

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [YourCsvExportIsReadyToDownloadNotification](#yourcsvexportisreadytodownloadnotification) | "Your CSV export is ready to download" | Export completed | Signed URL (24hr expiry) |

### Organisation Access

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [YouHaveBeenInvitedToJoinOrganisationNotification](#youhavebeeninvitedtojoinorganisationnotification) | "You have been invited to join an organisation!" | Organisation invitation | New vs existing user content |

---

## Admin Emails

Administrators receive system alerts and reports.

### System Alerts

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [FailedInReviewBillsImportAlertNotification](#failedinreviewbillsimportalertnotification) | "Failed In Review Bills Import Alert" | Import failed | Error list |
| [CheckInNoteImportNotification](#checkinnoteimportnotification) | "Check-In note import" | Import failures | TCID and error reasons |
| [FailedImportColumnNameIncorrectNotification](#failedimportcolumnnameincorrectnotification) | "Failed import - Column Name Incorrect" | Column mismatch | Format guidance |
| [PortalMoreTransactionsDetectedNotification](#portalmoretransactionsdetectednotification) | "Portal - More Transactions Detected" | Extra transactions found | Date info |

### Reports

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [BillStatusMailNotification](#billstatusmailnotification) | "Bill Status Mail" | Scheduled KPI report | Weekly/monthly stats |
| [StatementZipUrlsNotification](#statementzipurlsnotification) | "Statement Zips Temporary URLs" | Batch zips generated | Signed URLs (6hr expiry) |

### Access Requests

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [RecipientRequestInvitationNotification](#recipientrequestinvitationnotification) | "Recipient Request Invitation" | Consumer requests access | TCID, email |
| [NewContactPreferenceNotification](#newcontactpreferencenotification) | "New contact preference" | Preference updated | Contact mode/time |

---

## Authentication Emails

Sent to any user type for account security.

### Account Verification

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [VerifyEmailAddressNotification](#verifyemailaddressnotification) | "Verify Email Address - Trilogy Care" | Account created | Signed URL (7 day expiry) |
| [VerifyBusinessOwnerEmail](#verifybusinessowneremail) | "Verify Email Address" | Organisation registration | Signed URL |

### Password Management

| Email | Subject | Trigger | Special Features |
|-------|---------|---------|------------------|
| [ResetPasswordNotification](#resetpasswordnotification) | "Reset your password - Trilogy Care" | Password reset requested | Token (60min expiry) |
| [Organisation\ResetPassword](#organisationresetpassword) | "Reset Password Notification" | Org user password reset | Fortify integration |
| [PasswordUpdateConfirmationNotification](#passwordupdateconfirmationnotification) | "Password Update Confirmation - Trilogy Care" | Password changed | Security confirmation |

---

## Technical Implementation

### Queue Configuration

| Queue | Purpose | Used By |
|-------|---------|---------|
| `mail` | Default email queue | Most notifications |
| `single-mail` | Rate-limited sending | Bill reminders, rejections |

### Special Features

| Feature | Description | Notifications |
|---------|-------------|---------------|
| **Fingerprinting** | Prevents duplicate sends within 24 hours | OnHoldBillReminderNotification, BillAutoRejectedNotification |
| **Signed URLs** | Secure temporary links with expiry | VerifyEmailAddress, CsvExport, InvoiceOnHoldRequiresApproval |
| **Attachments** | PDF/document attachments from S3 | YourMonthlyStatement, InvoiceOnHoldRequiresApproval |
| **LoggableNotification** | Tracks to NotificationLog table | Most bill notifications |

### Adding New Emails

When adding a new email notification:

1. Create class in `app/Notifications/` subdirectory matching the domain
2. Implement `via()` returning `['mail']` or `['mail', 'database']`
3. Implement `toMail()` with subject and content
4. Add `ShouldQueue` interface for async processing
5. Consider fingerprinting for notifications that shouldn't duplicate
6. **Update this documentation** with the new email details

---

## Open Questions

| Question | Context |
|----------|---------|
| **Domain notifications strategy?** | Why are some in `domain/` and others in `app/Notifications/`? |
| **Duplicate NotificationLogData?** | Two classes exist - should consolidate |
| **Single-mail queue rationale?** | Why only some notifications use it? |

---

## Domain Notifications (Not Documented Above)

**Note**: ~35 additional notifications exist in domain folders:

| Domain | Count | Purpose |
|--------|-------|---------|
| `domain/Supplier/Notifications/` | 16 | Onboarding, reminders, expiry |
| `domain/Budget/Notifications/` | 5 | Plan submission, activation |
| `domain/CareCoordinatorFee/Notifications/` | 4 | Fee approval workflow |
| `domain/BankDetail/Notifications/` | 3 | Bank detail changes |
| `domain/Lead/Notifications/` | 3 | Lead management |
| `domain/User/Notifications/` | 2 | User account |
| `domain/Document/Notifications/` | 1 | Document expiry |
| `domain/Organisation/Notifications/` | 1 | Org verification |

---

## Related Documentation

- [Notifications (In-App)](/features/domains/notifications) - Database notifications shown in portal
- [Bill Processing](/features/domains/bill-processing) - Invoice workflow details
- [Statements](/features/domains/statements) - Statement generation

---

**Maturity**: Production
**Pod**: Platform
