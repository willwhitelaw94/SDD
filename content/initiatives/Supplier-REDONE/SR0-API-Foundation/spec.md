---
title: "Feature Specification: API Foundation & Two-Tier Auth"
---

# Feature Specification: API Foundation & Two-Tier Auth

**Feature Branch**: `sr0-api-foundation`
**Created**: 2026-03-19
**Status**: Draft
**Input**: User description: "Build the API v2 infrastructure and two-tier authentication model for the supplier portal rebuild"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - API Versioning & Response Structure (Priority: P1)

The API provides a versioned endpoint structure (`/api/v2/`) with consistent JSON responses across all supplier-related resources. Every endpoint follows the same envelope format — data, pagination, and error structure — so that frontend developers and future mobile apps can rely on a predictable contract.

**Why this priority**: This is the foundational contract that every other epic builds on. Without a consistent API structure, each feature team would invent their own response format, creating integration chaos.

**Independent Test**: Can be fully tested by making requests to any v2 endpoint and verifying the response follows the standard envelope format, including error responses.

**Acceptance Scenarios**:

1. **Given** any authenticated request to a v2 endpoint, **When** the request succeeds, **Then** the response is a JSON object with a `data` key containing the resource(s), and pagination metadata where applicable.
2. **Given** any request to a v2 endpoint that fails validation, **When** the response is returned, **Then** it includes a consistent error format with error code, human-readable message, and field-level validation details.
3. **Given** a request to a non-existent v2 endpoint, **When** the response is returned, **Then** it uses the same error format (not an HTML error page or framework default).
4. **Given** the v1 API still exists, **When** v2 endpoints are deployed, **Then** v1 continues to function without changes — both versions coexist.

**Out of scope**: Registration, ABN lookup, onboarding — these belong to SR1.

---

### User Story 2 - Two-Tier Role Hierarchy (Priority: P1)

The system enforces a two-tier role hierarchy: Organisation Administrator (cross-supplier access under one ABN) and Supplier-level roles (Supplier Administrator, Supplier, Team Member) scoped to a single supplier entity. Every API request is authorised based on the user's role and their active supplier context. This role model is the foundation that SR1 (Registration), SR2 (Profiles), and all other epics rely on.

**Why this priority**: Without a clear role hierarchy, every feature would need to implement its own access control logic. This must be locked down before any feature work begins.

**Independent Test**: Can be tested by assigning different roles and verifying that each role can only access the endpoints and data appropriate to their level.

**Acceptance Scenarios**:

1. **Given** a user with the Organisation Administrator role, **When** they make API requests, **Then** they can access data for all supplier entities under their organisation.
2. **Given** a user with the Supplier Administrator role for Supplier A, **When** they attempt to access Supplier B's data, **Then** the request is rejected with a 403 Forbidden response.
3. **Given** a user with the Team Member role, **When** they attempt to perform administrative actions (invite users, change settings), **Then** the request is rejected.
4. **Given** the role hierarchy, **When** permissions are checked, **Then** Organisation Administrator > Supplier Administrator > Supplier > Team Member, and higher roles inherit lower-role permissions within their scope.

**Out of scope**: Creating organisations or supplier entities (SR1), managing profiles (SR2).

---

### User Story 3 - Supplier User Authenticates via Token (Priority: P1)

Any supplier user (Organisation Administrator, Supplier Administrator, or team member) can log in and receive an authentication token that works across web and mobile. The token carries their role and active supplier context, so every request is properly scoped.

**Why this priority**: Token-based auth is the technical prerequisite for mobile support and the standalone frontend. Without it, the new portal cannot function independently from the Laravel session.

**Independent Test**: Can be tested by logging in via the authentication endpoint and using the returned token to make an authenticated request to any supplier endpoint.

**Acceptance Scenarios**:

1. **Given** a registered supplier user, **When** they authenticate with valid credentials, **Then** they receive an access token and refresh token, and the response includes their role and active supplier context.
2. **Given** a user with an expired access token, **When** they submit the refresh token, **Then** a new access token is issued without requiring re-authentication.
3. **Given** a user with a revoked refresh token, **When** they attempt to use it, **Then** the request is rejected and they must re-authenticate.
4. **Given** an Organisation Administrator with multiple suppliers, **When** they authenticate, **Then** the response includes a list of all supplier entities they can access and their default (most recently used) supplier context.

---

### User Story 4 - Supplier User Switches Active Supplier Context (Priority: P2)

An Organisation Administrator or a user with access to multiple supplier entities can switch between them without logging out. The active supplier context changes what data they see — bills, locations, pricing, documents — all scoped to the selected supplier.

**Why this priority**: Enables the multi-supplier workflow that is the primary driver for the two-tier model. Depends on auth (Story 3) being in place.

**Independent Test**: Can be tested by switching supplier context and verifying that subsequent data requests return data scoped to the newly selected supplier.

**Acceptance Scenarios**:

1. **Given** a user with access to two supplier entities, **When** they switch from Supplier A to Supplier B, **Then** all subsequent data requests return Supplier B's data (bank details, locations, pricing, documents, bills).
2. **Given** a user switching supplier context, **When** the switch completes, **Then** the system remembers this preference and uses it as the default on next login.
3. **Given** a Supplier Administrator with access to only one supplier, **When** they view the portal, **Then** no context switcher is shown — they are always scoped to their single supplier.
4. **Given** a user switching context while viewing a supplier-specific page, **When** the switch completes, **Then** the page refreshes to show data for the new supplier context.

---

### User Story 5 - Organisation Administrator Invites Users at Organisation or Supplier Level (Priority: P2)

An Organisation Administrator can invite new users to join at either the organisation level (access to all suppliers) or at a specific supplier level (access to only that supplier). A Supplier Administrator can only invite users to their own supplier entity.

**Why this priority**: Decouples the invite system from the flat model, enabling proper role-based access. Depends on the two-tier role model (Stories 1-3).

**Independent Test**: Can be tested by sending an invite at both org level and supplier level, then verifying the invited user has the correct scope of access.

**Acceptance Scenarios**:

1. **Given** an Organisation Administrator, **When** they invite a user at the organisation level, **Then** the invited user gains access to all current and future supplier entities under that organisation.
2. **Given** an Organisation Administrator, **When** they invite a user at a specific supplier level, **Then** the invited user only has access to that single supplier entity.
3. **Given** a Supplier Administrator, **When** they attempt to invite a user, **Then** the invite is scoped to their supplier entity only — they cannot grant organisation-level access.
4. **Given** an invited user who accepts the invitation, **When** they log in, **Then** they see only the supplier entities they have been granted access to.
5. **Given** an Organisation Administrator, **When** they view team members across their organisation, **Then** they see which users have org-level access vs supplier-level access, and which supplier entities each user can access.

---

### User Story 6 - External Application Accesses Supplier Data via API (Priority: P3)

A third-party application or mobile app can access supplier data through a documented, versioned API. The API uses standard JSON responses, is versioned (`/api/v2/`), and includes machine-readable documentation so developers can integrate without manual onboarding.

**Why this priority**: Enables future mobile apps and third-party integrations. The API structure must be right from the start but actual external consumers come later.

**Independent Test**: Can be tested by fetching the API documentation endpoint and making a sample authenticated request that returns properly structured JSON.

**Acceptance Scenarios**:

1. **Given** a developer with valid API credentials, **When** they access the API documentation endpoint, **Then** they receive a complete, machine-readable specification of all available endpoints, request formats, and response schemas.
2. **Given** an authenticated API request to any supplier endpoint, **When** the request is valid, **Then** the response is a JSON object with consistent structure (data envelope, pagination metadata where applicable, and standardised error format).
3. **Given** an API request that exceeds the rate limit, **When** the limit is hit, **Then** the response includes a clear error with rate limit headers (remaining requests, reset time) and a 429 status code.
4. **Given** an API request from an allowed origin, **When** a cross-origin request is made, **Then** proper CORS headers are returned allowing the standalone frontend to communicate with the API.

---

### Edge Cases

- What happens when an Organisation Administrator is removed or deactivated? Their org-level access is revoked, but existing Supplier Administrators retain their supplier-level access. The system must have at least one Organisation Administrator per organisation.
- What happens when a supplier entity has no active workers? The entity remains accessible to Organisation Administrators but supplier-level users cannot access it until they are linked as active workers.
- What happens when the same email address is used for both a care provider account and a supplier account? The system must support dual-role users — a single login that can switch between care provider and supplier contexts.
- Can a user belong to multiple organisations? **No** — one user account is tied to a single organisation (ABN). If someone works across two ABNs, they need two separate accounts with different email addresses. This matches the current model and keeps the context switcher scoped to suppliers within one org only.
- Can a user be logged into both the old portal and the new portal simultaneously? **Yes** — during migration, a user can have an active Inertia session (old portal) AND valid API tokens (new portal) at the same time. Both auth mechanisms are independently valid. This is essential for gradual migration without a big-bang cutover.
- How does the system handle an ABN that changes ownership? This is an edge case requiring manual intervention by TC staff — the system should flag it but not auto-resolve.
- What happens when API tokens are compromised? An Organisation Administrator or TC staff can revoke all tokens for a user, forcing re-authentication.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support token-based authentication that works without cookies or server-side sessions, enabling both web and mobile access.
- **FR-002**: System MUST issue access tokens (1-hour expiry) and refresh tokens (30-day expiry) on successful authentication. The frontend handles transparent refresh before expiry.
- **FR-003**: System MUST support a two-tier role hierarchy: Organisation Administrator (cross-supplier access under one ABN) and Supplier Administrator / Supplier / Team Member (scoped to a single supplier entity).
- **FR-004**: System MUST enforce role-based access control at the API middleware level — every request is checked against the user's role and active supplier context before reaching the endpoint handler.
- **FR-005**: System MUST allow users with access to multiple supplier entities to switch their active supplier context without re-authenticating.
- **FR-006**: System MUST scope all supplier data (bank details, locations, pricing, documents, bills, agreements, workers) to the active supplier context.
- **FR-007**: System MUST support invitations at two levels: organisation-level (access to all suppliers) and supplier-level (access to one supplier).
- **FR-008**: System MUST prevent Supplier Administrators from granting organisation-level access — only Organisation Administrators can do this.
- **FR-009**: System MUST provide a versioned API (`/v2/`) with consistent JSON response structure across all endpoints.
- **FR-010**: System MUST include machine-readable API documentation that is automatically kept in sync with the actual endpoints.
- **FR-011**: System MUST enforce rate limiting at 60 requests per minute per authenticated user. Bulk operations (e.g., uploading pricing for multiple locations) MUST be handled via single batch endpoints rather than individual calls. Rate limit responses include `X-RateLimit-Remaining` and `Retry-After` headers.
- **FR-012**: System MUST support cross-origin requests from the standalone frontend via properly configured CORS.
- **FR-013**: System MUST return standardised error responses with consistent format (error code, human-readable message, field-level validation details where applicable).
- **FR-014**: System MUST support token revocation — allowing Organisation Administrators or TC staff to invalidate all tokens for a specific user.
- **FR-015**: System MUST require at least one Organisation Administrator per organisation at all times — the last Organisation Administrator cannot be downgraded or removed without transferring the role.
- **FR-016**: System MUST remember the user's most recently used supplier context and restore it on subsequent logins.
- **FR-017**: WorkOS SSO integration is **out of scope** for SR0. The initial auth flow will use email/password credentials with token issuance. SSO can be layered in later as an alternative authentication method.

### Key Entities

- **Organisation**: The top-level entity representing a business registered with an ABN. Contains legal trading name, ABN, GST status, and verification stage. One organisation can have many supplier entities.
- **Supplier Entity**: A distinct operational unit under an organisation — may represent a trading name, location, or service line. Owns its own bank details, locations, pricing, documents, agreements, and workers. Scoped independently for billing and compliance.
- **Organisation Administrator**: A user role with cross-supplier visibility. Can manage all supplier entities under their organisation, invite users at both levels, and view aggregated organisation data.
- **Supplier Administrator**: A user role scoped to a single supplier entity. Can manage that supplier's data and invite users to that supplier only.
- **Authentication Token**: A short-lived access token used for API requests, paired with a long-lived refresh token for renewal. Carries user identity, role, and active supplier context.
- **Invitation**: A request to join an organisation or specific supplier entity. Specifies the access level (org-wide or supplier-scoped) and the role to be assigned.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All supplier portal features can be accessed via the API without any dependency on server-side sessions or cookies.
- **SC-002**: An Organisation Administrator can add a new supplier entity under their ABN in under 2 minutes.
- **SC-003**: Switching between supplier entities takes less than 1 second from user action to complete page update.
- **SC-004**: 100% of API endpoints return consistent JSON structure with proper error codes and validation messages.
- **SC-005**: External developers can discover and understand the full API surface via the auto-generated documentation without manual support.
- **SC-006**: The API supports at least 500 concurrent authenticated users without degradation.
- **SC-007**: Token refresh works seamlessly — users are never forced to re-login during an active session (access tokens refresh transparently).
- **SC-008**: Existing supplier users can authenticate through the new token-based system using their current credentials — no password reset required.
- **SC-009**: Invitations correctly scope access — 100% of supplier-level invites restrict the user to only that supplier's data.
- **SC-010**: Zero instances of data leakage between supplier entities — a user scoped to Supplier A cannot access Supplier B's data through any endpoint.

## Clarifications

### Session 2026-03-19
- Q: Where does SR0's responsibility end and SR1's begin? -> A: SR0 owns only auth infrastructure — token issuance, role model, context switching, invite framework, API skeleton. Registration (ABN lookup, org/supplier creation, onboarding) moves entirely to SR1.
- Q: What should token lifetimes be? -> A: Access tokens 1 hour, refresh tokens 30 days. Frontend handles transparent refresh before expiry.
- Q: How should WorkOS SSO work with new token-based auth? -> A: WorkOS is out of scope for SR0. Initial auth uses email/password with token issuance. SSO layered in later.
- Q: Can a single user belong to multiple organisations? -> A: No — one user, one organisation (ABN). Two ABNs = two accounts. Keeps context switcher scoped to suppliers within one org.
- Q: Can a user be logged into both old and new portals simultaneously? -> A: Yes — dual sessions allowed. Inertia sessions and API tokens are independently valid. Essential for gradual migration.
- Q: What rate limit strategy? -> A: 60 requests/minute per user. Bulk operations via batch endpoints, not individual calls.
