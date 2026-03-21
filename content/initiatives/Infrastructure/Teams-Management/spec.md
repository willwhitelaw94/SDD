---
title: "Feature Specification: Teams Management (TMG)"
---

> **[View Mockup](/mockups/teams-management/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: TMG | **Initiative**: Infrastructure

---

## Overview

TC Portal has a `teams` table (via Laravel Jetstream) with team-to-user relationships (`team_user` pivot) and team-to-package relationships (`package_team` pivot), but there is no user-facing UI for managing teams. Teams are defined with Pod constants (Pod E1, E2, P1-P5), each team has a `teamLeader` relationship, and teams are linked to packages. However, all team management is done through direct database manipulation, team membership is frequently stale, and there is no visibility into team structure for staff.

This epic delivers the team management UI and team lifecycle features that the [Roles & Permissions Refactor (RAP)](/initiatives/infrastructure/roles-and-permissions-refactor) depends on. While RAP focuses on the permission model (role simplification, permission bundles, dashboard routing), TMG focuses specifically on the team CRUD operations, membership management UI, team hierarchy visualization, and Employment Hero sync that provide the foundational team infrastructure. TMG is a prerequisite for RAP's team-based permission assignment to function.

---

## User Scenarios & Testing

### User Story 1 - View Team List (Priority: P1)

As a staff member, I want to see a list of all teams in the organization so that I can understand the team structure and find my team.

**Why this priority**: Team visibility is foundational. Without knowing what teams exist, no other team management function is useful.

**Independent Test**: Can be fully tested by navigating to the Teams page and verifying all teams from the database are displayed with correct details.

**Acceptance Scenarios**:

1. **Given** a staff member navigates to the Teams page, **When** the page loads, **Then** they see a list of all teams with team name, team leader, member count, and associated packages count
2. **Given** the team list is displayed, **When** the staff member searches by team name, **Then** the list filters to matching teams in real-time
3. **Given** teams have a hierarchical structure (Departments > PODs), **When** the list is displayed, **Then** the hierarchy is visually indicated (e.g., indentation or grouping under department headers)
4. **Given** the organization has 15-20 teams, **When** the page loads, **Then** it renders in under 500ms

### User Story 2 - View Team Detail (Priority: P1)

As a team leader, I want to view my team's detail page showing all members, their roles, and linked packages so that I have full visibility into my team's composition and responsibilities.

**Why this priority**: The team detail page is the hub for all team management operations. It must be in place before add/remove/edit member workflows.

**Independent Test**: Can be tested by navigating to a specific team and verifying member list, package associations, and team metadata are accurate.

**Acceptance Scenarios**:

1. **Given** a user navigates to a team detail page, **When** the page loads, **Then** they see team name, description, team leader, and a table of team members with name, email, role, status (active/inactive), and join date
2. **Given** the team has linked packages, **When** the team detail page loads, **Then** a packages section shows the count and list of packages assigned to this team via the `package_team` pivot
3. **Given** the team has up to 50 members, **When** the member table loads, **Then** it supports sorting by name, role, and join date, and searching by name or email

### User Story 3 - Add Member to Team (Priority: P1)

As a team leader, I want to add existing portal users to my team so that new hires or transferred staff can be onboarded to the team without an IT ticket.

**Why this priority**: Self-service team membership is the core value proposition. It eliminates the 2-4 day IT ticket cycle.

**Independent Test**: Can be tested by clicking "Add Member", searching for a user, adding them, and verifying they appear in the team member list.

**Acceptance Scenarios**:

1. **Given** a team leader clicks "Add Member" on their team detail page, **When** the modal opens, **Then** they can search for portal users by name or email with autocomplete
2. **Given** a user is selected, **When** the team leader confirms the addition, **Then** the user appears in the team member list, a `team_user` record is created, and the change is audit-logged
3. **Given** the user is already on the team, **When** the team leader searches for them, **Then** the system indicates existing membership and prevents duplicate addition
4. **Given** a user is added to a team, **When** the operation completes, **Then** an in-app notification is sent to the added user

### User Story 4 - Remove Member from Team (Priority: P1)

As a team leader, I want to remove team members when they transfer to another team or leave the organization so that the team roster stays accurate.

**Why this priority**: Stale team data undermines trust in the system. Prompt removal is essential for data integrity across packages, tasks, and workflows.

**Independent Test**: Can be tested by removing a member from a team and verifying they no longer appear in the member list or in team-filtered views.

**Acceptance Scenarios**:

1. **Given** a team leader clicks "Remove" next to a team member, **When** the confirmation dialog appears, **Then** it shows the member's name, any packages they are associated with via this team, and a warning about implications
2. **Given** the team leader confirms the removal, **When** the operation completes, **Then** the `team_user` record is deleted, the member no longer appears in the team list, and the change is audit-logged
3. **Given** a team leader attempts to remove themselves, **When** the action is attempted, **Then** the system blocks it with a message requiring a new team leader to be designated first

### User Story 5 - Edit Team Details (Priority: P2)

As a team leader, I want to edit my team's name and description so that the team information stays current as the team's focus evolves.

**Why this priority**: Team metadata changes less frequently than membership. Important but not blocking for initial launch.

**Independent Test**: Can be tested by editing a team name and verifying it updates across all views including package associations.

**Acceptance Scenarios**:

1. **Given** a team leader clicks "Edit" on the team detail page, **When** the edit form opens, **Then** they can modify the team name and description
2. **Given** the team leader saves changes, **When** the save completes, **Then** the updated name appears across all views (team list, package views, user profiles) and the change is audit-logged
3. **Given** a team name conflicts with an existing team, **When** the save is attempted, **Then** the system validates uniqueness and shows an error

### User Story 6 - Designate Team Leader (Priority: P2)

As an administrator, I want to designate or change the team leader so that team management authority is properly assigned.

**Why this priority**: Team leader changes are less frequent than membership changes but are critical for maintaining proper authorization.

**Independent Test**: Can be tested by changing a team's leader and verifying the new leader gains management capabilities while the previous leader loses them.

**Acceptance Scenarios**:

1. **Given** an administrator views a team detail page, **When** they click "Change Team Leader", **Then** they can select any current team member as the new leader
2. **Given** the leader is changed, **When** the change takes effect, **Then** the new leader can add/remove members and the previous leader retains membership but loses management capability
3. **Given** the team has no other members besides the current leader, **When** a leader change is attempted, **Then** the system requires adding a new member first

### User Story 7 - Sync Teams from Employment Hero (Priority: P2)

As an administrator, I want teams to be synced from Employment Hero so that the organizational structure in Portal matches the HR system without manual duplication.

**Why this priority**: Employment Hero is the source of truth for team structure. Manual team creation would diverge over time.

**Independent Test**: Can be tested by triggering a sync and verifying that Employment Hero team data creates or updates corresponding Portal teams.

**Acceptance Scenarios**:

1. **Given** an administrator triggers a team sync (or it runs on schedule), **When** new teams exist in Employment Hero that are not in Portal, **Then** they are created in Portal with the Employment Hero team name and structure
2. **Given** a team membership has changed in Employment Hero, **When** the sync runs, **Then** the Portal team membership is updated to match, with manual overrides preserved and conflicts flagged for review
3. **Given** the sync encounters an error for a specific team, **When** the sync completes, **Then** successfully synced teams are updated and failures are logged with actionable error messages

### Edge Cases

- What happens when a team is deleted from Employment Hero but still has active packages in Portal? The team is marked as "archived" rather than deleted, and packages remain associated until manually reassigned.
- What happens when a user belongs to multiple teams and is removed from one? Only that team's membership is affected; other team memberships and their associated permissions remain intact.
- What happens when a team has no leader? The system requires an administrator to designate a leader. Team management operations (add/remove members) are blocked until a leader is assigned.
- What happens when Employment Hero sync creates a duplicate of a manually created team? The system matches on team name (case-insensitive). If an exact match exists, the existing team is linked to the Employment Hero record. If no match, a new team is created and an admin is notified of the potential duplicate.
- What happens when a team member is associated with packages via `package_team` and is removed from the team? The member's removal does not automatically change package assignments. A warning is shown listing affected packages, and package reassignment is handled separately.

---

## Functional Requirements

**Team Visibility (P0 - MVP)**:

- **FR-001**: Staff MUST be able to view a list of all teams with name, leader, member count, and package count
- **FR-002**: Staff MUST be able to search and filter the team list by name
- **FR-003**: Team detail pages MUST display all team members with name, email, role, status, and join date
- **FR-004**: Team detail pages MUST show associated packages via the `package_team` pivot

**Team Membership Management (P0 - MVP)**:

- **FR-005**: Team leaders MUST be able to add existing portal users to their team
- **FR-006**: Team leaders MUST be able to remove members from their team with confirmation
- **FR-007**: System MUST prevent team leaders from removing themselves without designating a replacement
- **FR-008**: System MUST prevent duplicate team membership (one user per team)
- **FR-009**: All membership changes MUST be recorded in the audit log with timestamp, actor, and action

**Team Lifecycle (P1)**:

- **FR-010**: Administrators MUST be able to create new teams with name, description, and designated leader
- **FR-011**: Team leaders MUST be able to edit team name and description
- **FR-012**: Administrators MUST be able to archive teams (soft delete, preserving history)
- **FR-013**: Administrators MUST be able to designate or change team leaders

**Employment Hero Sync (P1)**:

- **FR-014**: System MUST support scheduled sync of team structure from Employment Hero
- **FR-015**: Sync MUST create new teams, update existing teams, and flag conflicts with manual overrides
- **FR-016**: Sync failures MUST be logged with actionable error messages and not affect successfully synced teams

**Notifications (P1)**:

- **FR-017**: Users MUST receive an in-app notification when added to or removed from a team
- **FR-018**: Administrators MUST be notified of Employment Hero sync conflicts requiring resolution

---

## Key Entities

- **Team**: An organizational unit with name, description, visibility, and a designated team leader. Existing model at `domain/Team/Models/Team.php`. Has `belongsToMany(User)` via `team_user` and `belongsToMany(Package)` via `package_team`. Pod constants define current teams: Pod E1, E2, P1-P5. Hierarchical: departments (top-level) and sub-teams (PODs).
- **Team Membership** (`team_user` pivot): Links a user to a team. Existing table. To be extended with `role_id`, `is_leader`, `status` (active/inactive/pending), and `joined_at` fields as part of RAP integration.
- **Team Leader**: A user designated as the manager of a team via `belongsTo(User)` as `teamLeader`. Has authority to add/remove members and edit team details.
- **Package Association** (`package_team` pivot): Links packages to teams, determining which team is responsible for a given care package. Existing relationship.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Team membership management self-serviced by team leaders for 80%+ of changes within 3 months of launch
- **SC-002**: Time to update team membership reduced from 2-4 days (IT ticket) to under 5 minutes (self-service)
- **SC-003**: Team data accuracy improved to 95%+ (measured by Employment Hero sync match rate) within 1 month of launch
- **SC-004**: Team-related support tickets reduced by 60% within 3 months of launch
- **SC-005**: All teams in Portal match Employment Hero structure after initial sync (100% coverage)
- **SC-006**: Team list and detail pages load in under 500ms (p95)

---

## Assumptions

- The existing `teams` and `team_user` tables from Laravel Jetstream provide a suitable foundation that can be extended
- The existing `Team` model at `domain/Team/Models/Team.php` with Pod constants represents the current team structure accurately
- Employment Hero's "teams" field provides the canonical organizational structure (15-20 teams)
- Team leaders are willing and able to manage their team membership through a self-service UI
- The `package_team` pivot relationships will remain valid as team structure evolves
- Team management UI can be built using existing Portal design system components (DataTable, Modal, SearchInput, Badge)

---

## Dependencies

- **Roles & Permissions Refactor (RAP)**: TMG provides the team infrastructure that RAP extends with permission bundles and role assignment. TMG is a prerequisite for RAP's team-based features. See [RAP spec](/initiatives/infrastructure/roles-and-permissions-refactor/spec)
- **Employment Hero Integration**: Source of team hierarchy data for sync. API access required for automated sync.
- **Existing team infrastructure**: `teams` table, `team_user` pivot, `package_team` pivot, `Team` model
- **Package domain**: Package views consume team data for display and filtering
- **Design team**: UI mockups for team list, team detail, add/remove member flows
- **Email Templates & Notifications (ETN)**: Team-related notifications depend on notification infrastructure

---

## Out of Scope

- Permission assignment to teams or team members (handled by RAP epic)
- Dashboard routing based on team membership (handled by RAP epic)
- Role simplification from 37 to 6-8 roles (handled by RAP epic)
- Team-based data scoping (e.g., POD members only see their POD's packages) -- deferred to future phase
- Team performance metrics or productivity dashboards
- Team chat or messaging
- Team calendar or availability management
- Cross-team collaboration tools
- Mobile app team management
- HRIS integrations beyond Employment Hero
- Team-based kanban boards (separate epic)
- Automated team membership suggestions based on work patterns

## Clarification Outcomes

### Q1: [Dependency] What is the minimum TMG scope required to unblock RAP?
**Answer:** RAP needs: (a) Team list view (US1), (b) Team detail view (US2), (c) Add member to team (US3), (d) Remove member from team (US4). These are the P0 "Team Membership Management" requirements (FR-005 through FR-009). **RAP does NOT need:** Team creation (US5 edit, FR-010 create), Employment Hero sync (US7), or team leader designation (US6). **Minimum viable TMG for RAP:** US1 + US2 + US3 + US4 = team visibility and membership CRUD. Team creation can use a seeder script initially.

### Q2: [Scope] Is Employment Hero sync in scope for initial release?
**Answer:** US7 covers EH sync at P2 priority. FR-014/FR-015/FR-016 define sync requirements. **EH sync is NOT required for initial release.** The initial team structure can be seeded from Employment Hero data via a one-time import script, with manual updates via the TMG UI. Automated ongoing sync is a fast-follow. This is confirmed by the codebase having no Employment Hero integration currently.

### Q3: [Data] Can new teams have arbitrary names? Is the Pod concept being retired?
**Answer:** The Team model at `domain/Team/Models/Team.php` has Pod constants (E1, E2, P1-P5). The spec mentions 15-20 teams with a hierarchical structure (Departments > PODs). **Pod constants should be deprecated in favor of database-driven team names.** New teams should have arbitrary names. The migration path: (a) Create database records for existing Pod constants, (b) Update all references to use database IDs instead of constants, (c) Deprecate Pod constants. **Teams can be named anything** -- "Care Team Alpha", "Finance Processing", etc.

### Q4: [Edge Case] What are the implications of removing a team member for package access?
**Answer:** The `package_team` pivot links packages to teams. If a user is removed from a team, they should lose access to packages associated with that team (assuming RAP implements team-based data scoping, which is currently "deferred to future phase" per RAP's Out of Scope). **For TMG MVP (pre-RAP data scoping), removing a team member does NOT affect package access** -- access is still role-based via `current_role_id`. The warning in US4 is forward-looking for when team-based scoping is implemented. **The confirmation dialog should show affected packages as informational, not as a hard block.**

### Q5: [UX] How many hierarchy levels are supported?
**Answer:** The spec describes "Departments > PODs" (two levels). The RAP spec states: "Team hierarchies beyond department > sub-team (flat sub-teams only for MVP)." **Strictly two levels for MVP.** The Team model could support a `parent_id` for hierarchy, but deeper nesting adds complexity without clear business value. **The UI should render two levels: department grouping headers with PODs listed underneath.** The `parent_id` column should be added to the teams table to support the two-level hierarchy.

### Q6: [Data] What is the current state of the teams table?
**Answer:** The Team model exists at `domain/Team/Models/Team.php` with `belongsToMany(User)` via `team_user` pivot and `belongsToMany(Package)` via `package_team` pivot. The `teamLeader` relationship exists. **The table and relationships are already in place.** TMG primarily needs: UI components for CRUD operations, team leader designation logic, and audit logging. The data model is largely complete.

## Refined Requirements

1. **Minimum TMG for RAP unblock:** US1 (list) + US2 (detail) + US3 (add member) + US4 (remove member). Deliver these first.
2. **Deprecate Pod constants** in favor of database-driven team names. Add a migration to seed existing Pods as database records.
3. **Add `parent_id` to the teams table** for two-level hierarchy support (Department > POD).
4. **Employment Hero sync is a fast-follow** (P2). Initial team structure can be seeded via a one-time import script.
5. **Package access implications of team removal are informational only** until RAP implements team-based data scoping.
