---
title: "Notifications"
description: "In-app notifications displayed in the TC Portal notification bell"
---

> Real-time alerts keeping users informed within the portal

## Overview

TC Portal displays in-app notifications via the notification bell icon. These notifications are stored in the database and shown to users when they're logged into the portal. Most notifications are also sent via email (see [Emails](/features/domains/emails)).

## Notification Bell

Users see a notification bell in the portal header that displays:
- Unread notification count (badge)
- List of recent notifications when clicked
- Ability to mark notifications as read
- Link to view the related item

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Database Channel** | Notifications stored in `notifications` table |
| **Unread Count** | Number of notifications not yet viewed |
| **Notifiable** | The user or entity receiving the notification |
| **Read At** | Timestamp when user viewed the notification |

## Notification Categories

### Bill Processing

Notifications related to invoice workflow and approvals.

| Notification | Title | Trigger |
|--------------|-------|---------|
| InvoiceOnHoldNotification | Invoice on hold | Invoice placed on hold |
| OnHoldBillReminderNotification | Action required | Reminder for on-hold invoice |
| InvoiceHasBeenPaidNotification | Invoice paid | Payment processed |
| InvoiceHasBeenRejectedNotification | Invoice rejected | Invoice rejected |
| BillAutoRejectedNotification | Invoice auto-rejected | On-hold expired |
| AssignedBillNotification | Bills assigned | Bills assigned to you |
| EscalatedBillNotification | Bill escalated | Bill escalated for attention |
| AllAssignedBillsHaveBeenProcessedNotification | Bills complete | All assigned bills processed |
| AuthoriseOnHoldInvoiceNotification | Authorisation needed | On-hold needs approval |
| InvoiceHasBeenApprovedByConsumerNotification | Consumer approved | Consumer approved invoice |
| InvoiceHasBeenRejectedByConsumerNotification | Consumer rejected | Consumer rejected invoice |
| OnHoldInvoiceAuthorisedNotification | Invoice authorised | On-hold approved |
| OnHoldInvoiceRejectedByCcOrCpNotification | Invoice rejected | On-hold rejected by CC/CP |

### Budget Proposals

Notifications for budget proposal workflow.

| Notification | Title | Trigger |
|--------------|-------|---------|
| BudgetProposalNeedsYourApprovalNotification | Approval needed | New proposal submitted |
| ProposalApprovalNotification | Proposal approved | Proposal approved |
| ProposalRejectedNotification | Proposal rejected | Proposal rejected |

### Check-Ins & Clinical

Notifications for care coordination activities.

| Notification | Title | Trigger |
|--------------|-------|---------|
| CheckInsNotification | Check-ins due | Upcoming/overdue check-ins |
| ClinicalRiskIdentifiedInCheckInNoteNotification | Clinical risk | Risk flagged in note |
| NewDementiaCognitionSupplementReceivedNotification | Supplement received | Dementia supplement received |

### Notes & Collaboration

| Notification | Title | Trigger |
|--------------|-------|---------|
| UserTaggedInNoteNotification | Tagged in note | User mentioned in note |

### Exports & Reports

| Notification | Title | Trigger |
|--------------|-------|---------|
| YourCsvExportIsReadyToDownloadNotification | Export ready | CSV export completed |
| StatementZipUrlsNotification | Statements ready | Batch statements generated |
| BillStatusMailNotification | Bill status | KPI report available |

### System Alerts

| Notification | Title | Trigger |
|--------------|-------|---------|
| FailedInReviewBillsImportAlertNotification | Import failed | Bills import error |
| CheckInNoteImportNotification | Import failed | Check-in import error |
| FailedImportColumnNameIncorrectNotification | Import failed | Column mismatch |
| PortalMoreTransactionsDetectedNotification | Transactions detected | Extra transactions found |

### User & Access

| Notification | Title | Trigger |
|--------------|-------|---------|
| VerifyEmailAddressNotification | Verify email | Email verification needed |
| ResetPasswordNotification | Reset password | Password reset requested |
| PasswordUpdateConfirmationNotification | Password updated | Password changed |
| YouHaveBeenInvitedToJoinOrganisationNotification | Organisation invite | Invited to organisation |
| InvitePackageContactForPortalAccessNotification | Portal invite | Portal access invitation |
| RecipientRequestInvitationNotification | Access request | Consumer requests access |
| NewContactPreferenceNotification | Preference updated | Contact preference changed |

---

## Technical Implementation

### Database Structure

Notifications use Laravel's built-in notification system with the `notifications` table:

```
notifications
├── id (uuid)
├── type (notification class name)
├── notifiable_type (User, Team, etc.)
├── notifiable_id
├── data (JSON payload)
├── read_at (nullable timestamp)
├── created_at
└── updated_at
```

### Notification Data Format

All notifications use `App\Data\Notification\DatabaseNotificationData`:

```php
public function toDatabase(object $notifiable): array
{
    return (new DatabaseNotificationData(
        title: 'Notification Title',
        message: 'Description of what happened',
        link: '/path/to/related/item',
    ))->toArray();
}
```

### Reading Notifications

The portal fetches notifications via API and displays them in the notification dropdown. Users can:
- View unread count on the bell icon
- Click to see notification list
- Click a notification to navigate to the related item
- Mark notifications as read

### Key Components

```
app/
├── Data/Notification/
│   └── DatabaseNotificationData.php  # Notification payload structure
├── Notifications/
│   ├── Bill/                         # Invoice notifications
│   ├── Proposal/                     # Budget proposal notifications
│   ├── User/                         # User account notifications
│   └── *.php                         # Other notifications
└── Http/Controllers/
    └── NotificationController.php    # API endpoints
```

---

## Open Questions

| Question | Context |
|----------|---------|
| **Why are domain notifications separate from app notifications?** | ~35 notifications in `domain/*/Notifications/` vs ~35 in `app/Notifications/` |
| **Duplicate NotificationLogData?** | Two classes exist - should consolidate |
| **Single-mail queue rationale?** | Why only some notifications use it? |

---

## Undocumented Notifications

**Note**: 72 total notifications exist in codebase. Only ~35 are documented above. The following are NOT documented:

### Domain Notifications (~35 additional)

| Domain | Count | Examples |
|--------|-------|----------|
| `domain/Supplier/Notifications/` | 16 | Onboarding, reminders, document expiry, ABN reminders |
| `domain/Budget/Notifications/` | 5 | Plan submission, activation |
| `domain/CareCoordinatorFee/Notifications/` | 4 | Fee approval workflow |
| `domain/BankDetail/Notifications/` | 3 | Bank detail changes |
| `domain/Lead/Notifications/` | 3 | Lead management |
| `domain/User/Notifications/` | 2 | User account |
| `domain/Document/Notifications/` | 1 | Document expiry |
| `domain/Organisation/Notifications/` | 1 | Org verification |

### Supplier Notifications (Not Documented)

| Notification | Trigger |
|--------------|---------|
| SupplierOnboardingInviteNotification | Onboarding invitation sent |
| SupplierOnboardingReminderNotification | Reminder to complete onboarding |
| SupplierDocumentExpiryNotification | Document expiring soon |
| SupplierAbnReminderNotification | ABN update needed |
| SupplierPaymentNotification | Payment processed |
| ... and 11 more | Various supplier lifecycle events |

### CareCoordinatorFee Notifications (Not Documented)

| Notification | Trigger |
|--------------|---------|
| FeeApprovedByAdminNotification | Admin approves fee change |
| RecipientFeeApprovalRequestNotification | Client needs to approve fee |
| FeeApprovedByClientNotification | Client approved fee |
| FeeRejectedNotification | Fee change rejected |

---

## Related Documentation

- [Emails](/features/domains/emails) - Email delivery for notifications
- [Bill Processing](/features/domains/bill-processing) - Invoice workflow
- [Notes](/features/domains/notes) - Note tagging system

---

**Maturity**: Production
**Pod**: Platform
