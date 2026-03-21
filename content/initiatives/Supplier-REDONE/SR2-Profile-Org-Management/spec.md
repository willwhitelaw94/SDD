---
title: "Feature Specification: Profile & Organisation Management"
---

# Feature Specification: Profile & Organisation Management

**Feature Branch**: `sr2-profile-org-management`
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Organisation Administrator Views Organisation Dashboard (Priority: P1)

An Organisation Administrator logs into the supplier portal and sees a dashboard showing all supplier entities under their ABN. The dashboard displays each supplier's name, compliance status, worker count, and pending actions. This is the single entry point for cross-supplier oversight -- without it, Org Admins have no visibility across their business.

**Why this priority**: This is the foundational view for organisation-level management. Every other SR2 feature builds on the user being able to see and navigate between their supplier entities.

**Independent Test**: Can be fully tested by logging in as an Organisation Administrator with two or more supplier entities and verifying the dashboard lists all entities with correct summary data.

**Acceptance Scenarios**:

1. **Given** an Organisation Administrator with three supplier entities, **When** they navigate to the organisation dashboard, **Then** they see all three suppliers listed with their trading name, compliance status (compliant / expiring / non-compliant), active worker count, and count of pending documents.
2. **Given** an Organisation Administrator, **When** any supplier entity has documents expiring within 30 days, **Then** the dashboard highlights that supplier with a warning indicator and shows the count of expiring items.
3. **Given** an Organisation Administrator with one supplier entity, **When** they view the dashboard, **Then** the single entity is still shown in a dashboard view (not skipped) so the layout is consistent and the "add supplier" action is visible.
4. **Given** a Supplier Administrator (not org-level), **When** they attempt to access the organisation dashboard, **Then** they are redirected to their single supplier's profile page -- they do not see the cross-supplier overview.

---

### User Story 2 - User Switches Between Supplier Entities (Priority: P1)

A user with access to multiple supplier entities can switch between them using an always-visible account switcher component. When they switch, all profile data, documents, workers, and bank details update to reflect the selected supplier. The switcher is available from any page in the portal.

**Why this priority**: Without context switching, multi-supplier users cannot manage their business. This unblocks every downstream profile management action for multi-supplier organisations.

**Independent Test**: Can be tested by logging in as a user with two supplier entities, switching from Supplier A to Supplier B, and verifying that the displayed profile data changes to Supplier B's details.

**Acceptance Scenarios**:

1. **Given** a user with access to Supplier A and Supplier B, **When** they use the account switcher to select Supplier B, **Then** all visible profile data (business details, locations, workers, documents, bank details) updates to show Supplier B's data.
2. **Given** a user switching supplier context, **When** the switch completes, **Then** the system remembers this preference and uses Supplier B as the default on their next login.
3. **Given** a user with access to only one supplier entity, **When** they view any page, **Then** the account switcher is hidden -- no unnecessary UI element is displayed.
4. **Given** a user on the workers list page for Supplier A, **When** they switch to Supplier B, **Then** the workers list refreshes to show Supplier B's workers without navigating away from the workers page.

---

### User Story 3 - Organisation Administrator Manages Business Details (Priority: P1)

An Organisation Administrator or Supplier Administrator can view and edit the business details for a supplier entity -- trading name, contact information, and service categories. Organisation-level details (ABN, legal name, GST status) are read-only and shared across all supplier entities. Changes to supplier-level details only affect the selected supplier entity.

**Why this priority**: Business details are the most frequently viewed and edited profile section. Getting this right through the API establishes the pattern for all other profile sections.

**Independent Test**: Can be tested by editing a supplier's trading name via the API and verifying the change is reflected only for that supplier entity, not across the organisation.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator viewing business details, **When** they see the profile, **Then** organisation-level fields (ABN, legal name, GST registration) are displayed as read-only, and supplier-level fields (trading name, contact email, phone, service categories) are editable.
2. **Given** a Supplier Administrator editing the trading name, **When** they save, **Then** only that supplier entity's trading name is updated -- other supplier entities under the same ABN are unchanged.
3. **Given** an Organisation Administrator viewing business details, **When** they see the profile, **Then** they have the same edit capabilities as a Supplier Administrator for the currently active supplier entity.
4. **Given** any user editing business details, **When** they submit invalid data (empty trading name, invalid email format), **Then** the system returns clear field-level validation errors without saving.

---

### User Story 4 - Supplier Administrator Manages Locations (Priority: P2)

A Supplier Administrator can add, edit, and remove locations for their supplier entity. Each location has an address, contact details, and can be marked as the primary location. Locations are scoped to a single supplier entity -- they are not shared across the organisation.

**Why this priority**: Locations are required for service delivery mapping and worker assignment. Depends on the profile pattern established in Story 3.

**Independent Test**: Can be tested by adding a new location to a supplier entity and verifying it appears in that supplier's location list but not in sibling supplier entities.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator, **When** they add a new location with a valid address, **Then** the location is created under their active supplier entity and visible in the locations list.
2. **Given** a supplier entity with three locations, **When** the administrator marks a different location as primary, **Then** the previous primary location is demoted and the new one is promoted -- only one primary location exists at a time.
3. **Given** a supplier entity with one location, **When** the administrator attempts to delete it, **Then** the system prevents deletion and displays a message explaining that at least one location is required.
4. **Given** an Organisation Administrator switching between Supplier A and Supplier B, **When** they view locations for each, **Then** each supplier shows only its own locations -- no cross-supplier leakage.

---

### User Story 5 - Supplier Administrator Manages Team Members (Priority: P2)

A Supplier Administrator can view, invite, and remove team members (workers) for their supplier entity. Each worker has a role, assigned locations, and assigned service types. An Organisation Administrator can view workers across all supplier entities from the organisation dashboard.

**Why this priority**: Team management is a core operational need that was previously impossible without contacting TC staff. Depends on the two-tier role model from SR0.

**Independent Test**: Can be tested by inviting a new worker to a supplier entity and verifying they appear in that supplier's team list with the correct role and assignments.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator, **When** they invite a new team member by email, **Then** the system sends an invitation and the worker appears in the team list with "Pending" status.
2. **Given** a Supplier Administrator viewing the team list, **When** they see workers, **Then** each worker shows their name, role, assigned locations, assigned services, and status (active / pending / inactive).
3. **Given** a Supplier Administrator, **When** they remove a team member, **Then** that worker's access to the supplier entity is revoked immediately and their status changes to "Inactive".
4. **Given** an Organisation Administrator on the organisation dashboard, **When** they view aggregate team data, **Then** they see total worker counts per supplier entity and can drill into any supplier's team list.
5. **Given** a Supplier Administrator, **When** they attempt to remove the last administrator from the supplier entity, **Then** the system prevents the action and explains that at least one administrator must remain.

---

### User Story 6 - Supplier Administrator Manages Documents (Priority: P2)

A Supplier Administrator can upload, view, and manage compliance documents for their supplier entity. Documents have types (insurance, certification, licence), expiry dates, and approval statuses. The system warns when documents are approaching expiry.

**Why this priority**: Document management drives compliance visibility on the organisation dashboard (Story 1). Builds on the existing `SupplierDocumentController` logic.

**Independent Test**: Can be tested by uploading a document with an expiry date 20 days from now and verifying it appears in the document list with an "expiring soon" warning.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator, **When** they upload a document with a type and expiry date, **Then** the document is stored against the active supplier entity and appears in the documents list with "Pending Review" status.
2. **Given** a supplier entity with a document expiring in 25 days, **When** any user views the documents list, **Then** the document is highlighted with an "Expiring Soon" warning.
3. **Given** a supplier entity with an expired document, **When** the Organisation Administrator views the organisation dashboard, **Then** that supplier's compliance status shows as "Non-compliant" with the expired document identified.
4. **Given** a Supplier Administrator, **When** they attempt to upload a file exceeding the size limit, **Then** the system rejects the upload with a clear error message specifying the maximum allowed size.

---

### User Story 7 - Supplier Administrator Manages Bank Details (Priority: P2)

A Supplier Administrator can add and manage bank details for their supplier entity. Each supplier entity has its own bank details (BSB, account number, account name). One bank account must be marked as the primary account for payment. Changes to bank details require confirmation to prevent accidental modification.

**Why this priority**: Bank details are required for invoice payments. Incorrect bank details cause payment failures, so the change process must be deliberate.

**Independent Test**: Can be tested by adding a new bank account to a supplier entity, marking it as primary, and verifying the previous primary is demoted.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator, **When** they add new bank details (BSB, account number, account name), **Then** the bank account is created under the active supplier entity with "Pending" status until verified.
2. **Given** a supplier entity with two bank accounts, **When** the administrator marks the second as primary, **Then** the first is demoted and the second becomes the primary payment account.
3. **Given** a Supplier Administrator editing existing bank details, **When** they change the BSB or account number, **Then** the system requires confirmation ("Are you sure? This will change where payments are sent.") before saving.
4. **Given** an Organisation Administrator, **When** they view bank details for a supplier entity, **Then** they can see the details but the account number is partially masked (showing only the last 4 digits) unless they explicitly reveal it.

---

### User Story 8 - Organisation Administrator Adds a New Supplier Entity (Priority: P3)

An Organisation Administrator can add a new supplier entity under their existing ABN directly from the organisation dashboard. The new entity starts with its own empty profile (no locations, workers, documents, or bank details) and shares only the organisation-level details (ABN, legal name, GST status).

**Why this priority**: Removes the need for manual profile creation by TC staff. This is a less frequent action than daily profile management but eliminates a significant operational bottleneck.

**Independent Test**: Can be tested by creating a new supplier entity from the dashboard and verifying it appears in the supplier list with an empty profile.

**Acceptance Scenarios**:

1. **Given** an Organisation Administrator, **When** they choose to add a new supplier entity and provide a trading name, **Then** a new supplier entity is created under their ABN with that trading name and an empty profile.
2. **Given** an Organisation Administrator adding a supplier entity, **When** they complete creation, **Then** the system switches their active context to the new entity and redirects them to the SR1 onboarding wizard (Business Details → Locations → Pricing → Documents → Agreements). Organisation-level documents are pre-inherited.
3. **Given** a Supplier Administrator (not org-level), **When** they attempt to add a new supplier entity, **Then** the action is not available -- only Organisation Administrators can create supplier entities.
4. **Given** an Organisation Administrator in the onboarding wizard for a new entity, **When** they want to return to the organisation dashboard, **Then** they can exit onboarding at any point — progress is saved and they can resume later.

---

### Edge Cases

- What happens when an Organisation Administrator is deactivated while being the sole org-level admin? The system must prevent deactivation of the last Organisation Administrator -- another user must be promoted first.
- What happens when a worker is assigned to locations or services that are subsequently deleted? The worker's assignments are cleaned up and the worker remains active but unassigned, with a notification to the Supplier Administrator.
- What happens when a document type is required but missing for a supplier entity? The compliance status shows "Non-compliant" and the organisation dashboard flags the specific missing document type.
- What happens when bank details are changed while invoices are in processing? Pending payments continue using the previous bank details. Only future payments use the updated details.
- What happens when a supplier changes their bank details (BSB or account number)? A fresh EFTSure verification is triggered automatically. The new bank details enter "Pending" status with the indicator reset to yellow. Payments continue to the previous (verified) bank details until the new ones pass EFTSure verification. The old details are archived, not deleted.
- What happens when two Organisation Administrators edit the same supplier profile concurrently? The system uses optimistic concurrency -- the second save attempt shows a conflict error asking the user to refresh and re-apply their changes.
- What happens when a supplier entity has no primary bank account? The system prevents this state -- the first bank account added is automatically marked as primary, and removing the primary requires designating another as primary first.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an organisation dashboard showing all supplier entities under an ABN with aggregate compliance status, worker counts, and pending actions.
- **FR-002**: System MUST provide an account switcher component that allows users with multiple supplier entities to switch context without navigating away or re-authenticating.
- **FR-003**: System MUST remember the user's most recently selected supplier entity and restore it as the default on subsequent logins.
- **FR-004**: System MUST separate organisation-level fields (ABN, legal name, GST status) as read-only from supplier-level fields (trading name, contact details, service categories) which are editable.
- **FR-005**: System MUST scope all profile data (locations, workers, documents, bank details) to the active supplier entity with no cross-supplier data leakage.
- **FR-006**: System MUST support CRUD operations for supplier locations, with a constraint that at least one location must exist per supplier entity.
- **FR-007**: System MUST enforce a single primary location per supplier entity.
- **FR-008**: System MUST support inviting, viewing, and removing team members (workers) with role, location, and service assignments.
- **FR-009**: System MUST prevent removal of the last administrator from any supplier entity or organisation.
- **FR-010**: System MUST support document upload with type, expiry date, and approval status tracking. Documents are displayed in two separate sections: "Organisation Documents" (shared — public liability, ABN verification, workers comp) editable only by Organisation Administrators, and "Supplier Documents" (scoped per entity) editable by Supplier Administrators. Organisation documents are visible to all supplier entities under the same ABN.
- **FR-011**: System MUST warn when documents are within 30 days of expiry and mark expired documents as non-compliant. Compliance status per supplier entity is document-driven: **Compliant** = all required documents uploaded, approved, and within valid expiry dates. **Expiring** = any required document within 30 days of expiry. **Non-compliant** = any required document expired or missing. This status rolls up to the organisation dashboard.
- **FR-012**: System MUST support bank detail management with BSB, account number, and account name, enforcing a single primary account per supplier entity.
- **FR-013**: System MUST require explicit confirmation before changing bank details (BSB or account number).
- **FR-014**: System MUST partially mask bank account numbers (show last 4 digits only) unless the user explicitly reveals the full number.
- **FR-015**: System MUST allow Organisation Administrators to create new supplier entities under their ABN with an empty profile.
- **FR-016**: System MUST expose all profile management operations through the v2 API, maintaining consistent JSON response structure.
- **FR-017**: System MUST restrict the organisation dashboard and supplier entity creation to Organisation Administrators only.
- **FR-018**: System MUST resolve the owner vs administrator role confusion so that role changes do not cause access errors (404s).
- **FR-019**: System MUST target the active administrator (not a hardcoded owner) for impersonation.
- **FR-020**: System MUST audit-log all profile changes (business details, locations, workers, documents, bank details) — recording who changed what and when. Audit trail is visible to Organisation Administrators and TC staff. This aligns with the existing event sourcing pattern.

### Key Entities

- **Organisation**: The top-level entity registered with an ABN. Contains legal trading name, ABN, GST status. Shared across all supplier entities. Read-only for supplier-level users.
- **Supplier**: An operational unit under an Organisation. Owns its own trading name, contact details, service categories, locations, workers, documents, bank details, and agreements. Each supplier is independently managed.
- **OrganisationWorker**: Links a user to a supplier entity. Carries role, status (active / pending / inactive), assigned location IDs, and assigned service IDs. Polymorphic relationship.
- **OrganisationLocation**: A physical address associated with a supplier entity. Has contact details and a primary flag. Morphic relationship to Supplier.
- **BankDetail**: Bank account information for a supplier entity. Contains BSB, account number, account name, `is_main` (primary flag), and `is_pending` (verification status). Morphic relationship to Supplier.
- **Document**: A compliance document uploaded against a supplier entity. Has a type (insurance, certification, licence), expiry date, approval status, and file reference.
- **Business**: An intermediary entity in the Organisation > Business > Supplier hierarchy. Represents a distinct business identity under the organisation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Organisation Administrators can view all supplier entities and their compliance status from a single dashboard page in under 3 seconds load time.
- **SC-002**: Switching between supplier entities via the account switcher completes in under 1 second.
- **SC-003**: Organisation Administrators can add a new supplier entity under their ABN without contacting TC staff, completing the process in under 2 minutes.
- **SC-004**: Zero 404 errors caused by admin role changes (owner vs administrator confusion eliminated).
- **SC-005**: Impersonation correctly targets the active administrator for any supplier entity, not a hardcoded owner.
- **SC-006**: Zero instances of cross-supplier data leakage -- a user scoped to Supplier A cannot see Supplier B's locations, workers, documents, or bank details through any endpoint.
- **SC-007**: All profile management operations are available through the v2 API with consistent JSON response structure and field-level validation errors.
- **SC-008**: Documents expiring within 30 days are surfaced on both the document list and the organisation dashboard without manual checking.
- **SC-009**: Support tickets for "can't add a colleague" and "need another supplier entity" drop to zero after launch.
- **SC-010**: Bank detail changes require explicit confirmation, preventing accidental modification of payment details.

## Clarifications

### Session 2026-03-19
- Q: How should organisation-level documents appear in the profile? -> A: Separate sections — "Organisation Documents" (shared, editable by Org Admins only) and "Supplier Documents" (scoped per entity, editable by Supplier Admins). Org docs visible to all entities under same ABN.
- Q: What happens after creating a new supplier entity? -> A: System switches context to the new entity and redirects to SR1 onboarding wizard. Org-level documents are pre-inherited. Org Admin can exit and resume later.
- Q: How is compliance status calculated? -> A: Document-driven only. Compliant = all required docs uploaded, approved, valid expiry. Expiring = any doc within 30 days. Non-compliant = any expired or missing required doc.
- Q: Does bank detail change trigger EFTSure re-verification? -> A: Yes — any BSB or account number change triggers fresh EFTSure verification. New details enter Pending, payments continue to old (verified) details until new ones pass.
- Q: Should profile changes be audit-logged? -> A: Yes — all changes to business details, locations, workers, documents, and bank details are audit-logged (who, what, when). Visible to Org Admins and TC staff. Matches existing event sourcing pattern.
