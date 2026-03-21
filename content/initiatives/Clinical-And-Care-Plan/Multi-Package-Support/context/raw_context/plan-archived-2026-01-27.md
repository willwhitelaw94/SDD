---
title: "Plan"
---


**Spec**: [spec.md](spec.md)
**Created**: 2025-12-10
**Status**: Draft
**Epic**: TP-2432
**Initiative**: TP-1859 (Clinical And Care Plan)

---

## Summary

Enable clients to have multiple active service packages concurrently by removing the one-to-one constraint between recipients and packages. This supports Trilogy Care's restorative care and end-of-life pathways, allowing clients to maintain their ongoing support package while receiving specialized clinical services through separate package records with independent care planning, coordination, and invoicing.

---

## Technical Context

### Technology Stack
- **Backend**: Laravel 12, PHP 8.4
- **Frontend**: Vue 3, Inertia.js v2, TypeScript
- **Database**: MySQL (via Laravel Herd)
- **Testing**: Pest v3, PHPUnit v11, Laravel Dusk v8
- **Queue**: Laravel Horizon v5
- **Feature Flags**: Laravel Pennant v1
- **Search**: Laravel Scout v10
- **External Integration**: Services Australia API (PRODA), Zoho CRM

### Key Dependencies
- Services Australia API must support multiple packages per client (confirmed working)
- Zoho CRM synchronization for package records
- Existing care coordination and billing workflows

### Constraints
- Must maintain backward compatibility with existing single-package clients
- Zero data loss during migration
- Financial reconciliation accuracy >99.5%
- Package context must be clear to users within 1 second on any screen

---

## Constitution Check

> Note: Project constitution template not yet configured. Following Laravel Boost guidelines and existing codebase conventions.

- [x] Uses existing directory structure (`domain/Package/`)
- [x] Uses Eloquent relationships (no raw DB queries)
- [x] Feature tests required for all changes
- [x] Form Request validation for new endpoints
- [x] Follows existing enum patterns
- [x] Uses Laravel Pennant for feature gating

---

## Data Model

### Existing Structure (Current State)

```
packages table:
├── recipient_id (UNIQUE constraint) ← BLOCKER TO REMOVE
├── care_recipient_id (UNIQUE constraint) ← REVIEW NEEDED
├── tc_customer_no (UNIQUE)
├── zoho_id (UNIQUE)
├── stage (ON_BOARDING, ACTIVE, TERMINATED)
├── package_option (SELF_MANAGED, SELF_MANAGED_PLUS, CARE_MANAGED)
├── package_level (Level 3, 4, 5, 7, EOL)
└── [financial, temporal, and meta fields]
```

### Proposed Changes

#### Phase 1: Schema Migration

**1. Remove UNIQUE Constraint on `recipient_id`**
```sql
-- Migration: Remove recipient_id unique constraint
ALTER TABLE packages DROP INDEX packages_recipient_id_unique;
-- Add non-unique index for query performance
ALTER TABLE packages ADD INDEX packages_recipient_id_index (recipient_id);
```

**2. Add Package Type Enum**
```php
// domain/Package/Enums/PackageType.php
enum PackageType: string
{
    case STANDARD = 'STANDARD';
    case RESTORATIVE_CARE = 'RESTORATIVE_CARE';
    case END_OF_LIFE = 'END_OF_LIFE';
}
```

**3. New/Modified Package Fields**
```sql
ALTER TABLE packages ADD COLUMN package_type VARCHAR(50) DEFAULT 'STANDARD';
ALTER TABLE packages ADD COLUMN linked_package_id BIGINT UNSIGNED NULL;
ALTER TABLE packages ADD COLUMN dormancy_status VARCHAR(50) NULL; -- NULL, DORMANT, REACTIVATED
ALTER TABLE packages ADD FOREIGN KEY (linked_package_id) REFERENCES packages(id);
```

**4. Service Duplication Exceptions Table**
```sql
CREATE TABLE service_duplication_exceptions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    package_id BIGINT UNSIGNED NOT NULL,
    service_type_id BIGINT UNSIGNED NOT NULL,
    reason TEXT NOT NULL,
    approved_by BIGINT UNSIGNED NOT NULL,
    approved_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    FOREIGN KEY (service_type_id) REFERENCES service_types(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

**5. Package Care Partners Table (Many-to-Many)**
```sql
CREATE TABLE package_care_partners (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    package_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role_type VARCHAR(50) NOT NULL, -- PRIMARY, CLINICAL, SUPPORT
    assigned_at TIMESTAMP NOT NULL,
    unassigned_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY package_user_role (package_id, user_id, role_type)
);
```

### Entity Relationships (Post-Migration)

```
User (Recipient)
└── packages() → HasMany Package (was HasOne)

Package
├── recipient() → BelongsTo User
├── linkedPackage() → BelongsTo Package (self-reference)
├── childPackages() → HasMany Package
├── packageType → PackageType enum
├── dormancyStatus → DormancyStatus enum (nullable)
├── carePartners() → BelongsToMany User (through package_care_partners)
├── serviceDuplicationExceptions() → HasMany ServiceDuplicationException
├── [existing relationships unchanged]
│   ├── budgetPlans() → HasMany
│   ├── budgetItems() → HasMany
│   ├── needs() → HasMany
│   ├── bills() → HasMany
│   └── etc.
```

---

## API Contracts

### New Endpoints

#### Package Management

**POST /api/v1/packages**
Create a new package for an existing recipient.
```json
Request:
{
    "recipient_id": 123,
    "package_type": "RESTORATIVE_CARE",
    "package_option": "CARE_MANAGED",
    "package_level": "Level 4",
    "linked_package_id": 456, // optional - links to existing package
    "care_partner_id": 789,
    "care_coordinator_id": 101
}

Response:
{
    "data": {
        "id": 457,
        "package_type": "RESTORATIVE_CARE",
        "stage": "ON_BOARDING",
        "linked_package": { "id": 456, "package_type": "STANDARD" }
    }
}
```

**GET /api/v1/recipients/{id}/packages**
List all packages for a recipient.
```json
Response:
{
    "data": [
        { "id": 456, "package_type": "STANDARD", "stage": "ACTIVE" },
        { "id": 457, "package_type": "RESTORATIVE_CARE", "stage": "ACTIVE" }
    ]
}
```

**PUT /api/v1/packages/{id}/dormancy**
Set package dormancy status (for EOL workflow).
```json
Request:
{
    "dormancy_status": "DORMANT", // or "REACTIVATED"
    "reason": "Client approved for end-of-life care"
}
```

**PUT /api/v1/packages/{id}/terminate**
Terminate a specific package independently.

#### Service Duplication

**POST /api/v1/packages/{id}/service-exceptions**
Document exception for duplicate service across packages.
```json
Request:
{
    "service_type_id": 45,
    "reason": "Dual physiotherapy approved: ongoing rehab + acute treatment"
}
```

**GET /api/v1/packages/{id}/service-conflicts**
Check for service conflicts with other active packages.

### Modified Endpoints

**PUT /api/v1/bills**
Add package context requirement.
```json
Request:
{
    "package_id": 457, // Required - must specify target package
    "supplier_id": 123,
    "items": [...]
}
```

---

## UI Components

### New Components

#### PackageSelector
Global package context selector for clients with multiple packages.
```vue
<!-- components/Package/PackageSelector.vue -->
- Dropdown showing all active packages for current recipient
- Visual indicators for package type (color-coded badges)
- Displays current selection in header/breadcrumb
- Fires event on selection change to update page context
```

#### PackageTypeBadge
Visual indicator for package type.
```vue
<!-- components/Package/PackageTypeBadge.vue -->
- STANDARD: Default styling
- RESTORATIVE_CARE: Clinical blue badge
- END_OF_LIFE: Subtle purple badge
- DORMANT: Grayed/muted styling
```

#### MultiPackageDashboard
Client dashboard showing all packages.
```vue
<!-- Pages/Recipient/Dashboard/MultiPackageDashboard.vue -->
- Package summary cards with key metrics
- Quick switch between packages
- Combined timeline view (toggle-able)
- Visual relationship indicators for linked packages
```

#### CreatePackageModal
Modal for creating additional packages.
```vue
<!-- components/Package/CreatePackageModal.vue -->
- Shows existing packages for context
- Package type selection with descriptions
- Care partner/coordinator assignment
- Linked package selection (optional)
```

#### ServiceDuplicationAlert
Warning when service might duplicate across packages.
```vue
<!-- components/Package/ServiceDuplicationAlert.vue -->
- Shows during bill creation
- Lists conflicting services
- Exception documentation flow
```

### Modified Components

| Component | Change Required |
|-----------|-----------------|
| RecipientHeader | Add PackageSelector for multi-package clients |
| BillCreateForm | Add required package selection |
| BudgetPlanForm | Add package context awareness |
| CarePlanSection | Show package-specific care plans |
| TimelineView | Add package filter toggle |
| StatementView | Add combined/per-package toggle |

---

## Implementation Phases

### Phase 1: Foundation (Database & Models)

**Objective**: Enable multiple packages at the database level without breaking existing functionality.

#### Tasks
1. **Database Migration**
   - Remove UNIQUE constraint on `packages.recipient_id`
   - Add `package_type` enum column with default 'STANDARD'
   - Add `linked_package_id` self-reference column
   - Add `dormancy_status` nullable column
   - Create `service_duplication_exceptions` table
   - Create `package_care_partners` table

2. **Model Updates**
   - Create `PackageType` enum
   - Create `DormancyStatus` enum
   - Update `Package` model relationships
   - Create `ServiceDuplicationException` model
   - Create `PackageCarePartner` pivot model
   - Update `User` model: change `package()` to `packages()`

3. **Feature Flag**
   - Create `MultiPackageSupport` Pennant feature
   - Gate all new functionality behind flag
   - Ensure backward compatibility when flag is off

4. **Data Integrity**
   - Add database triggers/constraints for package type rules
   - Add validation for linked package (must be same recipient)

### Phase 2: Core Features (Business Logic)

**Objective**: Implement core multi-package workflows.

#### Tasks
1. **Package Creation Flow**
   - Create `CreatePackageAction` for new packages
   - Validate against existing packages
   - Support all three package types
   - Link packages when specified

2. **Package Context Service**
   - Create `PackageContextService` for session management
   - Store active package selection per user session
   - Provide context to all package-aware operations

3. **Care Partner Assignment**
   - Implement many-to-many care partner relationships
   - Support role-based assignment (PRIMARY, CLINICAL, SUPPORT)
   - Migration path for existing `case_manager_id`

4. **Service Duplication Prevention**
   - Create `ServiceDuplicationValidator`
   - Check against all active packages during bill creation
   - Exception documentation workflow

5. **Dormancy Management**
   - Create `PackageDormancyService`
   - EOL workflow: set original package dormant
   - Reactivation workflow with audit trail

6. **Independent Termination**
   - Update termination flow to be package-specific
   - Ensure sibling packages unaffected
   - 30-day bill submission deadline per package

### Phase 3: User Interface

**Objective**: Provide intuitive UI for managing multiple packages.

#### Tasks
1. **Package Selector Component**
   - Global header component for package switching
   - Visual indicators for package type and status
   - Only shows for multi-package clients

2. **Multi-Package Dashboard**
   - Package cards with summary metrics
   - Quick navigation between packages
   - Linked package visualization

3. **Bill Creation Updates**
   - Required package selection
   - Service conflict warnings
   - Exception documentation modal

4. **Care Plan Separation**
   - Separate care plan views per package
   - Package type indicator on exports
   - Clear context in print/PDF output

5. **Timeline Updates**
   - Package filter/toggle
   - Event attribution to specific packages
   - Combined view option

6. **Statement/Reporting**
   - Per-package statement generation
   - Combined statement option
   - Clear package attribution in all reports

### Phase 4: Integration & Polish

**Objective**: Ensure external systems and edge cases handled.

#### Tasks
1. **Services Australia Integration**
   - Update PRODA sync for multiple packages
   - Test concurrent package submissions
   - Verify funding stream separation

2. **Zoho CRM Sync**
   - Update sync to handle multiple packages
   - Map package types to Zoho fields
   - Test bidirectional sync

3. **Search & Filters**
   - Update Scout indexing for package type
   - Add package type filters to lists
   - Re-enable package tags UI (interim solution)

4. **Edge Cases**
   - Cross-provider scenarios
   - Package transfer between coordinators
   - Historical package queries

5. **Performance Optimization**
   - Query optimization for multi-package lookups
   - Cache package context appropriately
   - Index optimization

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data migration breaks existing records | Low | High | Feature flag + comprehensive backup + rollback plan |
| Service duplication causes billing errors | Medium | High | Strict validation + exception workflow + audit logging |
| User confusion with package context | Medium | Medium | Clear UI indicators + training + gradual rollout |
| Services Australia rejects multi-package sync | Low | High | Pre-validate with SA API in staging + fallback workflow |
| Performance degradation with extra joins | Low | Medium | Add appropriate indexes + query optimization + caching |
| Zoho sync conflicts | Medium | Medium | Test in sandbox + careful field mapping + conflict resolution |

---

## Open Questions (From Spec)

### Care Circle Behavior
**Question**: Should care circles be shared across packages or managed separately?
**Recommendation**: Option A (shared) initially - simpler to implement, can refine later.
**Implementation**: Keep existing care circle structure, display on all packages.

### Statement/Reporting Format
**Question**: How should financial statements present multiple packages?
**Recommendation**: Option C (toggle) - gives flexibility.
**Implementation**: Default to combined view with sections, add toggle for separate statements.

### Cross-Package Timeline
**Question**: Should timeline show events from all packages or only active?
**Recommendation**: Option C (toggle) for flexibility.
**Implementation**: Default to all events with package labels, add filter toggle.

---

## Test Strategy

### Unit Tests
- PackageType enum validation
- DormancyStatus state transitions
- ServiceDuplicationValidator logic
- Package relationship integrity

### Feature Tests
- Creating second package for existing client
- Package context switching
- Bill routing to correct package
- Independent package termination
- EOL dormancy workflow
- Service duplication prevention with exception flow

### Integration Tests
- Services Australia sync with multiple packages
- Zoho CRM bidirectional sync
- Full workflow: create restorative care package → bill → terminate

### Dusk Tests
- Package selector UI interaction
- Multi-package dashboard navigation
- Bill creation with package selection

---

## Next Steps

1. **Run `/speckit.tasks`** - Generate implementation tasks from this plan
2. **Run `/trilogy.mockup`** - Create UI mockups for package selector and dashboard
3. **Review open questions** - Get stakeholder input on care circle, statements, timeline
4. **Run `/speckit.implement`** - Start development with Phase 1

---

## Related Documentation

- **Spec**: [spec.md](spec.md)
- **Meeting Transcript**: `/.claude/INITIATIVES/urgent-need-for-two-packages-for-one-client-in-portal-2fac6f4e-746b.pdf`
- **Package Model**: `domain/Package/Models/Package.php`
- **Budget Domain**: `domain/Budget/`
- **Need Domain**: `domain/Need/`
