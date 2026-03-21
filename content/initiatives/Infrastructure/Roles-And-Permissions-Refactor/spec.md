---
title: "Feature Specification: Roles & Permissions Refactor (RAP)"
---

> **[View Mockup](/mockups/roles-and-permissions-refactor/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TP-2403 | **Initiative**: Infrastructure

---

## Overview

TC Portal currently manages user permissions through 37 hardcoded roles defined in `config/roleList.php` using the Spatie Laravel Permission package, with 170+ permissions spread across 29 configuration files. This system suffers from role proliferation (37 roles for ~18 functional areas), no team management UI despite teams existing in the database, a role-switcher mechanism that ties dashboards to roles via `current_role_id`, and permission changes requiring code deployments.

This epic refactors the system to: reduce roles from 37 to 6-8 core organizational roles (Super Admin, Executive, Senior Management, Manager, Employee, with optional Team Leader/Member variants); introduce 15-20 hierarchical teams synced from Employment Hero; implement team-based permission management where department heads assign permission bundles to their teams; route dashboards to teams instead of roles (eliminating the role switcher); and provide a Portal-native UI for team and permission management.

The role consolidation follows a clear pattern: the current Manager/Team Member pairs (e.g., Bill Processing Manager + Bill Processing Team Member) collapse into team membership plus a permission bundle, with only 2 permissions (`bill-gst-override` and `impersonate-user`) truly requiring manager-level escalation. A shared "Finance Base" bundle of 27 universal permissions forms the baseline, with "Bill Management" and "Financial Oversight" bundles layered on top.

---

## User Scenarios & Testing

### User Story 1 - View Team Members (Priority: P1)

As a team leader, I want to view all my team members in one place so that I can see who is on my team, their roles, and their status without relying on manual spreadsheets or IT requests.

**Acceptance Scenarios**:

1. **Given** a team leader navigates to "My Teams" from main navigation, **When** they select their team, **Then** they see a list of all team members with name, email, role(s), status (active/inactive/pending), and join date
2. **Given** the team list is displayed, **When** the team leader searches by name or role, **Then** the list filters to matching members in real time
3. **Given** the team has no members yet, **When** the page loads, **Then** an empty state message is displayed with a prompt to add members
4. **Given** a team has up to 100 members, **When** the page loads, **Then** it renders in under 800ms (p95)

### User Story 2 - Add Members to Team (Priority: P1)

As a team leader, I want to add existing portal users to my team so that I can onboard new staff without submitting IT tickets and waiting 2-4 days.

**Acceptance Scenarios**:

1. **Given** a team leader clicks "Add Member" on the team detail page, **When** the modal opens, **Then** they can search for users by name or email with autocomplete responding in under 200ms
2. **Given** the team leader selects a user and assigns a role from the dropdown, **When** they click "Add to Team", **Then** the user appears in the team list immediately and receives a notification email
3. **Given** the team leader attempts to add a user who is already a member, **When** they search, **Then** the system indicates the user is already on the team and prevents duplicate addition
4. **Given** the addition completes, **When** the audit log is checked, **Then** the action is recorded with timestamp, actor, team, and user added

### User Story 3 - Remove Team Members (Priority: P1)

As a team leader, I want to remove team members when they change roles or leave so that team data stays current and access is revoked immediately.

**Acceptance Scenarios**:

1. **Given** a team leader clicks "Remove" next to a team member, **When** the confirmation dialog appears, **Then** it shows the member name, current role(s), and warns that team-specific permissions will be revoked
2. **Given** the team leader confirms removal, **When** the operation completes, **Then** the member is removed from the team list, team-specific permissions are revoked immediately, and the member receives a notification email
3. **Given** the removal completes, **When** the audit log is checked, **Then** the action is recorded with timestamp, actor, team, user removed, and permissions revoked

### User Story 4 - Assign or Change Team Roles (Priority: P1)

As a team leader, I want to assign or change roles for my team members so that their permissions match their current responsibilities without engineering intervention.

**Acceptance Scenarios**:

1. **Given** a team leader clicks "Change Role" next to a team member, **When** the role selector opens, **Then** it shows only roles the team leader is authorized to assign (no privilege escalation)
2. **Given** the team leader selects a new role and confirms, **When** the change takes effect, **Then** the member's permissions are updated immediately and the audit log records the change with before/after state
3. **Given** a team member has a role on one team, **When** they are assigned a different role on another team, **Then** both roles coexist and permissions combine correctly

### User Story 5 - View My Team Memberships (Priority: P1)

As a team member, I want to see which teams I belong to and what permissions I have so that I understand my access levels and know who my team leaders are.

**Acceptance Scenarios**:

1. **Given** a team member navigates to "My Teams" from their profile menu, **When** the page loads, **Then** they see all teams they belong to with team name, team leader, their role, and a permissions summary
2. **Given** the team member clicks on a team name, **When** the team is public, **Then** they can see the full team roster
3. **Given** the team member clicks on their role, **When** the details expand, **Then** they see the detailed list of permissions granted by that role

### User Story 6 - Bulk Offboard from All Teams (Priority: P1)

As an HR officer, I want to remove a terminated employee from all teams in one action so that access is revoked immediately without coordinating with multiple team leaders.

**Acceptance Scenarios**:

1. **Given** an HR officer searches for a user in User Management, **When** they view the user profile, **Then** all current team memberships are listed
2. **Given** the HR officer clicks "Remove from All Teams", **When** the confirmation dialog appears, **Then** it lists every team the user will be removed from
3. **Given** the HR officer confirms, **When** the bulk removal completes (within 5 seconds for up to 10 teams), **Then** all team-specific permissions are revoked, individual audit log entries are created for each removal, and a confirmation summary is shown

### User Story 7 - Create Custom Roles via UI (Priority: P2)

As an administrator, I want to create custom roles and assign permission bundles via the UI so that new job functions can be supported without code changes.

**Acceptance Scenarios**:

1. **Given** an administrator navigates to Settings > Roles & Permissions, **When** they click "Create New Role", **Then** a form allows entering role name, description, optional parent role, and selecting permissions from categorized bundles
2. **Given** the administrator assigns a "Bill Management" permission bundle, **When** they expand the bundle, **Then** they see all included permissions (create_bill, edit_bill, approve_bill, etc.) with clear descriptions
3. **Given** the role is created, **When** a team leader assigns it to a team member, **Then** the new role appears in the role selector immediately

### User Story 8 - View Audit Logs (Priority: P2)

As an administrator, I want to view a searchable audit log of all team and permission changes so that I can investigate issues, fulfill compliance requirements, and maintain a 7-year audit trail.

**Acceptance Scenarios**:

1. **Given** an administrator navigates to Audit Logs, **When** the page loads, **Then** they see all team membership changes, role assignments, and permission modifications with timestamp, actor, action, target, and before/after state
2. **Given** the administrator filters by date range, actor, or action type, **When** results load, **Then** only matching entries are displayed
3. **Given** the administrator exports logs to CSV, **When** the export completes, **Then** all filtered entries are included for compliance reporting

### User Story 9 - Accurate Team Data in Package Views (Priority: P1)

As a care coordinator, I want to see accurate team assignments on packages so that I can route questions and tasks to the right people.

**Acceptance Scenarios**:

1. **Given** a care coordinator views a package detail page, **When** the page loads, **Then** the assigned team name is displayed with a link to current team members
2. **Given** a team member was added or removed, **When** the care coordinator views the package, **Then** the team member list reflects the current membership (no stale data)
3. **Given** the care coordinator filters packages by assigned team, **When** the filter is applied, **Then** results use current team membership data

### Edge Cases

- What happens when a team leader is removed from their own team? The system prevents self-removal; only an administrator or another team leader/co-leader can remove a team leader.
- What happens when a user belongs to multiple teams with conflicting permissions? Permissions are additive -- the user receives the union of all permissions from all team roles.
- What happens during migration from 37 roles to 6-8 core roles? A feature flag `use_database_roles` toggles between config-based and database-backed roles. Existing role assignments are preserved during migration with a seed script mapping old roles to new roles + team memberships.
- What happens when Employment Hero team sync conflicts with manual Portal team changes? Portal-native changes take precedence; Employment Hero sync is additive only (does not remove manually added members).
- What happens when a team leader assigns a role with more privileges than they hold? The system prevents privilege escalation -- team leaders cannot assign roles with permissions they do not have.

---

## Functional Requirements

**Team Management (P0 - Must Have)**:

- **FR-001**: Team leaders MUST be able to view a list of their team members with name, email, role(s), status, and join date
- **FR-002**: Team leaders MUST be able to add existing portal users to their team via name/email search
- **FR-003**: Team leaders MUST be able to remove team members with confirmation dialog
- **FR-004**: Team leaders MUST be able to assign or change team-specific roles for members
- **FR-005**: System MUST show confirmation prompt before removing a team member
- **FR-006**: System MUST log all team membership changes with timestamp, actor, and action
- **FR-007**: System MUST revoke team-specific permissions immediately upon member removal

**Role Assignment (P0 - Must Have)**:

- **FR-008**: Roles MUST be assignable at team level (not just globally)
- **FR-009**: Users MUST be able to have different roles on different teams
- **FR-010**: Team-specific roles MUST inherit base role permissions plus team context
- **FR-011**: System MUST prevent privilege escalation (team leaders cannot assign higher privileges than their own)

**Team Member Experience (P0 - Must Have)**:

- **FR-012**: Users MUST be able to view which teams they belong to from their profile
- **FR-013**: Users MUST be able to see their role(s) and permissions for each team
- **FR-014**: Users MUST receive notification when added to or removed from a team

**Authorization & Security (P0 - Must Have)**:

- **FR-015**: Only team leaders and admins MUST be able to manage team membership
- **FR-016**: Team leaders MUST only be able to manage their own teams
- **FR-017**: Admins MUST be able to manage all teams
- **FR-018**: System MUST track all permission changes with actor, timestamp, and before/after state in an audit log retained for 7 years
- **FR-019**: System MUST rate-limit team membership changes to 50 per hour per team leader

**Integration with Existing Features (P0 - Must Have)**:

- **FR-020**: Package views MUST show current team assignments with accurate member lists
- **FR-021**: Bill processing inbox filters MUST use current team membership data
- **FR-022**: Task assignment MUST show current team members only
- **FR-023**: Dashboard views MUST respect team-based permissions

**Role Management (P1 - Should Have)**:

- **FR-024**: Administrators MUST be able to create custom roles via UI
- **FR-025**: Administrators MUST be able to define permission bundles for roles
- **FR-026**: Administrators MUST be able to deprecate or archive unused roles
- **FR-027**: System MUST show which users have which roles (role audit view)

**Bulk Operations (P1 - Should Have)**:

- **FR-028**: HR officers MUST be able to bulk-remove a user from all teams (offboarding)
- **FR-029**: HR officers MUST be able to bulk-add a user to multiple teams (onboarding)
- **FR-030**: Administrators MUST be able to bulk-assign permissions to roles

**Team Settings (P1 - Should Have)**:

- **FR-031**: Team leaders MUST be able to edit team name and description
- **FR-032**: Team leaders MUST be able to designate co-leaders or deputies

**Dashboard Routing (P1 - Should Have)**:

- **FR-033**: Dashboards MUST link to teams instead of roles
- **FR-034**: System MUST eliminate the role-switcher mechanism by deriving dashboard from team membership

---

## Key Entities

- **Role**: An organizational role (reduced from 37 to 6-8). Has name, description, parent role (for inheritance), is_team_specific flag, and is_active status. Mapped from current Spatie `roles` table. Core roles: Super Admin, Executive, Senior Management, Manager, Employee, Team Leader, Team Member.
- **Team**: A hierarchical organizational unit (15-20 total). Has name, description, visibility (public/private), and parent team (department > sub-team). Departments carry permissions; sub-teams (PODs) scope data and determine dashboards. Examples: Care Department > POD 1, POD 2; Finance > Bill Processing, Accounts Receivable.
- **Team Membership** (`team_user` pivot): Links a user to a team with a team-specific role, leader flag, status (active/inactive/pending), and join date. A user can belong to up to 10 teams simultaneously.
- **Permission Bundle**: A named group of related permissions (e.g., "Finance Base" = 27 shared permissions, "Bill Management" = create/edit/approve/delete bills, "Financial Oversight" = MYOB adjustments + impersonation). Assigned to roles, not individual users.
- **Audit Log**: An immutable record of permission, role, or team changes. Stores auditable type/ID, actor, action, old/new values as JSON, IP address, and timestamp. Retained for 7 years per compliance requirements.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Team membership updates self-serviced by team leaders for 80%+ of changes (vs. 0% today)
- **SC-002**: Time to add/remove a team member reduced from 2-4 days (IT ticket) to under 5 minutes (self-service)
- **SC-003**: Team management support tickets reduced from ~40/month to fewer than 12/month within 3 months post-launch
- **SC-004**: Team data accuracy improved from ~80% to 95%+ within 1 month post-launch
- **SC-005**: Permission-related errors reduced from ~15/month to fewer than 5/month within 2 months post-launch
- **SC-006**: Roles consolidated from 37 to 6-8 core roles
- **SC-007**: All permission changes audited with 7-year retention for compliance
- **SC-008**: Team list page loads in under 800ms (p95) for teams up to 100 members
- **SC-009**: Permission checks resolve in under 50ms via Redis caching

---

## Assumptions

- Team management will be built natively in Portal (not via third-party integration), as decided in the Nov 10, 2025 meeting
- Team leaders are appropriate owners for membership management within their teams
- Employment Hero "teams" field can be used as the source for initial team seeding (15-20 teams)
- The existing Spatie Laravel Permission package (v6+) will continue to be used, migrating from config-based to database-backed roles
- Existing Laravel Jetstream `teams` and `team_user` tables can be extended rather than replaced
- Coordinator/Supplier organization refactor is explicitly deferred (different use case, too complex)
- WorkOS is used for authentication (SSO) only; authorization remains Portal-native
- Dashboard routing can be decoupled from roles and linked to teams in a phased approach

---

## Dependencies

- **Spatie Laravel Permission (v6+)**: Core permission system, already installed. Migration from config to database-backed roles required.
- **Laravel Jetstream Teams**: Existing `teams` and `team_user` tables to be extended with role_id, is_leader, and status columns.
- **Employment Hero**: Source of team hierarchy data for initial seeding and ongoing sync.
- **Existing Features**: Package views, bill processing inbox, task assignment, and dashboards all depend on team data and must be updated to use the new `team_user` table.
- **Redis**: Required for permission caching (1-hour TTL) to maintain sub-50ms authorization checks.
- **Laravel Horizon**: Required for background job processing (audit log creation, notification emails, bulk operations).
- **Design Team**: UI mockups needed for team management interface, role assignment, and audit log views before Phase 2.
- **Teams Management Epic (TMG)**: Shares foundational team CRUD infrastructure. RAP focuses on permissions and role assignment; TMG focuses on team creation, hierarchy, and organizational structure.

---

## Out of Scope

- Mobile app team management (web only for MVP)
- Third-party HRIS integration beyond Employment Hero initial sync
- Coordinator/Supplier organization refactor (explicitly deferred per Nov 10, 2025 meeting)
- Recipient roles refactoring (authority relationships handle package-level permissions)
- Data scoping by team (e.g., restricting Care Partners from seeing all 16,000 records) -- deferred to later phase
- WorkOS organizations (not cost-effective at $125/org for SSO)
- External stakeholder team management (build internal first)
- Team-based kanban boards (separate epic, this lays the foundation)
- Team chat/messaging (not replacing Slack/Teams)
- Field-level permissions (role-based only for MVP)
- Time-based role expiration (P2 feature)
- Team hierarchies beyond department > sub-team (flat sub-teams only for MVP)
- Role approval workflows (trust-based model for MVP)

## Clarification Outcomes

### Q1: [Dependency] Can RAP ship without TMG? What is the delivery order?
**Answer:** RAP and TMG share the same foundational infrastructure (teams table, team_user pivot) but have different scopes. TMG delivers team CRUD UI; RAP delivers role consolidation and permission bundles. **TMG is a prerequisite for RAP's team-based features** (FR-020 through FR-023). However, RAP Phase 1 (role consolidation from 37 to 6-8, permission bundles) can proceed without TMG. **Delivery order: TMG Phase 1 (team list, detail, add/remove members) -> RAP Phase 1 (role consolidation, permission bundles) -> TMG Phase 2 (EH sync) -> RAP Phase 2 (dashboard routing).**

### Q2: [Scope] What is the migration plan for existing users (37 to 6-8 roles)?
**Answer:** The edge cases section describes: "A feature flag `use_database_roles` toggles between config-based and database-backed roles. Existing role assignments are preserved during migration with a seed script mapping old roles to new roles + team memberships." **The migration should be automatic via a seeder script.** The spec notes that Manager/Team Member pairs collapse into team membership + permission bundle, with only 2 permissions truly requiring escalation. **The mapping: 37 config-based roles -> seeder creates 6-8 database roles -> seeder maps each user's current role(s) to new role + team membership. No manual reassignment needed.**

### Q3: [Data] What is the migration path for the `current_role_id` role-switching mechanism?
**Answer:** The codebase confirms `current_role_id` on the User model at `domain/User/Models/User.php` (5 files reference it). This field determines which dashboard a user sees. **FR-033/FR-034 replace role-based dashboard routing with team-based routing.** The migration path: (a) Phase 1: Keep `current_role_id` but also compute dashboard from team membership, (b) Phase 2: Remove `current_role_id` when all dashboards are team-routed, (c) Feature flag `team-based-dashboard` to toggle between old and new routing. **Users who currently switch roles to see different dashboards would instead be members of multiple teams**, with a team switcher replacing the role switcher.

### Q4: [Edge Case] What happens for users on 20+ teams? Is there a practical limit?
**Answer:** The spec states "A user can belong to up to 10 teams simultaneously" (Team Membership entity description). **10 teams is the designed limit.** US6 specifies "within 5 seconds for up to 10 teams." If a user is on 10 teams, bulk offboarding removes 10 team_user records -- a trivial database operation well within 5 seconds. **The 10-team limit should be enforced at the application level** with a clear error message if a team leader attempts to add a user who has reached the limit.

### Q5: [Integration] What is the Employment Hero sync mechanism?
**Answer:** No Employment Hero integration exists in the codebase (grep found no results). The TMG spec (US7) defines the sync requirements. **The sync mechanism is TBD** -- Employment Hero offers a REST API. **The expected flow:** Scheduled job (daily or weekly) calls the Employment Hero API to fetch team structure, compares with Portal teams, creates new teams, and flags conflicts. Manual overrides in Portal take precedence (EH sync is additive only, per the edge cases). **EH sync is a P2 feature in TMG**, not blocking for RAP Phase 1.

### Q6: [Performance] Can permission checks achieve sub-50ms with Redis caching?
**Answer:** FR-SC-009 targets "Permission checks resolve in under 50ms via Redis caching." The existing Spatie Laravel Permission package supports caching. **With Redis caching and a 1-hour TTL, permission lookups would be sub-5ms for cached values.** Cache invalidation must happen when: (a) a user's role changes, (b) a role's permissions change, (c) a user is added/removed from a team. **The cache key should be per-user** (`permissions:user:{id}`) with wildcard flush on role/team changes.

## Refined Requirements

1. **Create the role mapping seeder script** as one of the first deliverables -- this validates the 37-to-6-8 consolidation is feasible before building UI.
2. **Enforce the 10-team-per-user limit** at the application level with a clear error message.
3. **Use a feature flag `team-based-dashboard`** to toggle between role-based and team-based dashboard routing during migration.
4. **Permission cache key should be per-user** with wildcard flush on role/team membership changes.
5. **Employment Hero sync is P2** -- do not block RAP Phase 1 on EH integration. Manual team management is sufficient for launch.
