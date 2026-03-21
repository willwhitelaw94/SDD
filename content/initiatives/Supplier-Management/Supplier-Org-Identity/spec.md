---
title: "Feature Specification: Supplier Organisation Identity"
---

> **[View Mockup](/mockups/supplier-org-identity/index.html)**{.mockup-link}

# Feature Specification: Supplier Organisation Identity

**Epic**: SOI — Supplier Organisation Identity
**Created**: 2026-03-09
**Status**: Draft
**Input**: The current supplier registration creates a 3-layer hierarchy (Organisation → Business → Supplier) where the ABN lives on Organisation but multiple Suppliers can hang off the same ABN. There's no way for multiple users to belong to the same supplier organisation. We need suppliers to register and operate at the ABN/Organisation level, with team members able to join an existing org rather than creating duplicate records.

---

## Context

When a supplier registers with TC Portal today, three records are created in sequence: an Organisation (holding the ABN and legal identity), a Business (a named trading entity under that org), and a Supplier (the operational record used throughout the portal). The person who registers becomes the sole "owner" — there is no supported way for a second person from the same organisation to join without creating a duplicate set of records.

This creates real problems:

1. **Duplicate registrations** — A second employee from the same organisation registers separately, creating a new Supplier record with the same ABN. TC Portal now has two Supplier records for what is operationally one provider
2. **No team visibility** — The portal has no concept of "who else works here". The supplier owner cannot see their team, invite colleagues, or delegate access
3. **ABN is buried** — The ABN and legal organisation name (the true identity of a provider business) are not prominently shown in the portal — only the Business name is visible, which may differ from the legal entity
4. **Confusing hierarchy** — The Business layer adds complexity without adding value for most suppliers. Most providers are a single entity under one ABN

> **Scope note**: This spec covers the supplier-facing identity and team experience. Compliance, document verification, and agreement workflows are out of scope and covered under separate epics.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Join an Existing Organisation Instead of Creating a Duplicate (Priority: P1)

> **Estimate**: 15 days | ~$45k | Medium confidence

As a **Supplier team member**, I want to register for TC Portal access under my organisation's existing ABN — so that I join my employer's existing supplier record rather than creating a second one.

**Why this priority**: This is the most damaging current gap. Every duplicate registration creates a second Supplier record for the same provider, splitting invoice history, compliance documents, and client relationships across two records. Ops teams manually merge these, which is slow and error-prone.

**Independent Test**: Can be tested by registering with an ABN that already exists in the system, verifying that no new Supplier record is created, and confirming the new user appears as a team member on the existing supplier.

**Acceptance Scenarios**:

1. **Given** a Supplier with ABN `12 345 678 901` is already registered, **When** a new user enters the same ABN during registration, **Then** the portal detects the existing organisation and presents a "Join existing organisation" flow instead of the standard registration form

2. **Given** a new user is joining an existing organisation, **When** they complete registration, **Then** a join request is sent to the existing Supplier Administrator for approval — the new user does not gain access until approved

3. **Given** a Supplier Administrator receives a join request, **When** they approve it, **Then** the new user gains access to the supplier portal with the appropriate role (e.g., Supplier Staff) and appears in the organisation's team list

4. **Given** a Supplier Administrator receives a join request, **When** they reject it, **Then** the requesting user is notified by email and no access is granted

5. **Given** a new user's join request is pending, **When** they log in, **Then** they see a "Your request is pending approval" message and cannot access supplier features until approved

---

### User Story 2 — See and Manage Your Organisation's Team (Priority: P1)

> **Estimate**: 10 days | ~$30k | High confidence

As a **Supplier Administrator**, I want to see all users who have access to my supplier account, and manage their roles — so that I know who can act on behalf of my organisation and can remove access when staff leave.

**Why this priority**: With multiple users able to join an organisation, there must be a clear way to manage who has access. Without this, organisations have no visibility or control over their own team in the portal.

**Independent Test**: Can be tested by navigating to the supplier team page, confirming all active members are listed with their roles, and verifying that removing a member immediately revokes their portal access.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator is logged in, **When** they view the Team section of their supplier portal, **Then** they see a list of all users with access, showing each person's name, email, role, and date they joined

2. **Given** a Supplier Administrator views the team list, **When** they select a team member, **Then** they can change that member's role (e.g., from Staff to Administrator) or remove their access entirely

3. **Given** a Supplier Administrator removes a team member, **When** the removal is confirmed, **Then** that user can no longer log in to the supplier portal and any pending actions assigned to them are flagged for reassignment

4. **Given** a Supplier Administrator wants to add someone proactively, **When** they send an invitation by email, **Then** the invited person receives an email with a link to complete registration and is automatically joined to the organisation upon completion — no separate approval needed for invited users

---

### User Story 3 — See Your Organisation's Legal Identity in the Portal (Priority: P2)

> **Estimate**: 5 days | ~$15k | High confidence

As a **Supplier**, I want my portal account to clearly show my organisation's legal name and ABN — so that I can confirm I'm operating under the correct legal entity and TC Portal has my correct details on file.

**Why this priority**: The current portal shows a "Business name" that may differ from the legal trading name on the ABN. Suppliers need confidence that the entity submitting invoices matches their legal registration, particularly for GST and payment purposes.

**Independent Test**: Can be tested by navigating to the supplier business details page and confirming the legal trading name and ABN displayed match the ABR record for that ABN.

**Acceptance Scenarios**:

1. **Given** a Supplier is viewing their Business Details page, **When** the page loads, **Then** the legal trading name (from ABR) and ABN are prominently displayed as read-only fields — these cannot be edited directly and show "Verified" if the ABN has been confirmed with the ABR

2. **Given** a Supplier's ABN verification is pending or failed, **When** they view Business Details, **Then** a banner explains the status (e.g., "ABN verification in progress") and advises them to contact TC if details are wrong

3. **Given** a Supplier believes their legal name is displayed incorrectly, **When** they use the "Something wrong? Contact us" link, **Then** they can raise a correction request — changes to legal name and ABN are not self-service

---

### User Story 4 — Invite Team Members via Email (Priority: P2)

> **Estimate**: 8 days | ~$24k | Medium confidence

As a **Supplier Administrator**, I want to invite colleagues to join my organisation's supplier account by entering their email address — so that they can access the portal without having to go through the public registration flow and risk creating a duplicate.

**Why this priority**: Invitation is the preferred path for growing a supplier team — it bypasses the ABN detection flow entirely and guarantees the invited user lands in the right organisation. It also gives the Administrator control over who joins.

**Independent Test**: Can be tested by sending an invitation from the Team page, having the invited person click the link, complete registration, and confirm they appear in the team list without a new Supplier record being created.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator is on the Team page, **When** they enter an email address and click "Send Invitation", **Then** an invitation email is sent with a unique link valid for 7 days

2. **Given** an invited user clicks the invitation link, **When** they complete their registration details (name, phone, password), **Then** their account is created and linked directly to the inviting organisation — no ABN entry required, no approval needed

3. **Given** an invited user's link has expired (7 days), **When** they click it, **Then** they see an "Invitation expired" message and are prompted to ask their administrator to resend

4. **Given** an Administrator has sent an invitation, **When** they view the Team page, **Then** pending invitations are listed separately with the email address, date sent, and a "Resend" or "Cancel" action

---

### User Story 5 — A Unified Organisation View in the Portal (Priority: P2)

> **Estimate**: 5 days | ~$15k | High confidence

As a **Supplier**, I want my portal to have a single "Organisation" section where I can see my business details and team in one place — so that I don't have to navigate between separate sidebar items to understand who we are and who has access.

**Why this priority**: Currently "Business Details" and "Team" are separate sidebar entries with no visual connection. Once suppliers operate at the org level with multiple users, these belong together. The sidebar should reflect the model: one organisation, with identity and team as two facets of the same thing.

**Independent Test**: Can be tested by navigating to the Organisation section, confirming both business identity (ABN, legal name) and team members are accessible without returning to the sidebar.

**Acceptance Scenarios**:

1. **Given** a Supplier is logged in, **When** they navigate to "Organisation" in the sidebar, **Then** they see a tabbed page with "Business Details" (legal name, ABN, contact) and "Team" (all members with roles and status)

2. **Given** a Supplier Administrator is on the Organisation page, **When** they switch to the Team tab, **Then** they can invite, manage, and remove team members without leaving the section

3. **Given** a Supplier navigates to the Organisation section, **When** the page loads, **Then** the sidebar shows "Organisation" as a single item — "Business Details" and "Team" are no longer separate sidebar links

4. **Given** a Supplier Administrator wants to manage org-level settings (billing email, notification preferences, default contact), **When** they access a dedicated Settings tab within Organisation, **Then** they can edit those without touching the read-only TC-managed fields (ABN, legal name)

---

### User Story 6 — Manage Team Members Per Location (Priority: P2)

> **Estimate**: 8 days | ~$24k | Medium confidence

As a **Supplier Administrator**, I want to assign team members to specific service locations — so that I know exactly who is operating at each site and can manage access at that level.

**Why this priority**: Many supplier organisations operate across multiple locations (e.g., a cleaning provider with crews in three suburbs). The team is not flat — people belong to locations. Managing team membership without location context loses important operational information.

**Independent Test**: Can be tested by assigning a team member to Location A but not Location B, then confirming that the member appears in Location A's team view and not Location B's.

**Acceptance Scenarios**:

1. **Given** a Supplier Administrator is managing a team member, **When** they edit that member's profile, **Then** they can assign or remove that member from one or more service locations

2. **Given** a Supplier Administrator views the Organisation → Team tab, **When** they filter by location, **Then** only team members assigned to that location are shown

3. **Given** a Supplier Administrator views a specific service location, **When** they open the location detail, **Then** they can see and manage which team members are assigned there without navigating away

4. **Given** a team member is removed from a location, **When** the change is saved, **Then** that member remains in the organisation but is no longer listed under that location

---

### User Story 7 — TC Admin Navigates Between Businesses in an Organisation (Priority: P1)

> **Estimate**: 6 days | ~$18k | Medium confidence

As a **TC staff member (Admin)**, I want to view a supplier organisation that has multiple business entities — and jump between those businesses — so that I can answer questions and investigate records without losing context about which business I'm looking at.

**Why this priority**: TC Operations regularly deal with supplier organisations that have multiple entities (e.g., same ABN but different trading names, or a provider operating distinct divisions). Without a clear way to navigate between businesses under one org, admins must open multiple tabs or search repeatedly to compare records.

**Independent Test**: Can be tested by opening a supplier organisation that has two business records, switching between them using the org-level switcher, and confirming that team, invoices, and settings shown reflect the selected business.

**Acceptance Scenarios**:

1. **Given** a TC Admin is viewing a supplier organisation with multiple business entities, **When** they access the supplier portal on behalf of that org, **Then** a switcher (dropdown or tabs) is visible showing all businesses under the same ABN

2. **Given** a TC Admin selects a different business from the switcher, **When** the selection is made, **Then** the team, service locations, prices, and invoices shown update to reflect that business without a full page reload

3. **Given** a TC Admin is answering a question from a supplier, **When** they need to confirm which business the supplier is currently logged in as, **Then** the active business is clearly indicated in the admin view to prevent confusion

4. **Given** a supplier has only one business under their ABN, **When** a TC Admin views their organisation, **Then** no business switcher is shown — the view is simplified to the single entity

---

### Out of Scope

- **Compliance document management** — Covered by the Supplier Audit Process epic
- **Supplier pricing and rate cards** — Covered by the Supplier Pricing epic
- **Removing the Business data model** — This spec covers the user-facing experience; data model simplification is a developer task informed by this spec, not a user story
- **Single Sign-On (SSO)** — Not in scope for this phase
- **Bulk user import** — Invitations are one-at-a-time for this phase
- **Role customisation** — Two roles only: Administrator and Staff. Custom permission sets are out of scope

### Edge Cases

- What happens if a supplier registers with an ABN that exists in Zoho but not yet in TC Portal? — The ABR lookup creates the Organisation; if a Zoho supplier record exists for that ABN it should be matched rather than creating a duplicate
- What happens if a team member's email changes? — The Administrator can update the email on their behalf from the team management page
- What happens if the sole Administrator leaves and no one else has admin rights? — The remaining Staff members see a banner prompting them to contact TC Care to have admin rights transferred
- What happens if an invitation link is forwarded to the wrong person? — The Administrator can cancel pending invitations from the Team page at any time; cancelled links are immediately invalidated
- What if an organisation has multiple ABNs (e.g., a franchise)? — Each ABN remains a separate Organisation in this phase; cross-ABN consolidation is future scope

---

## Requirements *(mandatory)*

### Functional Requirements

**Duplicate Detection at Registration**

- **FR-001**: System MUST detect when a registering user's ABN already exists in TC Portal and present a "Join existing organisation" path instead of creating a new Supplier record
- **FR-002**: System MUST send a join request notification to all active Supplier Administrators of the existing organisation when a new user attempts to join via ABN match
- **FR-003**: System MUST prevent the joining user from accessing supplier features until at least one Administrator approves the request
- **FR-004**: System MUST notify the requesting user by email when their join request is approved or rejected

**Team Management**

- **FR-005**: Supplier Administrators MUST be able to view all users with access to their organisation, including their name, email, role, and join date
- **FR-006**: Supplier Administrators MUST be able to change a team member's role between Administrator and Staff
- **FR-007**: Supplier Administrators MUST be able to remove a team member, which immediately revokes all portal access for that user
- **FR-008**: System MUST prevent a Supplier Administrator from removing themselves if they are the only Administrator on the account
- **FR-009**: Supplier Administrators MUST be able to view and manage pending join requests (approve or reject) from the Team page

**Invitations**

- **FR-010**: Supplier Administrators MUST be able to invite a new user by email address from the Team page
- **FR-011**: Invitation links MUST expire after 7 days and become invalid after a single successful use
- **FR-012**: Invited users MUST be automatically joined to the organisation upon completing registration — no separate approval step required for invited users
- **FR-013**: Administrators MUST be able to cancel a pending invitation or resend it from the Team page
- **FR-014**: System MUST prevent an invitation being sent to an email address that already has a TC Portal account

**Organisation Identity Display**

- **FR-015**: The supplier Business Details page MUST display the legal trading name and ABN sourced from the ABR record as read-only fields with a verification status indicator
- **FR-016**: System MUST NOT allow suppliers to self-edit their legal trading name or ABN — changes require TC Care intervention
- **FR-017**: System MUST display a "Something wrong? Contact us" prompt adjacent to the legal identity fields

**Unified Organisation Navigation**

- **FR-018**: The supplier sidebar MUST consolidate "Business Details" and "Team" into a single "Organisation" navigation item with internal tabs
- **FR-019**: A dedicated "Settings" tab within the Organisation section MUST allow Supplier Administrators to manage editable org-level fields (billing contact, notification email, preferred contact) without exposing TC-controlled identity fields for editing
- **FR-020**: System MUST support navigating directly to a specific tab via URL (e.g., `/suppliers/{id}/organisation?tab=team`) so that links from notifications and emails land on the correct tab

**Location-Scoped Team Management**

- **FR-021**: Supplier Administrators MUST be able to assign team members to one or more service locations when editing a team member's profile
- **FR-022**: The Team tab MUST include a location filter so Administrators can view team members assigned to a specific location
- **FR-023**: Each service location detail view MUST include a team section showing members assigned to that location, with the ability to add or remove members from that location

**TC Admin Multi-Business Navigation**

- **FR-024**: When a TC Admin views a supplier organisation with multiple business entities, the portal MUST display a business switcher showing all businesses under the same ABN
- **FR-025**: Switching between businesses in the admin view MUST update all context-sensitive data (team, locations, prices, invoices) to reflect the selected business
- **FR-026**: The active business MUST be clearly labelled in the admin view at all times when multiple businesses exist under an organisation

### Key Entities

- **Organisation**: The canonical identity of a provider business. Holds ABN, legal trading name, ABR verification status, and GST registration. One Organisation per ABN
- **Supplier**: The operational portal record (stages, compliance, services, contacts). Belongs to one Organisation via Business. Multiple users can belong to the same Supplier
- **OrganisationWorker**: Links a User to a Supplier with a role (Administrator or Staff) and status (Active, Pending, Removed)
- **Invitation**: A time-limited token sent to an email address, pre-authorising the recipient to join a specific Supplier organisation without going through ABN detection

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero new duplicate Supplier records are created for ABNs that already exist in TC Portal — detected at registration and redirected to join flow
- **SC-002**: A Supplier Administrator can invite a team member and have them active in the portal in under 5 minutes end-to-end
- **SC-003**: All existing Supplier users can see at minimum their own entry in the Team page (reflecting current ownership model) — no regressions for existing accounts
- **SC-004**: The legal trading name and ABN shown in Business Details matches the ABR record for 100% of suppliers with a verified ABN
- **SC-005**: Support tickets related to "duplicate supplier accounts" and "can't add a team member" are reduced to zero within 30 days of release

---

## Effort Estimate

**Generated**: 2026-03-10 | **Size**: Large (L) | **Confidence**: Medium

### Summary

| Metric | Value |
|--------|-------|
| **Total Days** | 57 |
| **Total Cost** | ~$171k |

### Story Breakdown

| Story | Priority | Days | Cost | Confidence | Notes |
|-------|----------|------|------|------------|-------|
| US-1 — Join existing org (ABN detection) | P1 | 15 | ~$45k | Medium | New registration fork, approval workflow, notifications |
| US-2 — Team management | P1 | 10 | ~$30k | High | Team list, role changes, removal; invitation UI overlaps US-4 |
| US-3 — Legal identity display | P2 | 5 | ~$15k | High | ABR read-only display, verification badge |
| US-4 — Email invitations | P2 | 8 | ~$24k | Medium | Token system, expiry, resend/cancel, auto-join flow |
| US-5 — Unified org nav | P2 | 5 | ~$15k | High | Sidebar refactor, tabbed page, URL routing |
| US-6 — Location-scoped team | P2 | 8 | ~$24k | Medium | Location assignment, filter, location detail team section |
| US-7 — TC Admin multi-business nav | P1 | 6 | ~$18k | Medium | Business switcher, context-sensitive refresh |
| **Total** | | **57** | **~$171k** | | |

### Phase Recommendations

| Phase | Stories | Days | Focus |
|-------|---------|------|-------|
| MVP | US-1, US-2, US-3 | 30 | Core: no more duplicates, team visibility, legal identity |
| Phase 2 | US-4, US-5, US-7 | 19 | Invitations, unified nav, admin multi-business |
| Phase 3 | US-6 | 8 | Location-scoped team management |

### Red Flags

- US-1 (ABN detection) touches the registration flow — high-traffic, first-impression path. Regression risk.
- ABR integration dependency — if ABR lookup isn't available, US-3 and parts of US-1 are blocked
- US-7 (multi-business nav) requires the Business layer to remain in the data model; conflicts with any future simplification work

### Assumptions

- ABR lookup API is already integrated (existing capability, not new work)
- `OrganisationWorker` model exists (confirmed — already in codebase)
- Email sending infrastructure is in place (Mailgun/SES already configured)
- "Two roles only" (Administrator / Staff) per scope note — no custom permissions


## Clarification Outcomes

### Q1: [Scope] What is the specific problem being solved?
**Answer:** The spec is exceptionally clear on this. Four problems: (1) Duplicate registrations — second employee from same org creates new Supplier record with same ABN, (2) No team visibility — no "who else works here" concept, (3) ABN is buried — legal identity not prominently shown, (4) Confusing hierarchy — Business layer adds complexity without value. The existing 3-layer hierarchy is Organisation → Business → Supplier. SOI simplifies the user experience to Organisation-centric (ABN is the identity anchor) while preserving the data model.

### Q2: [Data] Does this introduce a new entity?
**Answer:** No new entity. The spec uses the EXISTING `Organisation` model (holds ABN, legal name) and `OrganisationWorker` model (links users to suppliers with roles). The spec confirms: "OrganisationWorker model exists (confirmed — already in codebase)." The `Organisation` model already has `abn`, `legal_trading_name`, `abn_active`, `abn_object`, `owner_user_id`, `verification_stage`. The `OrganisationWorker` links users to the supplier with role and status. SOI adds team management UI and ABN-based duplicate detection to EXISTING models.

### Q3: [Dependency] Does ABN lookup require an external API?
**Answer:** Yes, and it is ALREADY BUILT. The `AbrService` (`domain/Supplier/Services/V2/AbrService.php`), `AbnLookupController`, `LookupAbnAction`, and `CheckAbnExistsAction` provide ABR API integration. The spec's assumptions confirm: "ABR lookup API is already integrated (existing capability, not new work)." The registration route `POST /api/v2/supplier/register/check-abn` already exists.

### Q4: [Edge Case] How are mergers and acquisitions handled?
**Answer:** The spec's edge case states: "What if an organisation has multiple ABNs (e.g., a franchise)? Each ABN remains a separate Organisation in this phase; cross-ABN consolidation is future scope." For mergers, the codebase has `MergeOrganisationsAction` (`domain/Supplier/Actions/V2/Staff/MergeOrganisationsAction.php`) confirming organisation merging is already scaffolded. SOI does not handle M&A in this phase but the infrastructure exists for future consolidation.

### Q5: [Integration] Does this affect billing attribution?
**Answer:** Bills are attributed to `Supplier` records (not Organisation directly). `Bill.supplier_id` links to a specific Supplier. If an Organisation has multiple Businesses (each with their own Supplier), bills are attributed to the specific Supplier. US7 (TC Admin multi-business navigation) addresses this: admins can switch between businesses under one org and see business-specific invoices. Financial records stay at the Supplier level; SOI adds the Organisation layer for identity and team management without changing billing attribution.

### Q6: [Data] The SupplierPortalRoleEnum has 4 roles. SOI says "Two roles only: Administrator and Staff."
**Answer:** The existing `SupplierPortalRoleEnum` has: `ORGANISATION_ADMINISTRATOR`, `SUPPLIER_ADMINISTRATOR`, `SUPPLIER`, `TEAM_MEMBER`. SOI simplifies to two user-facing roles (Administrator and Staff) per the scope note. The existing enum may remain for backward compatibility, but the UI presents only two options. **Recommendation:** Map ORGANISATION_ADMINISTRATOR + SUPPLIER_ADMINISTRATOR → "Administrator" in the UI. Map SUPPLIER + TEAM_MEMBER → "Staff." The granular enum provides future flexibility without exposing complexity to users.

### Q7: [Scope] The unified Organisation section (US5) — does this change the sidebar structure?
**Answer:** Yes. FR-018 says "consolidate Business Details and Team into a single Organisation navigation item with internal tabs." The existing supplier portal has separate sidebar items: `BusinessDetails/Index.vue`, `Team/Index.vue`. SOI merges these into a single `Organisation/Index.vue` with tabs: Business Details, Team, Settings. This is a navigation refactor, not a data model change.

### Q8: [Dependency] The invitation system — does this use the existing OrganisationInvitation model?
**Answer:** Yes. The codebase has `OrganisationInvitation` model and related actions: `CreateSupplierInvitationAction`, `AcceptInvitationAction`, `InvitationController`. The migration `add_invitation_columns_to_organisation_invitations_table` (untracked) extends this table. SOI's invitation flow (US4) uses and extends this existing infrastructure. The 7-day expiry (FR-011) and single-use tokens are implementation details for the existing invitation model.

### Q9: [UX] The join request approval workflow — what notification mechanism is used?
**Answer:** FR-002 says "send a join request notification to all active Supplier Administrators." The Supplier model implements `Notifiable`. Email notifications would use the existing Laravel notification infrastructure. The `InviteTeamMemberAction` and related notification classes provide the pattern. **Assumption:** Join requests are notified via email with an in-app notification (bell icon) on the Team page showing pending requests.

### Q10: [Performance] ABN detection at registration — what is the latency?
**Answer:** The ABN check happens when the user enters their ABN on the registration form. The existing `CheckAbnExistsAction` queries the local database (not the ABR API) for existing organisations with the same ABN. This is a simple database lookup — <50ms. The ABR API call (for ABN validation and auto-population) is the slower step (~1-2 seconds) but happens regardless of SOI.

### Q11: [Edge Case] Sole Administrator leaves — how is this handled?
**Answer:** The spec addresses this: "remaining Staff members see a banner prompting them to contact TC Care to have admin rights transferred." FR-008 prevents the sole Administrator from removing themselves. This is a manual process — TC support transfers admin rights. **Recommendation:** Add FR: "System MUST display a warning banner when an Organisation has only one Administrator, suggesting they add a second Administrator for continuity."

### Q12: [Data] US6 (Location-Scoped Team Management) — does OrganisationLocation support team assignment?
**Answer:** The `OrganisationLocation` model exists. Team assignment to locations would require a pivot table: `organisation_worker_locations` with `organisation_worker_id` and `organisation_location_id`. This is a new relationship but uses existing entities. The Phase 3 placement (after MVP) is appropriate given the complexity.

## Refined Requirements

1. **Role Mapping**: The UI should present "Administrator" and "Staff" as the two roles. Map to existing `SupplierPortalRoleEnum` values: Administrator = ORGANISATION_ADMINISTRATOR or SUPPLIER_ADMINISTRATOR, Staff = TEAM_MEMBER.

2. **New FR**: System MUST display a warning banner when an Organisation has only one active Administrator, suggesting they invite a second Administrator for business continuity.

3. **AC for US1**: Given a user registers with an ABN that exists in the local database but NOT in the ABR API (stale record), When the ABN check runs, Then the system still presents the "Join existing organisation" flow (local database match takes precedence over ABR status).
