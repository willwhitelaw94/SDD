---
title: "Feature Specification: Care Circle Uplift (CCU)"
description: "Clinical And Care Plan > Care Circle Uplift"
---

> **[View Mockup](/mockups/care-circle-uplift/index.html)**{.mockup-link}

# Feature Specification: Care Circle Uplift (CCU)

**Status**: Draft
**Epic**: TP-1908 | **Initiative**: Clinical and Care Plan (TP-1859)
**Prefix**: CCU
**Created**: 2026-01-14

---

## Overview

The Care Circle Uplift transforms the existing Contacts module from a limited, free-text-driven list into a scalable, role-governed contact management system. The current module displays only ~6 contacts at once, uses unstructured role entries, and surfaces only the primary Supporter Representative from My Aged Care (MAC) — resulting in missing contacts, inaccurate authority attribution, and downstream compliance risks for Home Care Agreement (HCA) sign-off, care communications, and audit processes.

CCU delivers an expanded contacts grid, a fixed role taxonomy with authority mapping, systematic MAC import and reconciliation, Primary Decision-Maker governance, Private Partner management (GPs, pharmacists, specialists), role-aware email hooks, and full audit logging. It provides the role and authority substrate that Care Management Activities (CMA) depends on for compliant communications.

---

## User Scenarios & Testing

### User Story 1 — View All Contacts in a Scalable Grid (Priority: P1)

As a **Care Partner or Coordinator**, I want to see at least 15 contacts at once in a grid with sticky headers so that I can find and review a recipient's care circle without excessive scrolling.

**Acceptance Scenarios**:

1. **Given** a recipient has 20+ contacts, **When** a Care Partner views the Contacts module on desktop, **Then** the grid displays at least 15 rows with a sticky header and pagination controls

2. **Given** a recipient has contacts, **When** a Recipient logs into the Portal, **Then** they see their Main Contacts and Private Partners clearly grouped by section

3. **Given** a Care Partner is viewing the contacts grid on a mobile device, **When** the page loads, **Then** contacts display in an accordion layout with lazy loading for performance

4. **Given** a recipient has no contacts, **When** a user views the Contacts module, **Then** an empty state is shown with a prompt to add a Main Contact or Private Partner

---

### User Story 2 — Add, Edit, and Archive Contacts with Structured Roles (Priority: P1)

As a **Care Partner or Coordinator**, I want to add, edit, and archive contacts with one or more roles from a fixed taxonomy so that role assignments are consistent, authority levels are auto-mapped, and contact history is preserved.

**Acceptance Scenarios**:

1. **Given** a Care Partner clicks "Add Contact", **When** they fill in personal details and select one or more roles (Supporter Rep, Secondary Supporter, GP, Specialist, Informal Carer, Emergency Contact, Other), **Then** the contact is created and the authority level auto-sets based on the selected role(s)

2. **Given** a contact has the Supporter Representative role, **When** the contact is saved, **Then** the authority level is locked to "Decision-Maker" and is not editable

3. **Given** a Care Partner archives a contact, **When** the archive action completes, **Then** the contact is soft-deleted (history preserved), an audit log entry is created capturing the actor and timestamp, and the contact is hidden from the active grid

4. **Given** a Care Partner edits a contact's role or authority, **When** the change is saved, **Then** an audit log entry captures the before/after state, the actor, and the timestamp

5. **Given** a contact is flagged as PoA or Guardian, **When** the contact is saved, **Then** the system requires supporting documentation to be uploaded; missing docs trigger a warning

---

### User Story 3 — Enforce Exactly One Primary Decision-Maker (Priority: P1)

As a **Care Partner or Coordinator**, I want the system to enforce exactly one Primary Decision-Maker per recipient so that HCA sign-off, care communications, and compliance audits always route to the correct authority.

**Acceptance Scenarios**:

1. **Given** a recipient has an existing Primary Decision-Maker, **When** a user attempts to set a second contact as Primary, **Then** validation blocks the action and displays a message explaining only one Primary is allowed

2. **Given** a user wants to change the Primary Decision-Maker, **When** they are a Trilogy staff member, Care Partner, or the existing Primary Decision-Maker, **Then** they can reassign the Primary flag to a different contact

3. **Given** a user without authorization attempts to change the Primary flag, **When** they access the edit form, **Then** the Primary Decision-Maker field is read-only

4. **Given** a Recipient views their contacts, **When** the contact list renders, **Then** the Primary Decision-Maker is clearly flagged with a visible indicator

5. **Given** a Care Partner views the package context menu, **When** the menu displays, **Then** it shows the client and/or their Primary Decision-Maker contact

---

### User Story 4 — Import and Reconcile MAC Contacts (Priority: P1)

As a **Care Partner or Coordinator**, I want to import contacts from My Aged Care via monthly and manual refresh so that all MAC contacts are surfaced and reconciled without manual re-keying.

**Acceptance Scenarios**:

1. **Given** a monthly MAC sync runs, **When** new contacts are found, **Then** a side-by-side diff modal presents conflicts with accept/skip/map options for each contact

2. **Given** a Care Partner clicks the "Resync" button, **When** the manual refresh completes, **Then** new and updated MAC contacts are shown in the conflict resolution modal

3. **Given** a MAC contact import has conflicting data with an existing Portal contact, **When** the diff modal is shown, **Then** the user can accept the MAC data, skip the update, or manually map fields

4. **Given** MAC does not push deletes, **When** a contact is removed from MAC but exists in Portal, **Then** the contact is flagged for manual review rather than auto-deleted

---

### User Story 5 — Add Private Partners (Priority: P2)

As a **Care Partner or Coordinator**, I want to add Private Partners (GP, pharmacist, specialist, optometrist, geriatrician) using a predefined partner type dropdown so that external professionals are linked to the recipient's care circle with structured classification.

**Acceptance Scenarios**:

1. **Given** a Care Partner clicks "Add Private Partner", **When** the form loads, **Then** a dropdown offers predefined partner types (GP, Pharmacist, Specialist, Optometrist, Geriatrician, Other)

2. **Given** a Private Partner is added, **When** the contacts grid renders, **Then** the partner appears in a separate "Private Partners" section distinct from Main Contacts

---

### User Story 6 — View Contact Activity (Priority: P2)

As a **Care Partner**, I want to see a contact's last login date and last communication date so that I have visibility into their engagement with the Portal.

**Acceptance Scenarios**:

1. **Given** a contact has Portal access, **When** a Care Partner views the contacts grid, **Then** "Last Login" and "Last Communication" columns show the relevant dates

2. **Given** a contact has never logged in, **When** the grid renders, **Then** the "Last Login" field displays "Never" or is blank

---

### User Story 7 — Role-Aware Email Hooks (Priority: P2)

As a **Care Partner**, I want to email a contact using a role-specific template with TCID tagging so that communications are auditable and contextually appropriate.

**Acceptance Scenarios**:

1. **Given** a Care Partner clicks the email action on a GP contact, **When** the mailto link opens, **Then** the GP email template is preselected and the TCID is included in the subject line

2. **Given** any email intent is triggered, **When** the mailto link is activated, **Then** the system logs the email intent for audit purposes

---

### User Story 8 — Export Contact Role History (Priority: P3)

As a **Compliance team member**, I want to export contact role history as CSV so that I can provide audit evidence for agreements and role changes.

**Acceptance Scenarios**:

1. **Given** a Compliance user clicks "Export Contact History", **When** the export completes, **Then** a CSV file is generated containing timestamps, actor, before/after states, authority levels, and primary flag changes for all contacts on the recipient

---

### Edge Cases

- What happens if a MAC import introduces a contact with the same name as an existing manual contact? The diff modal shows both records side-by-side for manual resolution; no auto-merge occurs
- What happens if the Primary Decision-Maker is archived? The system blocks the archive and requires the Primary flag to be reassigned first
- What happens if a MAC schema change breaks the import? Contract tests detect the schema mismatch; fallback is manual contact addition with an error notification to the admin team
- What happens on a mobile device with 100+ contacts? Virtual scroll and accordion layout ensure performance; the grid loads in under 1 second

---

## Functional Requirements

**Scalable Grid**
- **FR-001**: System MUST display at least 15 contact rows on desktop with a sticky header and pagination
- **FR-002**: System MUST provide a mobile-responsive accordion layout with lazy loading for contact lists
- **FR-003**: Grid MUST support grouped sections: Main Contacts and Private Partners

**Role Taxonomy & Authority Mapping**
- **FR-004**: System MUST enforce a fixed role taxonomy: Supporter Representative, Secondary Supporter, GP, Specialist, Informal Carer, Emergency Contact, Other
- **FR-005**: System MUST auto-map roles to authority levels: Decision-Maker, Advisor, View-Only
- **FR-006**: Supporter Representative role MUST always map to Decision-Maker authority (locked, not editable)
- **FR-007**: Multiple roles per contact MUST be supported

**Primary Decision-Maker Governance**
- **FR-008**: System MUST enforce exactly one Primary Decision-Maker per recipient at all times
- **FR-009**: Primary flag MUST be editable only by Trilogy staff, Care Partners, or the existing Primary Decision-Maker
- **FR-010**: Primary Decision-Maker MUST be clearly flagged in all contact views

**CRUD & Lifecycle**
- **FR-011**: System MUST support add, edit, and archive (soft delete) workflows for contacts
- **FR-012**: Role selection MUST be required when adding or editing a contact
- **FR-013**: PoA/Guardian roles MUST require supporting document upload
- **FR-014**: All lifecycle changes (add, edit, archive, authority change, primary flag change, comms sent) MUST be audit logged

**MAC Import**
- **FR-015**: System MUST support monthly scheduled and manual refresh MAC contact imports
- **FR-016**: Import conflicts MUST be presented in a side-by-side diff modal with accept/skip/map options
- **FR-017**: MAC imports MUST NOT auto-delete contacts; stale records are flagged for manual review

**Private Partners**
- **FR-018**: System MUST support adding Private Partners with predefined partner types via dropdown
- **FR-019**: Private Partners MUST display in a separate section from Main Contacts

**Email Hooks**
- **FR-020**: System MUST support mailto-based email with role-specific template preselection and TCID tagging
- **FR-021**: System MUST log email intent for audit purposes

**Performance & Accessibility**
- **FR-022**: Grid MUST load 100 contacts in less than 1 second; search/filter MUST respond in less than 200ms
- **FR-023**: All contact interfaces MUST meet WCAG 2.1 AA compliance

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Contact** | Person linked to a recipient's care circle (main contact or private partner) |
| **Role** | Fixed taxonomy value assigned to a contact (supports multiple per contact) |
| **Authority Level** | Enum: Decision-Maker, Advisor, View-Only — auto-mapped from role |
| **Primary Decision-Maker** | Exactly one per recipient; governs HCA sign-off and key communications |
| **Private Partner** | External professional (GP, pharmacist, specialist, optometrist, geriatrician) |
| **Tag** | Additional indicator: Registered Supporter, PoA, Guardian, Emergency, Lives Close By |
| **MAC Contact** | Contact record imported from My Aged Care via scheduled or manual sync |

---

## Success Criteria

### Measurable Outcomes

| Goal | Metric | Target |
|------|--------|--------|
| Increase contact visibility | Contacts visible without scroll (desktop) | 15+ rows |
| Reduce add/classify time | Time to add a contact and select role | 30 seconds or less |
| Import accuracy | MAC contacts reconciled without manual re-keying | 100% |
| Authority fidelity | Incorrect authority escalations | 0 in first month |
| Governance enforcement | Recipients with a Primary Decision-Maker | 100% |
| Audit completeness | Lifecycle changes and comms logged | 100% |
| Recipient clarity | Recipients can see their Primary and grouped contacts | 100% |

---

## Assumptions

- MAC provides a contacts export for scheduled imports (monthly + manual refresh); no deletes propagate from MAC
- Multiple roles per contact are allowed
- Primary Decision-Maker flag is editable only by internal staff, Care Partners, or existing Primary Decision-Makers
- Email flows use mailto with TCID tagging as MVP; future in-portal sendMail via Microsoft Graph may follow under CMA
- Last Login and Last Communication data are available from existing Portal telemetry

---

## Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| MAC contact export API | External | Required for scheduled and manual import |
| [CMA — Care Management Activities](/initiatives/Clinical-And-Care-Plan/Care-Management-Activities/) | Epic | Audit logging and comms governance standards |
| Audit logging infrastructure (Spatie ActivityLog) | Technical | Required for lifecycle audit trail |
| TCID system | Technical | Required for email template tagging |
| Existing Contacts module schema | Technical | Foundation for schema extension |

---

## Out of Scope

- SMS or push communications
- Bulk role editing across multiple contacts
- Two-way sync back to MAC (Portal is receive-only)
- In-portal email delivery (covered by CMA epic)
- Advanced contact search (full-text, fuzzy matching)
- Guardian/Plan Manager as first-class roles (may expand post-launch)
- Automated stale contact cleanup

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Authority mis-mapping — wrong person signs HCA | HIGH | Role-to-authority locks; dual confirmation on role change; audit alerts |
| MAC schema or process changes break import | MEDIUM | Contract testing; schema versioning; fallback to manual add |
| Mobile UX degradation with large contact lists | LOW | Virtual scroll; accordion layout; define mobile MVP parity |
| Mailto limitations — no telemetry on delivery | LOW | Log email intent in Portal; richer send via CMA later |

---

## Open Questions

1. Should the role taxonomy expand beyond the initial seven to include Guardian, Plan Manager, and Pharmacist as first-class roles?
2. Should conflict handling require reason codes when rejecting MAC imports?
3. What is the mobile parity requirement — view-only or full add/edit/import capability?
4. Rollout strategy — feature-flag with shadow UI or single release?

## Clarification Outcomes

### Q1: [Dependency] The spec references CMA (Care Management Activities) for audit logging and communication governance standards. CMA is a separate epic. What is the delivery order? Can CCU launch without CMA?
**Answer:** The codebase already uses Spatie ActivityLog for audit logging across most domain models (`LogsActivity` trait on `Risk`, `PackageNeed`, `RiskCategory`, `NeedCategory`, `Document`, `Note`, etc.). CCU can use the same Spatie ActivityLog infrastructure without waiting for CMA. The email hooks (US7) use `mailto:` links with TCID tagging as an MVP -- no in-portal email delivery is needed. **CCU can launch without CMA. Audit logging uses existing Spatie infrastructure. Email hooks are mailto-based. CMA only matters for future in-portal email delivery.**

### Q2: [Data] The MAC contact import via monthly sync and manual refresh is a critical feature. What API does MAC expose? Is it a push or pull model? The spec says "no deletes propagate from MAC" -- has this been confirmed with MAC technical documentation?
**Answer:** The codebase already has integration with Services Australia via the `domain/Package/Feature/PackageSync/` folder, which includes `SyncPackageFromServicesAustralia.php`, `SyncPackageAllocations.php`, and `FetchPackageClassificationsAction.php`. The existing SA sync is a pull model (Portal fetches data). MAC contacts are a different data source from SA allocations, but the pattern is established. **Assumption: MAC contact import will follow the same pull-model pattern as SA sync. The "no deletes" assumption appears to be based on MAC's behaviour rather than a documented API contract. Contract tests (mentioned in edge cases) should verify this. This needs confirmation from the MAC technical team before implementation.**

### Q3: [Edge Case] The open question about mobile parity (view-only vs full add/edit/import) should be resolved before design begins. What percentage of care partners use mobile for contact management?
**Answer:** The spec states FR-002 supports a "mobile-responsive accordion layout with lazy loading." The existing Portal is responsive (Tailwind CSS v3 with responsive utilities). The edge case says "Virtual scroll and accordion layout ensure performance" for 100+ contacts. **Assumption: Mobile should support view + add/edit (not import). MAC import involves a diff modal with conflict resolution -- too complex for mobile. Recommendation: Mobile parity = full CRUD for individual contacts, read-only for MAC import (with a "continue on desktop" prompt).**

### Q4: [Scope] FR-023 requires WCAG 2.1 AA compliance for all contact interfaces. Has this been validated as achievable with the current component library?
**Answer:** The codebase uses Common components (`resources/js/Components/Common/`) which are custom-built. The existing Risk form (`resources/js/Components/Staff/Risks/RiskForm.vue`) and similar components do not have documented WCAG compliance. **Assumption: WCAG 2.1 AA is aspirational for this epic. The existing component library likely has gaps (focus management, aria labels, keyboard navigation). Recommendation: Add WCAG compliance as a non-blocking quality goal. Document known gaps during implementation and address them incrementally.**

### Q5: [UX] The role taxonomy includes 7 roles but the open question asks about expanding to Guardian, Plan Manager, and Pharmacist. This needs to be resolved before the data model is finalized, as it affects the role enum.
**Answer:** The spec lists 7 roles: Supporter Rep, Secondary Supporter, GP, Specialist, Informal Carer, Emergency Contact, Other. The open question asks about Guardian, Plan Manager, and Pharmacist. The existing codebase has `PackageContact` models and actions (`domain/Package/Actions/PackageContact/`) but the contact role model is not well-structured. **Recommendation: Design the role as a string enum (not a hardcoded PHP enum) stored in a `contact_roles` table, allowing future expansion without migration. Start with the 7 listed roles. Guardian, Plan Manager, and Pharmacist can be added as future seeds. "Other" serves as the escape valve.**

### Q6: [Data] The existing contact model uses `PackageContact` with associated services (`PackageContactService.php`). How does the CCU schema relate to the existing contact model?
**Answer:** The codebase has `domain/Package/Data/Store/StorePackageContactInformationData.php`, `app/Services/Package/PackageContactService.php`, and `domain/Package/Actions/PackageContact/` with actions for updating, granting/revoking portal access. The existing model is tied to packages. **CCU extends this existing model rather than replacing it. The existing PackageContact should gain: role(s) from the fixed taxonomy, authority level (auto-mapped from role), primary decision-maker flag, and soft-delete support. This is a schema extension, not a new entity.**

### Q7: [Integration] FR-020 requires mailto-based email with TCID tagging. What is the TCID system?
**Answer:** TCID appears to be a client identifier used for tracking communications. The codebase has no explicit "TCID" model, but packages have unique identifiers. **Assumption: TCID is the package or client reference number used in email subjects for traceability (e.g., "RE: [TCID-12345] Care Review"). The mailto link should prepopulate the subject line with this identifier. Clarify the exact format with the CMA team.**

### Q8: [Performance] FR-022 requires 100 contacts to load in under 1 second and search/filter in under 200ms. Is this achievable with the current architecture?
**Answer:** The Portal uses Inertia v2 with server-side rendering. 100 contacts is a moderate dataset. With proper eager loading (the codebase follows this pattern -- see `Risk` model with `riskCategory()`, `packages()` relationships) and client-side filtering, this is achievable. **Recommendation: Server-side pagination (15 per page per FR-001) with client-side filtering within the loaded page. Lazy load additional pages. The 200ms filter target is achievable with Vue computed properties on client-side data.**

## Refined Requirements

1. **Role storage model**: Contact roles SHOULD be stored in a separate `contact_roles` lookup table (not a hardcoded enum) to allow future expansion without migrations. The initial seed includes the 7 specified roles.
2. **Mobile scope**: Mobile devices SHOULD support full contact CRUD but MAC import/reconciliation SHOULD be restricted to desktop with a "continue on desktop" prompt on mobile.
3. **MAC API contract**: Before implementing US4, confirm with MAC technical documentation whether the "no deletes" assumption is contractually guaranteed. Add contract tests to detect schema changes.
4. **WCAG compliance**: WCAG 2.1 AA is a quality goal, not a hard gate for launch. Document gaps and address incrementally.
