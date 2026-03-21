---
title: "Product Requirements Document: Roles and Permissions Refactor"
---


**Version**: 1.0
**Created**: 2025-11-08
**Author**: Claude Code (Discovery Agent)
**Owner**: CPO
**Status**: DRAFT (pending approval)

---

## 1. Executive Summary

TC Portal currently manages user permissions through **37 hardcoded roles** defined in a static configuration file (`config/roleList.php`), using the Spatie Laravel Permission package. While this system provides basic role-based access control (RBAC), it suffers from several critical issues:

**Current Problems:**
- Users can have multiple roles and manually switch between them via a "role switcher" UI, which sets `current_role_id` on the user object—an awkward pattern that exists primarily to show different dashboards (~10 variations)
- Every new role or permission requires engineering intervention (code changes, deployments)
- Teams exist in the database but have **no user-facing management UI**, making team updates entirely manual
- Permission assignments are scattered across config files (`config/permissions/*.php`) with inconsistent naming and granularity
- New features (like budget creation) require iterative permission fixes as edge cases emerge (e.g., "Business Development Manager" role discovered 3 weeks post-launch)

**Proposed Solution (from Nov 10, 2025 Meeting):**
This epic introduces a **dramatically simplified** roles and permissions system:
1. **Reduce to 6-8 core roles** (Super Admin, Executive, Senior Management, Manager, Employee, with potential Team Leader/Member variants)
2. **15-20 hierarchical teams** synced from Employment Hero for internal staff
3. **Team-based permission management** where department heads assign permission bundles to their teams
4. **Dashboards linked to teams** instead of roles, eliminating the need for role switching
5. **Portal-native UI** for team and permission management (not dependent on WorkOS or external tools)

**Deferred Scope:**
- Coordinator/Supplier organization refactor (too complex, different use case)
- WorkOS organizations (not cost-effective at $125/org for SSO)
- External stakeholder team management (build internal first)

The expected impact includes 60-70% reduction in team management support tickets, improved data accuracy across packages and workflows, and establishment of foundational infrastructure for future features like kanban-style workflows, team-specific dashboards, and dynamic role assignment.

---

## 1a. Meeting Decisions & Technical Direction (Nov 10, 2025)

**Attendees**: Tim Maier (Development Lead), Adam Pooler, Will (Room 203 - Shannon?)
**Key Decisions**:

### Role Simplification Target
- **Current**: 37 Portal roles (e.g., Finance Payable Manager, Finance Payable Team Member, Finance Receivable Manager, Business Development Manager/Member, Assessment Manager/Member, etc.)
- **Target**: 6-8 core organizational roles:
  1. Super Admin (tech team: Aaron, Anthony, Tim)
  2. Executive (C-level)
  3. Senior Management
  4. Manager (Pod leaders)
  5. Employee
  6. (Optional) Team Leader / Team Member variants

- **Derivation Source**: Employment Hero job titles/reporting structure can map to these 5-6 roles automatically

### Team Structure
- **Hierarchical teams**: Departments (top-level, carry permissions) → Sub-teams (PODs, carry dashboards/data scope)
- **Count**: 15-20 teams synced from Employment Hero "teams" field (currently used for geo-coding, accounts payable, accounts receivable, etc.)
- **Permissions at department level only**: E.g., all "Care" department members (across POD1, POD2, POD3, Inclusions) get same permission set; POD membership just scopes data and determines dashboard
- **Example hierarchy**:
  ```
  Care Department (carries permissions: view packages, edit care plans, etc.)
    ├─ POD 1 (scopes data: only see POD 1 packages)
    ├─ POD 2
    ├─ POD 3
    └─ Inclusions Team
  ```

### Dashboard Routing Changes
- **Current**: ~10 different dashboards, hard-coded role checks (e.g., `if (role === 'Care Partner')` → show CarePartnerDashboard)
- **New**: Dashboards link to **teams**, not roles
- **Example**: "Bill Processing Team" → Bill Processing Dashboard (regardless of whether you're a Manager or Employee in that team)
- **Eliminates role switcher**: Users won't need to manually switch roles to change dashboards—team membership determines dashboard

### Permission Assignment Model
- **Who assigns**: Department heads (not 300 people, not engineers)
- **What they assign**: Pre-grouped permission bundles (e.g., "Bill Permissions Bundle" includes create_bill, edit_bill, approve_bill, delete_bill, etc.)
- **When**: Initial feature rollout includes permission sets (engineering responsibility), but ongoing adjustments managed by business via UI matrix
- **New employee onboarding**: Employment Hero sync → Auto-assign default role based on job title → Manager adds to team → Manager assigns permission bundles if needed
- **Permission Naming**: Must be clear enough that tooltip explains what it enables (current permissions poorly named)

### Authentication vs Authorization Split
- **Authentication**: WorkOS + Entra ID for SSO (already partially working behind feature flag)
- **Authorization**: Portal-native (database-backed roles, teams, permissions—not relying on WorkOS roles)
- **Rationale**: WorkOS doesn't provide application-level permission granularity (can't hide a card in the UI based on WorkOS roles)
- **Cost concern**: WorkOS organizations cost $125/mo for enterprise SSO, not viable for all external orgs

### Out of Scope (Meeting Consensus)
- **Coordinator/Supplier refactor**: Users can't currently be both coordinator AND supplier (requires org switch, separate logins). Refactoring to allow multi-org membership is too complex for this epic—defer
- **Recipient roles**: Too muddled; authority relationships (daughter, supporter) already handle package-level permissions
- **Data scoping by team**: Acknowledged as future need (e.g., new Care Partner shouldn't see 16,000 records), but deferred to later phase
- **WorkOS organizations**: Not using WorkOS org constructs due to cost and complexity

### Discovery Actions (Assigned)
1. **Tim**: Provide 3 lists:
   - Current Portal roles (all 37)
   - Current Portal teams (with usage metrics if possible)
   - Current Portal permissions (grouped by domain)
2. **Dave (Discovery Lead)**: Interview business stakeholders using lists from Tim:
   - Do you need a dedicated dashboard for this role/team?
   - Do different people in your team have different privilege levels?
   - Which of these 37 roles can be consolidated or removed?
3. **Timeline**: November/December 2025 discovery, early 2026 implementation (must complete before work management/task threading features)

---

## 1b. Current State Audit (Nov 10, 2025)

**Audit Date**: 2025-11-10
**Audited By**: Claude Code (Backend Developer)
**Source**: `config/roleList.php`, `config/permissions/*.php`, `domain/Team/Models/Team.php`

### Current Roles (37 total)

**Administrative & Executive (3)**:
1. Admin
2. Guest
3. Support Agent

**Assessment & Clinical (5)**:
4. Assessment Manager
5. Assessment Team Member
6. Clinical Manager
7. Clinical Team Member
8. Senior Care Partner
9. Care Partner

**Care Coordination (3)**:
10. Care Coordinator
11. Care Coordinator Team Member
12. Care Coordinator Administrator
13. Care Management Administrator

**Finance (4)**:
14. Finance Payable Manager
15. Finance Payable Team Member
16. Finance Receivable Manager
17. Finance Receivable Team Member

**Bill Processing (2)**:
18. Bill Processing Manager
19. Bill Processing Team Member

**Customer Service (2)**:
20. CSR Manager
21. CSR Team Member

**Compliance & Audit (3)**:
22. Compliance Manager
23. Compliance Team Member
24. DVA Manager
25. DVA Team Member

**Business Development & Marketing (4)**:
26. Business Development Manager
27. Business Development Team Member
28. Marketing Manager
29. Marketing Team Member

**Partnerships (2)**:
30. Partnership Manager
31. Partnership Team Member

**HR (1)**:
32. HR Officer

**External Stakeholders (5)**:
33. Supplier
34. Supplier Team Member
35. Supplier Administrator
36. Recipient
37. Recipient Representative

### Current Teams

**Team Structure**:
- `teams` table exists (Laravel Jetstream)
- **Team Model** at `domain/Team/Models/Team.php`
- **Pod Constants** defined: `['Pod E1', 'Pod E2', 'Pod P1', 'Pod P2', 'Pod P3', 'Pod P4', 'Pod P5']`
- **Relationships**:
  - `belongsToMany(User)` via `team_user` pivot
  - `belongsToMany(Package)` via `package_team` pivot
  - `belongsTo(User)` as `teamLeader`

**Team Management**:
- ✅ Teams exist in database
- ❌ No UI for team management (manual database updates only)
- ❌ No team-specific role assignment
- ✅ Teams linked to packages (`package_team` pivot)

### Current Permissions (170+ total)

**Permission Files** (29 files):
- `aged-care-api-permission-list.php`
- `api-permission-list.php`
- `application-identities-permission-list.php`
- `bank-details-permission-list.php`
- `bill-permission-list.php`
- _(24 more files...)_

**Total Permissions**: ~170 permissions across 29 domain areas

**Permission Assignment**:
- Managed via `SyncRolesPermissions` artisan command
- Syncs from config files to database
- Supports wildcard role assignment (`'*'` = all roles)
- Preserves user-specific permission overrides (`model_has_permissions`)

### Key Issues Identified

**Role Proliferation**:
- 37 roles but many are Manager/Member pairs (e.g., Bill Processing Manager, Bill Processing Team Member)
- ~18 unique functional areas but 37 roles (2.05 roles per area on average)
- No role inheritance or hierarchy

**Team Management Gap**:
- Teams exist but entirely manual (no self-service)
- No team-specific role assignment
- Team leader field exists but not used for authorization

**Permission Complexity**:
- 170+ permissions across 29 files
- Inconsistent naming conventions
- No permission grouping/bundling
- All config-based (requires deployment to change)

**Dashboard Coupling**:
- Role switcher exists (`current_role_id` on User)
- ~10 different dashboards hard-coded to roles
- Users manually switch roles to change dashboards

**Consolidation Opportunities**:
- Collapse Manager/Member pairs into single role with permission bundles
- Reduce 37 roles → 6-8 core roles (per meeting decision)
- Introduce team-based permissions (department level)

### Technical Architecture Notes
- **Spatie Permission**: Continue using, but migrate from config-based to database-backed roles
- **Migration strategy**: Seed existing 37 roles + permissions into database, add feature flag to toggle config vs. database, deprecate config files after validation
- **Role switcher removal**: Phased deprecation as dashboards move to team-based routing
- **Audit logging**: Already planned, confirmed as essential for compliance (7-year retention)

---

## 2. Goals & Objectives

### Business Goals
- **Reduce operational overhead**: Decrease team management time by 60% through self-service team administration
- **Improve data accuracy**: Ensure 95%+ accuracy of team membership data across all portal features
- **Enable feature scalability**: Establish flexible permission system that supports future workflows (kanban, team views, composable workdays)
- **Reduce support load**: Decrease team-related support tickets by 70%

### User Goals
- **Team Leaders**: Manage team membership without IT/admin intervention
- **Team Members**: Understand their role and permissions clearly
- **HR & Operations**: Quickly onboard/offboard staff with confidence
- **Administrators**: Reduce manual permission management overhead

### Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Team management support tickets | ~40/month | <12/month | 3 months post-launch |
| Time to add/remove team member | 2-4 days (IT ticket) | <5 minutes (self-service) | Immediate |
| Team data accuracy | ~80% (manual updates lag) | 95%+ | 1 month post-launch |
| Permission-related errors | ~15/month | <5/month | 2 months post-launch |
| Team leader satisfaction (NPS) | Baseline TBD | +30 points | 6 months post-launch |

---

## 3. User Personas & Stories

### Personas

**Team Leader (Primary)**
- **Role**: Manager of a functional team (Bill Processing Manager, Clinical Manager, Partnership Manager)
- **Needs**: Add/remove team members, assign team-specific roles, view team permissions, manage team settings
- **Pain Points**: Currently must email IT/admin to update team roster, no visibility into who has what permissions, changes take 2-4 days
- **Success**: Can manage team in <5 minutes without external help

**Team Member**
- **Role**: Staff member on one or more teams (Bill Processing Team Member, Clinical Team Member)
- **Needs**: Understand what teams they belong to, what permissions they have, who their team leader is
- **Pain Points**: Unclear why they can/cannot access certain features, no visibility into team structure
- **Success**: Clear dashboard showing teams and permissions

**HR Officer**
- **Role**: Human Resources staff managing onboarding/offboarding
- **Needs**: Quickly add new hires to appropriate teams, remove terminated staff from all teams, audit team memberships
- **Pain Points**: Manual coordination with multiple team leaders, risk of missing team removals during offboarding
- **Success**: One-click add/remove with audit trail

**Administrator / Operations**
- **Role**: System admin managing portal configuration
- **Needs**: Create new roles, define permissions, assign system-wide capabilities, audit security
- **Pain Points**: 38 hardcoded roles require code changes to modify, permission files scattered across `config/permissions/`, no UI for role management
- **Success**: UI-based role and permission management with audit logging

**Care Coordinator / Package Manager**
- **Role**: Staff managing packages and client care
- **Needs**: See which team is assigned to a package, filter by team, route work to team members
- **Pain Points**: Team assignments exist but team membership is stale, no way to see team availability
- **Success**: Accurate team data surfaces in package views, inboxes, and workday composer

### User Stories

User stories are generated separately using `/stories` command and saved to `stories.yaml`. See that file for the complete list of user stories broken down by phase and priority.

---

## 4. Requirements

### 4.1 Functional Requirements

**P0 (Must Have) - MVP**:

**Team Management Interface**:
- **REQ-001**: Team leaders can view list of their team members with name, email, role(s), status, join date
- **REQ-002**: Team leaders can add existing portal users to their team (search by name/email)
- **REQ-003**: Team leaders can remove team members from their team
- **REQ-004**: Team leaders can assign/change team-specific roles to members
- **REQ-005**: Team leaders can see team member activity status (active, inactive, pending)
- **REQ-006**: System shows confirmation prompt before removing team member
- **REQ-007**: System logs all team membership changes with timestamp, actor, action

**Role Assignment**:
- **REQ-008**: Roles can be assigned at team level (not just globally)
- **REQ-009**: Users can have different roles on different teams
- **REQ-010**: Team-specific roles inherit base role permissions + team context
- **REQ-011**: System prevents privilege escalation (team leader cannot assign higher privileges than they have)

**Team Member Experience**:
- **REQ-012**: Users can view which teams they belong to on profile/dashboard
- **REQ-013**: Users can see their role(s) and permissions for each team
- **REQ-014**: Users receive notification when added to or removed from a team

**Authorization & Security**:
- **REQ-015**: Only team leaders and admins can manage team membership
- **REQ-016**: Team leaders can only manage their own teams
- **REQ-017**: Admins can manage all teams
- **REQ-018**: Removing user from team revokes team-specific permissions immediately
- **REQ-019**: Audit log tracks all permission changes with actor, timestamp, before/after state

**Integration with Existing Features**:
- **REQ-020**: Package views show current team assignments with accurate member list
- **REQ-021**: Bill processing inbox filters by team use current membership data
- **REQ-022**: Task assignment shows current team members only
- **REQ-023**: Dashboard views respect team-based permissions

**P1 (Should Have) - Important**:

**Enhanced Role Management**:
- **REQ-024**: Administrators can create custom roles via UI (not config files)
- **REQ-025**: Administrators can define permission sets for roles
- **REQ-026**: Administrators can deprecate/archive unused roles
- **REQ-027**: System shows which users have which roles (role audit view)

**Team Settings**:
- **REQ-028**: Team leaders can edit team name and description
- **REQ-029**: Team leaders can set team visibility (public/private)
- **REQ-030**: Team leaders can designate co-leaders/deputies

**Bulk Operations**:
- **REQ-031**: HR can bulk add user to multiple teams
- **REQ-032**: HR can bulk remove user from all teams (offboarding)
- **REQ-033**: Administrators can bulk assign permissions to roles

**Notifications & Communication**:
- **REQ-034**: Team members receive welcome email when added to team
- **REQ-035**: Team leaders receive digest of team changes (weekly)
- **REQ-036**: HR receives confirmation of bulk offboarding completion

**P2 (Nice to Have)**:

**Advanced Features**:
- **REQ-037**: Team leaders can invite external users to join team (creates pending invitation)
- **REQ-038**: Team leaders can set expiring roles (auto-revoke after date)
- **REQ-039**: System suggests role based on team member's work patterns (ML-based)
- **REQ-040**: Team leaders can export team roster to CSV
- **REQ-041**: Administrators can create role templates for common job functions
- **REQ-042**: System shows permission comparison between roles (diff view)

### 4.2 Non-Functional Requirements

**Performance**:
- Team list page loads in <800ms (p95) for teams up to 100 members
- Add/remove member operations complete in <500ms
- Permission checks (user authorization) resolve in <50ms
- Team search/autocomplete responds in <200ms

**Scalability**:
- Support teams up to 200 members
- Support users belonging to up to 10 teams simultaneously
- Handle 100 concurrent team management operations
- Scale to 2,000+ total users across all teams

**Security**:
- All permission changes logged with audit trail (retain 7 years for compliance)
- Role assignments validated server-side (never trust client)
- Implement CSRF protection on all team management endpoints
- Rate limit team membership changes (max 50 changes/hour per team leader)
- Encrypt sensitive permission data at rest
- Support MFA for administrator role management operations

**Accessibility**:
- WCAG 2.1 AA compliance for all UI components
- Keyboard navigation for all team management operations
- Screen reader support for team member lists and role assignments
- Color-blind friendly status indicators

**Compatibility**:
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Desktop and tablet support (mobile view P2)
- Works with existing Laravel 12 + Inertia + Vue 3 stack
- Compatible with Spatie Permission package v6+

**Reliability**:
- 99.5% uptime for team management features
- Graceful degradation if permission service unavailable (fallback to cached permissions)
- Automatic retry for failed permission sync operations
- Rollback capability for bulk operations

**Usability**:
- <5 minutes for team leader to learn core operations (add/remove/assign role)
- <10 clicks to add a new team member
- Inline help/tooltips for complex operations
- Confirmation dialogs prevent accidental removals

---

## 5. User Experience

### User Flows

**Flow 1: Team Leader Adds New Team Member**
1. Team leader navigates to "My Teams" from main navigation
2. Selects their team from list (e.g., "Bill Processing Team")
3. Clicks "Add Member" button
4. Searches for user by name or email (autocomplete)
5. Selects user from results
6. Assigns role from dropdown (e.g., "Bill Processing Team Member")
7. Clicks "Add to Team"
8. System shows success message, user appears in team list
9. New member receives notification email

**Flow 2: HR Officer Offboards Terminated Employee**
1. HR officer navigates to "User Management" (admin only)
2. Searches for terminated employee
3. Views employee profile showing all team memberships
4. Clicks "Remove from All Teams" button
5. System shows confirmation dialog listing all teams
6. HR officer confirms action
7. System processes bulk removal (shows progress indicator)
8. Success message shows teams removed from
9. Audit log records all removals

**Flow 3: Team Member Views Their Teams**
1. Team member clicks profile icon → "My Teams"
2. Sees list of teams they belong to
3. Each team shows: team name, leader, role, permissions summary
4. Can click team name to see full team roster (if team is public)
5. Can click role to see detailed permission list

**Flow 4: Administrator Creates Custom Role**
1. Admin navigates to "Settings" → "Roles & Permissions"
2. Clicks "Create New Role"
3. Enters role name (e.g., "Invoice Specialist")
4. Selects parent role to inherit from (optional)
5. Checks permission boxes from categorized list
6. Sets role visibility (global or team-specific)
7. Clicks "Create Role"
8. Role now available for assignment by team leaders

### Wireframes / Mockups

**To be created by UI Designer (Bruce)**

Key screens to design:
- Team list view (for team leaders)
- Team detail view with member list
- Add member modal with search
- Role assignment dropdown/modal
- User profile showing team memberships
- Admin role management interface
- Audit log view

**Design considerations**:
- Use existing TC Portal design system components
- Tables for team member lists (with sorting, filtering)
- Modal overlays for add/remove confirmations
- Inline editing for role assignments
- Status badges for active/inactive members
- Permission chip/tag components

### Components & UI Elements

**New Components to Build**:
- `TeamMemberList.vue` - Table of team members with actions
- `AddTeamMemberModal.vue` - Search and add interface
- `RoleSelector.vue` - Dropdown with permission preview
- `TeamMembershipCard.vue` - Card showing user's teams
- `PermissionBadge.vue` - Visual indicator for permissions
- `AuditLogTable.vue` - Filterable log of changes
- `BulkActionConfirmation.vue` - Confirmation for bulk operations

**Existing Components to Reuse**:
- `SearchInput.vue` - For user search
- `DataTable.vue` - For team lists
- `Button.vue` - For actions
- `Modal.vue` - For confirmations
- `Badge.vue` - For status indicators
- `Toast.vue` - For success/error messages

---

## 6. Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Inertia + Vue 3)              │
├─────────────────────────────────────────────────────────────┤
│  Team Management Pages │ User Profile │ Admin Role Manager  │
│  - TeamList.vue        │ - MyTeams.vue│ - RolesIndex.vue    │
│  - TeamShow.vue        │              │ - RoleEdit.vue      │
│  - AddMemberModal.vue  │              │                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ HTTP/Inertia
┌─────────────────────────────────────────────────────────────┐
│                    Controllers (Laravel 12)                  │
├─────────────────────────────────────────────────────────────┤
│  TeamController         │ RoleController  │ AuditController  │
│  - index()              │ - index()       │ - index()        │
│  - show()               │ - store()       │ - show()         │
│  - addMember()          │ - update()      │                  │
│  - removeMember()       │ - destroy()     │                  │
│  - assignRole()         │                 │                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ Action Pattern
┌─────────────────────────────────────────────────────────────┐
│                      Actions (Business Logic)                │
├─────────────────────────────────────────────────────────────┤
│  AddTeamMemberAction         │ CreateRoleAction             │
│  RemoveTeamMemberAction      │ AssignPermissionsAction      │
│  AssignTeamRoleAction        │ BulkOffboardUserAction       │
│  UpdateTeamMemberRoleAction  │ SyncTeamPermissionsAction    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ Eloquent ORM
┌─────────────────────────────────────────────────────────────┐
│                    Models & Database (MySQL)                 │
├─────────────────────────────────────────────────────────────┤
│  User ──< team_user >── Team                                 │
│    │                       │                                  │
│    │                       └─── team_roles (pivot)           │
│    │                                                          │
│    └──< model_has_roles >── Role ──< role_has_permissions   │
│                               │                               │
│                               └──< Permission                 │
│                                                               │
│  audit_logs (tracks all changes)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓ Events
┌─────────────────────────────────────────────────────────────┐
│                      Events & Listeners                      │
├─────────────────────────────────────────────────────────────┤
│  TeamMemberAdded → SendWelcomeNotification                   │
│  TeamMemberRemoved → RevokeTeamPermissions                   │
│  RoleAssigned → LogPermissionChange                          │
│  BulkOffboardCompleted → NotifyHRTeam                        │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

**Existing Tables (Spatie Permission)**:
- `users` - User accounts
- `roles` - Role definitions (currently 38 hardcoded)
- `permissions` - Permission definitions (from config files)
- `model_has_roles` - User → Role assignments
- `role_has_permissions` - Role → Permission mappings
- `model_has_permissions` - Direct user → Permission assignments

**New/Modified Tables**:

```sql
-- NEW: Team table (may already exist from Laravel Jetstream)
CREATE TABLE teams (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    visibility ENUM('public', 'private') DEFAULT 'public',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- NEW: Team membership with roles
CREATE TABLE team_user (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    team_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NULL, -- Team-specific role
    is_leader BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    UNIQUE KEY team_user_unique (team_id, user_id)
);

-- NEW: Audit log for permission/role changes
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    auditable_type VARCHAR(255) NOT NULL, -- Team, Role, Permission
    auditable_id BIGINT UNSIGNED NOT NULL,
    actor_id BIGINT UNSIGNED NOT NULL, -- Who made the change
    action VARCHAR(50) NOT NULL, -- 'added', 'removed', 'updated'
    description TEXT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX actor_idx (actor_id),
    INDEX auditable_idx (auditable_type, auditable_id),
    INDEX created_at_idx (created_at)
);

-- MODIFIED: Add context to roles table
ALTER TABLE roles
    ADD COLUMN is_team_specific BOOLEAN DEFAULT FALSE,
    ADD COLUMN parent_role_id BIGINT UNSIGNED NULL,
    ADD COLUMN description TEXT NULL,
    ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
    ADD FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL;
```

**Key Relationships**:
- User → Teams (many-to-many via `team_user`)
- Team → Users (many-to-many via `team_user`)
- User → Roles (many-to-many via `model_has_roles` - global roles)
- Team → User → Role (team-specific role stored in `team_user.role_id`)
- Role → Permissions (many-to-many via `role_has_permissions`)
- Role → Parent Role (self-referential for role inheritance)

### APIs & Integrations

**Internal API Endpoints**:

```php
// Team Management
GET    /teams                       // List user's teams
GET    /teams/{team}                // Show team details
POST   /teams/{team}/members        // Add member to team
DELETE /teams/{team}/members/{user} // Remove member from team
PUT    /teams/{team}/members/{user}/role // Assign/update role

// Role Management (Admin)
GET    /admin/roles                 // List all roles
POST   /admin/roles                 // Create new role
PUT    /admin/roles/{role}          // Update role
DELETE /admin/roles/{role}          // Delete/archive role
GET    /admin/roles/{role}/users    // List users with role

// Permission Management (Admin)
GET    /admin/permissions           // List all permissions
POST   /admin/roles/{role}/permissions // Assign permissions to role

// Audit Logs
GET    /audit-logs                  // List audit logs (admin/team leader)
GET    /audit-logs/{log}            // Show log details

// User Profile
GET    /profile/teams               // List current user's teams
GET    /profile/permissions         // List current user's effective permissions
```

**Authorization Policies**:
- `TeamPolicy` - Controls team management actions
- `RolePolicy` - Controls role creation/modification (admin only)
- `PermissionPolicy` - Controls permission assignment (admin only)
- `AuditLogPolicy` - Controls audit log access

**External Integrations**:
- None required for MVP
- Future: Consider HRIS integration (BambooHR, Workday) for auto-sync

### Technical Approach

**Role Management Strategy**:
- **Phase 1 (MVP)**: Continue using config-based roles but allow team-specific role assignment via `team_user.role_id`
- **Phase 2 (P1)**: Migrate to database-backed roles with UI management, deprecate config files
- Use role inheritance to reduce duplication (e.g., "Team Member" parent → "Bill Processing Team Member" child)

**Permission Caching**:
- Leverage Spatie's built-in permission caching (`PermissionRegistrar`)
- Cache effective permissions per user (key: `user:{id}:permissions`)
- Invalidate cache on role assignment/removal
- TTL: 1 hour (balance between performance and consistency)

**Team Context Resolution**:
- Middleware `ResolveTeamContext` to inject current team into request
- Use route model binding for team ownership checks
- Eager load team relationships to avoid N+1 queries

**Authorization Approach**:
- Use Laravel Policies for coarse-grained authorization (can user manage team?)
- Use Spatie permissions for fine-grained authorization (can user approve bill?)
- Team context added to Gate checks: `Gate::allows('approve-bill', [$bill, $team])`

**Audit Logging**:
- Use Laravel events to trigger audit log creation
- Store JSON diff of changes (old vs new)
- Background job for audit log creation (don't block user actions)
- Prune logs >7 years old (compliance retention)

**Migration from Config to Database**:
- Create migration to seed existing 38 roles into `roles` table
- Preserve all existing `role_has_permissions` mappings
- Add feature flag `use_database_roles` to toggle between config/database
- Once stable, remove config files

---

## 7. Implementation Plan

### Phases & Timeline

| Phase | Sprint(s) | Focus | Deliverables |
|-------|-----------|-------|--------------|
| **Phase 1: Foundation** | Sprint 1-2 | Database schema, models, actions | Migration files, `Team`, `TeamMember` models, `AddTeamMemberAction`, `RemoveTeamMemberAction`, policies |
| **Phase 2: Team Management UI** | Sprint 3-4 | Team list, member management, role assignment | `TeamList.vue`, `TeamShow.vue`, `AddTeamMemberModal.vue`, `RoleSelector.vue`, controllers, routes |
| **Phase 3: User Profile & Notifications** | Sprint 5 | User team view, email notifications | `MyTeams.vue`, `TeamMemberAdded` event, notification emails |
| **Phase 4: Admin Role Management** | Sprint 6 | Role creation UI, permission assignment | `RolesIndex.vue`, `RoleEdit.vue`, `CreateRoleAction`, database role migration |
| **Phase 5: Audit & Polish** | Sprint 7 | Audit logs, bulk operations, refinements | `AuditLogTable.vue`, `BulkOffboardUserAction`, testing, bug fixes |

### User Stories

User stories are generated separately and saved to `stories.yaml`. Run `/stories` to generate detailed user stories from this PRD.

---

## 8. Dependencies

### Internal Dependencies

**Code Dependencies**:
- **Spatie Laravel Permission (v6+)**: Core permission system - already installed, no action needed
- **Laravel Jetstream Teams**: May already exist - verify if `teams` table exists, reuse if possible
- **TC Portal Action Pattern**: Follow existing action conventions for business logic (e.g., `app/Actions/Bill/Processing/*`)
- **Existing User Model**: Ensure `User` model is set up for team relationships

**Feature Dependencies**:
- **User Authentication**: Must be logged in to manage teams - already implemented
- **Admin Roles**: Must identify who has admin privileges - use existing role system
- **Email System**: Required for notifications - already configured (Laravel Mail)

**Team Dependencies**:
- **Design Team (Bruce)**: Need UI mockups before Phase 2 starts - ETA: End of Sprint 1
- **QA Team (Piotr)**: Need test coverage plan before Phase 5 - ETA: Sprint 6

### External Dependencies

**Third-Party Services**:
- None for MVP
- **Future Consideration**: HRIS integration for automatic team sync (BambooHR, Workday) - defer to Phase 6+

**Infrastructure**:
- **Database**: MySQL 8.0+ for JSON column support in audit_logs - already available
- **Cache**: Redis for permission caching - already configured
- **Queue**: Laravel Horizon for background jobs (audit logs, emails) - already running

### Technical Dependencies

**Framework Requirements**:
- Laravel 12 - already on v12
- Inertia v2 - already on v2
- Vue 3 - already on v3
- Tailwind CSS v3 - already on v3

**Package Requirements**:
- `spatie/laravel-permission:^6.0` - verify version, upgrade if needed
- No new packages required for MVP

**Browser Requirements**:
- Modern browser with ES6+ support
- No special polyfills needed (existing stack handles compatibility)

---

## 9. Risks & Mitigation

| Risk | Severity | Probability | Impact | Mitigation | Owner |
|------|----------|-------------|--------|-----------|-------|
| **Migration disrupts existing permissions** | HIGH | Medium | Users lose access to features, data integrity issues | Create rollback script, test migration on staging, phase rollout with feature flag, keep config-based roles as fallback | Backend Lead |
| **Performance degradation from permission checks** | HIGH | Medium | Slow page loads, poor UX, increased database load | Implement aggressive caching (Redis), eager load relationships, add database indexes, load test before launch | Backend Lead |
| **Team leaders abuse privileges** | MEDIUM | Low | Inappropriate team access, security breach | Implement audit logging, rate limiting (50 changes/hour), require admin approval for sensitive roles, alerting on suspicious activity | Security Lead |
| **Stale team data persists in existing features** | MEDIUM | High | Packages, bills, tasks show wrong team members | Refactor all team-related queries to use new `team_user` table, add data migration script, run validation report | Backend Lead |
| **Scope creep from "just one more role feature"** | MEDIUM | High | Timeline extends, MVP delayed | Strict P0/P1/P2 prioritization, defer non-essential to Phase 6+, product owner approval required for scope changes | Product Owner |
| **User confusion from permission changes** | MEDIUM | Medium | Support tickets increase, poor adoption | Create in-app help tooltips, training materials, gradual rollout to pilot teams first, gather feedback | Product Owner |
| **Database migration fails mid-process** | HIGH | Low | Partial data corruption, downtime | Use database transactions, test on production clone, schedule migration during low-traffic window (3am AEST), have rollback plan | DevOps Lead |
| **Third-party HRIS integration required** | LOW | Low | Timeline delay, integration complexity | Explicitly out of scope for MVP, revisit in Phase 6+ if business need arises | Product Owner |
| **Existing Jetstream teams conflict with new design** | MEDIUM | Medium | Technical debt, confusing dual team systems | Audit existing Jetstream usage, decide to extend or replace, document decision, refactor if needed | Tech Lead |

---

## 10. Out of Scope

Explicitly: What we are NOT doing in this epic:

- **Mobile app team management** - Web only for MVP, mobile in future release
- **Third-party HRIS integration** - No automatic sync with BambooHR, Workday, etc. (manual for now)
- **Workflow automation** (e.g., "Auto-assign new bills to team member with lowest load") - Separate epic
- **Team-based kanban boards** - Separate epic (TP-TBD), this lays foundation only
- **Advanced reporting/analytics** (e.g., "Team productivity dashboard") - Use existing analytics tools
- **Single Sign-On (SSO) integration** for team management - Already handled at auth layer
- **Team chat/messaging** - Not replacing Slack/Teams
- **Calendar integration** for team availability - Out of scope
- **Role approval workflows** (e.g., "Request team leader approval before adding member") - Trust-based model for MVP
- **Granular field-level permissions** (e.g., "Team member can view but not edit invoice amount") - Role-based only for now
- **Time-based role expiration** - P2 feature, defer to later
- **Team hierarchies** (e.g., "Parent team with sub-teams") - Flat structure only for MVP
- **Multi-tenancy support** (if applicable) - Single organization for now

---

## 11. Launch Plan

### Pre-Launch Checklist

**Technical Readiness**:
- [ ] All P0 user stories completed and merged to `dev`
- [ ] Feature tests achieve >85% coverage for team management
- [ ] Database migration tested on staging with production data clone
- [ ] Permission caching validated (no cache stampede issues)
- [ ] Load testing completed (100 concurrent team operations)
- [ ] Security audit completed (audit logs working, rate limiting active)
- [ ] Rollback procedure documented and tested

**Documentation & Training**:
- [ ] User documentation created (team leader guide, team member guide)
- [ ] Admin documentation created (role management guide)
- [ ] Video walkthrough recorded (5 minutes, core operations)
- [ ] Support team trained on new features and troubleshooting
- [ ] FAQ created based on beta testing feedback
- [ ] Confluence page updated with architecture decisions

**Monitoring & Support**:
- [ ] Application monitoring configured (error tracking, performance metrics)
- [ ] Alerts configured (permission failures, audit log anomalies)
- [ ] Support runbook created (common issues and solutions)
- [ ] Slack channel created for launch day support (#team-mgmt-launch)
- [ ] Postmortem template prepared for post-launch review

**Communication**:
- [ ] Launch announcement drafted (internal comms)
- [ ] Email to all team leaders drafted (with video link)
- [ ] In-app announcement banner configured
- [ ] Support ticket template created (for team management requests)

### Rollout Strategy

**Phase 1: Pilot (Week 1-2)**
- Select 3 pilot teams (small, medium, large) from different departments
- Team leaders: Bill Processing Manager, Clinical Manager, Partnership Manager
- Gather daily feedback via Slack channel
- Fix critical bugs before wider rollout

**Phase 2: Beta (Week 3-4)**
- Roll out to 50% of teams (10-15 teams)
- Monitor support ticket volume and sentiment
- Iterate on UI/UX based on feedback
- Validate performance metrics meet targets

**Phase 3: General Availability (Week 5)**
- Roll out to all teams
- Announce via email and in-app banner
- Host optional live demo session (30 minutes)
- Monitor metrics closely for first week

**Rollback Plan**:
- If critical bug discovered: disable feature flag `team_management_ui`
- If data integrity issue: revert to config-based roles, restore database backup
- If performance issue: increase cache TTL, disable background jobs temporarily

### Communication Plan

**Internal Communication**:
- **T-2 weeks**: Email to all team leaders announcing upcoming feature, link to video walkthrough
- **T-1 week**: Slack announcement in #general, #team-leaders
- **Launch day**: In-app banner notification, launch announcement email
- **T+1 week**: Feedback survey sent to all team leaders
- **T+1 month**: Success metrics shared in company all-hands

**User Communication**:
- **Team Leaders**: Email with video, link to documentation, FAQ
- **Team Members**: In-app notification when added to team, welcome email
- **Administrators**: Separate email with admin documentation, advanced features guide

**Support Documentation**:
- **User Guide**: "Managing Your Team in TC Portal" (Confluence)
- **Admin Guide**: "Role and Permission Management" (Confluence)
- **Video Walkthrough**: 5-minute Loom video (embedded in email and Confluence)
- **FAQ**: Common questions from beta testing

---

## 12. Support & Maintenance

### Support Plan

**Support Channels**:
- **Tier 1 (Support Team)**: Handle basic questions (How do I add a team member?), common troubleshooting
- **Tier 2 (Product Team)**: Handle escalations (Permission not working correctly), feature requests
- **Tier 3 (Engineering)**: Handle bugs, data integrity issues, performance problems

**Expected Support Volume**:
- **Week 1-2**: 30-40 tickets/day (peak learning curve)
- **Week 3-4**: 15-20 tickets/day (settling down)
- **Steady State**: 5-10 tickets/day (mostly questions from new team leaders)

**Support Runbook Topics**:
- User added but cannot access feature (permission cache issue)
- Team leader cannot remove member (authorization issue)
- Bulk offboarding failed (background job error)
- Audit log shows unexpected change (investigation procedure)
- Performance slow on team list page (cache warming)

### Monitoring & Alerts

**Key Metrics to Monitor**:
- Team management operation success rate (target: >99%)
- API response time for team endpoints (target: <500ms p95)
- Permission cache hit rate (target: >90%)
- Background job queue depth (alert if >1000)
- Audit log creation rate (alert if anomalous spike)

**Alerts to Configure**:
- **Critical**: Permission check failures >5% (Pagerduty)
- **Critical**: Database migration rollback triggered (Pagerduty)
- **Warning**: API response time >1s p95 for 5 minutes (Slack)
- **Warning**: Cache invalidation rate >1000/minute (Slack)
- **Info**: Bulk offboarding completed (Slack #hr-team)

**Dashboards**:
- **Team Management Dashboard**: Operations/day, success rate, top errors
- **Performance Dashboard**: API latency, database query time, cache hit rate
- **Audit Dashboard**: Changes/day by actor, permission changes by team

### Maintenance Tasks

**Daily**:
- Monitor error logs for permission-related exceptions
- Review support tickets for common issues

**Weekly**:
- Review audit logs for suspicious activity
- Check database indexes for query performance
- Update documentation based on feedback

**Monthly**:
- Prune old audit logs (keep last 7 years)
- Review role usage (identify deprecated roles)
- Analyze support ticket trends, update FAQ

**Quarterly**:
- Performance optimization review
- Security audit (permission assignments, audit log integrity)
- User satisfaction survey to team leaders

---

## 13. Future Enhancements

Post-V1 ideas and improvements (defer to Phase 6+):

**Team Workflows (Epic TP-TBD)**:
- **Kanban boards for teams**: Visualize work in progress, drag-and-drop task assignment
- **Team workload balancing**: Auto-suggest assignments based on capacity
- **Team performance dashboards**: Metrics on throughput, quality, efficiency

**Advanced Permissions (Epic TP-TBD)**:
- **Field-level permissions**: Control access to specific fields (e.g., edit package budget but not services)
- **Conditional permissions**: Permissions based on data state (e.g., approve bills <$5000)
- **Temporary role elevation**: Time-limited access for specific tasks

**HRIS Integration (Epic TP-TBD)**:
- **BambooHR sync**: Auto-add/remove team members based on HR system
- **Workday integration**: Sync organizational structure to teams
- **Offboarding automation**: Trigger team removal on employee termination in HRIS

**Team Collaboration (Epic TP-TBD)**:
- **Team chat**: In-app messaging for team members
- **Team calendar**: Shared availability, team meetings
- **Team resources**: Shared documents, links, training materials

**Reporting & Analytics (Epic TP-TBD)**:
- **Permission audit reports**: Who has access to what, exported to CSV
- **Team activity reports**: Usage patterns, most active members
- **Compliance reports**: Role assignments for audit purposes

**Mobile App Support (Epic TP-TBD)**:
- **Mobile team management**: Add/remove members from iOS/Android app
- **Mobile notifications**: Push notifications for team changes

**Role Templates (Epic TP-TBD)**:
- **Job function templates**: Pre-configured roles for common jobs (e.g., "Finance Analyst")
- **Role marketplace**: Share role templates across organizations (future multi-tenant)

---

## 14. Appendix

### A. Competitive Analysis

**How do competitors handle team and permission management?**

**Slack**:
- Workspace owners can create user groups
- Permissions tied to workspace/channel level
- Simple role model: Owner, Admin, Member, Guest
- Strengths: Very simple, intuitive
- Weaknesses: Lacks granularity, no custom roles

**Asana**:
- Teams as organizational units
- Permissions at project level (view, edit, admin)
- Custom role creation available in Enterprise plan
- Strengths: Flexible project-level permissions, clear role hierarchy
- Weaknesses: Complex for casual users, requires training

**Monday.com**:
- Boards can be assigned to teams
- Role-based permissions with custom role creation
- Granular field-level permissions available
- Strengths: Very flexible, visual permission management
- Weaknesses: Can be overwhelming, steep learning curve

**Jira**:
- Project roles assigned to users/groups
- Permission schemes control access to issue types, workflows
- Admins can create custom roles and permission schemes
- Strengths: Powerful, granular, flexible
- Weaknesses: Extremely complex, requires dedicated admin

**TC Portal Approach**:
- Simpler than Jira, more flexible than Slack
- Team-based permissions with custom role creation (admin only)
- Focus on self-service team management (team leaders, not just admins)
- Balance between flexibility and usability

### B. References & Links

**Documentation**:
- [IDEA-BRIEF.md](./IDEA-BRIEF.md)
- [Spatie Laravel Permission Docs](https://spatie.be/docs/laravel-permission/v6/introduction)
- [Laravel Jetstream Teams Docs](https://jetstream.laravel.com/features/teams.html)

**Jira**:
- [Epic TP-2403](https://trilogycare.atlassian.net/browse/TP-2403) - Roles and Permissions Refactor
- [Initiative TP-2141](https://trilogycare.atlassian.net/browse/TP-2141) - Work Management

**Design** (To be created):
- Figma: Team Management UI Mockups (TBD)
- Figma: Role Management Admin Interface (TBD)

**Codebase References**:
- `/config/roleList.php` - Current 38 hardcoded roles
- `/config/permissions/*.php` - Current permission definitions
- `/app/Console/Commands/SyncRolesPermissions.php` - Permission sync command
- `/app/Actions/Jetstream/*Team*.php` - Existing team actions (may reuse)

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-08 | Claude Code (Discovery Agent) | Initial draft, all 15 sections |
| 1.1 | 2025-11-10 | Claude Code | Updated with meeting decisions: Added Section 1a (Meeting Decisions & Technical Direction) with role simplification (37→6-8), hierarchical teams (15-20 from Employment Hero), dashboard-to-team routing, permission bundles, auth/authz split, scope deferrals. Updated team assignments, next steps with discovery actions. |
| 1.2 | 2025-11-10 | Claude Code | Added comprehensive RACI matrix (Section 14) covering all phases: Discovery, Design, Development, Testing, Release, and Post-Launch with clear accountability assignments across 7 stakeholders. |

---

## 14. RACI Matrix

### 14.1 Discovery Phase (Nov-Dec 2025)

| Activity | Shannon (CPO) | David Henry | Timothy Maier | Design Lead | Adam Pooler | Erin (HR) | Pat (Ops) |
|----------|--------------|-------------|---------------|-------------|-------------|-----------|-----------|
| Audit existing roles/permissions | I | C | **R/A** | I | C | I | I |
| Business stakeholder interviews | A | **R** | C | I | C | **C** | **C** |
| Document current state findings | I | **R/A** | C | I | I | I | I |
| Validate role consolidation strategy | **A** | **R** | C | I | C | C | C |
| Define team hierarchy from Employment Hero | I | **R** | C | I | **C** | **C** | I |
| PRD review and refinement | **A** | C | **R** | C | C | I | I |

### 14.2 Design Phase (Dec 2025-Jan 2026)

| Activity | Shannon (CPO) | David Henry | Timothy Maier | Design Lead | Adam Pooler | Erin (HR) | Pat (Ops) |
|----------|--------------|-------------|---------------|-------------|-------------|-----------|-----------|
| UI/UX wireframes - Team management | A | C | C | **R** | I | I | I |
| UI/UX wireframes - Permission matrix | A | C | C | **R** | I | I | I |
| UI/UX wireframes - Dashboard routing | A | I | C | **R** | I | I | I |
| Design review and approval | **A** | I | C | **R** | I | I | I |
| Technical design document | I | I | **R/A** | C | C | I | I |
| Database schema design | I | I | **R/A** | I | **C** | I | I |
| Migration strategy planning | I | C | **R/A** | I | **C** | I | I |

### 14.3 Development Phase (Q1 2026)

| Activity | Shannon (CPO) | David Henry | Timothy Maier | Design Lead | Adam Pooler | Erin (HR) | Pat (Ops) |
|----------|--------------|-------------|---------------|-------------|-------------|-----------|-----------|
| Phase 1: Database schema & models | I | I | **R/A** | I | C | I | I |
| Phase 2: Team management UI | I | C | **R/A** | C | I | I | I |
| Phase 3: Permission bundle UI | I | C | **R/A** | C | I | I | I |
| Phase 4: Dashboard routing refactor | I | C | **R/A** | C | I | I | I |
| Phase 5: Employment Hero integration | I | C | **R/A** | I | **C** | **C** | I |
| Migration scripts & data seeding | I | I | **R/A** | I | C | I | I |
| Feature flag implementation | I | I | **R/A** | I | C | I | I |
| API endpoints & policies | I | I | **R/A** | I | C | I | I |

### 14.4 Testing Phase (Q1 2026)

| Activity | Shannon (CPO) | David Henry | Timothy Maier | Design Lead | Adam Pooler | Erin (HR) | Pat (Ops) |
|----------|--------------|-------------|---------------|-------------|-------------|-----------|-----------|
| Unit & feature test creation | I | I | **R/A** | I | I | I | I |
| UAT planning & coordination | C | **R/A** | C | I | I | **C** | **C** |
| UAT execution - HR workflows | C | **A** | C | I | I | **R** | C |
| UAT execution - Ops workflows | C | **A** | C | I | I | C | **R** |
| UAT execution - Team leader workflows | C | **A** | C | I | I | C | **R** |
| Bug triage & prioritization | **A** | C | **R** | I | I | I | I |
| Security & audit testing | C | C | **R** | I | **A** | I | I |

### 14.5 Release Phase (Q1-Q2 2026)

| Activity | Shannon (CPO) | David Henry | Timothy Maier | Design Lead | Adam Pooler | Erin (HR) | Pat (Ops) |
|----------|--------------|-------------|---------------|-------------|-------------|-----------|-----------|
| Release planning & timeline | **A** | **R** | C | I | C | I | I |
| Pilot team selection | **A** | **R** | I | I | I | **C** | **C** |
| Training materials creation | C | **R/A** | C | I | I | I | I |
| User documentation | C | **R/A** | C | I | I | I | I |
| Pilot rollout (3 teams) | **A** | **R** | C | I | I | C | C |
| Beta rollout (50% teams) | **A** | **R** | C | I | I | C | C |
| General availability rollout | **A** | **R** | C | I | **C** | I | I |
| Post-launch monitoring | C | **A** | **R** | I | **C** | I | I |
| Support runbook creation | I | C | **R/A** | I | I | I | I |

### 14.6 Post-Launch (Ongoing)

| Activity | Shannon (CPO) | David Henry | Timothy Maier | Design Lead | Adam Pooler | Erin (HR) | Pat (Ops) |
|----------|--------------|-------------|---------------|-------------|-------------|-----------|-----------|
| Success metrics tracking | **A** | **R** | C | I | I | C | C |
| User feedback collection | C | **R/A** | I | I | I | C | C |
| Support ticket triage | I | **A** | **R** | I | I | I | I |
| Performance optimization | I | C | **R/A** | I | **C** | I | I |
| Feature enhancements backlog | **A** | C | C | I | I | I | I |

### RACI Key
- **R** = Responsible (does the work)
- **A** = Accountable (final decision maker, only one per activity)
- **C** = Consulted (provides input)
- **I** = Informed (kept in the loop)

### Notes
- **Shannon (CPO)**: Final decision authority on scope, priorities, and release approvals
- **David Henry**: Discovery Lead (interviews, documentation) and Release Manager (rollout, training, monitoring)
- **Timothy Maier**: Development Lead (all technical implementation)
- **Design Lead (TBD)**: UI/UX design for all interface changes
- **Adam Pooler**: Infrastructure (Employment Hero integration, WorkOS/Entra setup, security)
- **Erin (HR)**: UAT for HR workflows (onboarding, offboarding), team hierarchy validation
- **Pat (Ops)**: UAT for operations workflows, team management validation

---

## 15. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner (CPO) | Shannon (Will) | ☐ | YYYY-MM-DD |
| Discovery Lead | David Henry | ☐ | YYYY-MM-DD |
| Development Lead | Timothy Maier | ☐ | YYYY-MM-DD |
| Design Lead | TBD | ☐ | YYYY-MM-DD |
| Release Manager | David Henry | ☐ | YYYY-MM-DD |
| **Consulted** | | | |
| Infrastructure Lead | Adam Pooler | ☐ | YYYY-MM-DD |
| HR Stakeholder | Erin | ☐ | YYYY-MM-DD |
| Operations Stakeholder | Pat | ☐ | YYYY-MM-DD |

---

**Next Steps**:
1. **Tim (Development Lead)** - Provide audit lists by **Nov 15, 2025**:
   - All 37 current Portal roles with descriptions
   - All current Portal teams (with usage metrics if queryable)
   - All current Portal permissions (grouped by domain: bills, packages, tasks, etc.)
2. **Dave (Discovery Lead)** - Business stakeholder interviews **Nov-Dec 2025**:
   - Use Tim's lists to identify consolidation opportunities
   - Validate dashboard requirements per team
   - Identify permission privilege levels within teams
   - Document findings in discovery report
3. **Shannon (CPO)** - Review updated PRD with meeting notes by **Nov 17, 2025**
4. **Design Lead (TBD)** - Create UI mockups for:
   - Team management interface (CRUD matrix)
   - Permission bundle assignment UI
   - Dashboard routing logic (team-based)
5. **All** - Refine PRD based on discovery findings (Dec 2025)
6. **Engineering** - Create user stories CSV and sync to Jira (break down into sprints)
7. **Tim** - Kick off Phase 1 (Foundation) development **Early 2026** (must complete before work management features)
