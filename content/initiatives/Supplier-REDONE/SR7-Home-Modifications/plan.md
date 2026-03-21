---
title: "Technical Plan: Home Modifications"
---

# Technical Plan: Home Modifications

**Epic Code**: SR7
**Feature Branch**: `sr7-home-modifications`
**Created**: 2026-03-19
**Author**: Claude (technical plan)
**Dependencies**: SR0 (API Foundation), SR4 (Billing & Invoicing), SR6 (Assessments & Products)

**Product Category**: Home Modifications maps to a **dedicated "Home modifications" category** in the SR6 `product_categories` table — it is NOT the same as "Home maintenance". Home maintenance covers products/consumables; Home modifications covers project-based structural work with quotes, milestones, and staged payments managed through this SR7 lifecycle. The SR6 taxonomy has been expanded from 9 to 10 categories to accommodate this distinction.

---

## 1. Architecture Overview

SR7 adds a home modification project lifecycle to the Supplier REDONE platform. The architecture follows the established SR pattern: Laravel 12 API (PHP 8.4) serving a standalone React (Next.js 16) frontend via versioned JSON endpoints (`/api/v2/`).

### System Boundaries

```
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│  Supplier Portal (Next.js 16)   │     │  TC Portal (Laravel + Vue)      │
│  React 19 + shadcn/ui + TW v4   │     │  Inertia v2 + Vue 3 + TW v3    │
│                                  │     │                                  │
│  Supplier-side views:            │     │  TC-side views (Care Partner):   │
│  - Quote submission form         │     │  - Client Home Mods tab          │
│  - Home Modifications tab        │     │  - Project detail page           │
│  - Project detail (read-only)    │     │  - Stage transitions             │
│  - Photo uploads                 │     │  - Payment processing            │
│  - Document uploads              │     │  - Quote acceptance              │
└──────────────┬───────────────────┘     └──────────────┬───────────────────┘
               │                                        │
               │          ┌──────────────────┐          │
               └──────────┤  Laravel API v2   ├──────────┘
                          │  (JSON endpoints) │
                          └────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │        MySQL Database        │
                    │  + S3 (photos & documents)   │
                    └─────────────────────────────┘
```

**Key architectural decision**: The project detail page exists in BOTH portals. The supplier portal shows a read-only project view (with upload capabilities for photos and documents). The TC Portal shows the full management view (lifecycle transitions, payment processing, quote acceptance). The API serves both — role-based scoping determines what actions are available.

---

## 2. Data Model

### New Tables

#### `home_modification_projects`

The central entity. One project per quote-acceptance cycle.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | Auto-increment |
| `uuid` | `char(36)` UNIQUE | Public identifier for API |
| `client_id` | `bigint unsigned` FK | Links to `clients.id` |
| `supplier_id` | `bigint unsigned` FK | The supplier entity (Tier 2) that owns the project |
| `parent_project_id` | `bigint unsigned` FK nullable | Self-referential — null for top-level, set for child projects |
| `accepted_quote_id` | `bigint unsigned` FK nullable | The quote that was explicitly accepted (null until Quoted stage) |
| `inclusion_id` | `bigint unsigned` FK nullable | Auto-linked on approval (FR-013) |
| `budget_line_item_id` | `bigint unsigned` FK nullable | Auto-linked on approval (FR-013) |
| `title` | `string(255)` | Project name (e.g., "Bathroom Safety Rails") |
| `description` | `text` | Scope of work from the accepted quote |
| `stage` | `string(30)` | Current lifecycle stage. Valid: `new`, `quoted`, `documents_received`, `under_review`, `escalated`, `approved`, `rejected`, `completed` |
| `client_state` | `string(10)` | Snapshot of client's state/territory at project creation — used for doc matrix lookup (edge case: client moves interstate) |
| `escalation_reason` | `text` nullable | Required when stage = `escalated` (FR-018) |
| `rejection_reason` | `text` nullable | Required when stage = `rejected` |
| `quote_total_cents` | `bigint` | Copied from accepted quote total on acceptance (immutable reference for instalment validation) |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

**PHPDoc on model**: `stage` — lifecycle position, set via `TransitionProjectStage` action only. `client_state` — snapshotted at creation, determines doc matrix requirements, can be manually overridden by coordinator. `quote_total_cents` — frozen at quote acceptance, never changes; instalment validation compares against this.

#### `home_modification_quotes`

Supplier-submitted quotes. Multiple per project (for comparison). One is explicitly accepted.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `uuid` | `char(36)` UNIQUE | |
| `project_id` | `bigint unsigned` FK | Links to `home_modification_projects.id` |
| `supplier_id` | `bigint unsigned` FK | The supplier entity that submitted this quote |
| `description` | `text` | Proposed scope of work |
| `total_cents` | `bigint` | Sum of line items (calculated, stored for query performance) |
| `status` | `string(20)` | `pending`, `accepted`, `rejected` |
| `submitted_by` | `bigint unsigned` FK | User who submitted |
| `accepted_by` | `bigint unsigned` FK nullable | Care Partner/coordinator who accepted |
| `accepted_at` | `timestamp` nullable | |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

#### `home_modification_quote_items`

Itemised cost breakdown within a quote.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `quote_id` | `bigint unsigned` FK | |
| `description` | `string(255)` | Line item description |
| `amount_cents` | `bigint` | Cost in cents |
| `sort_order` | `smallint unsigned` | Display order |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

#### `home_modification_stage_transitions`

Full audit trail for every stage change (FR-004).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `project_id` | `bigint unsigned` FK | |
| `from_stage` | `string(30)` nullable | Null for initial creation |
| `to_stage` | `string(30)` | |
| `transitioned_by` | `bigint unsigned` FK | User who made the change |
| `notes` | `text` nullable | Mandatory for Escalated and Rejected |
| `created_at` | `timestamp` | |

#### `documentation_matrix_entries`

Configurable Boolean matrix: document types x states (FR-005). Managed via Nova (FR-016).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `document_type_id` | `bigint unsigned` FK | Links to `home_modification_document_types.id` |
| `state_code` | `string(10)` | Australian state/territory code: NSW, QLD, VIC, SA, WA, TAS, NT, ACT |
| `is_required` | `boolean` | The Boolean flag — true = required for this state |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

**Unique constraint**: `(document_type_id, state_code)` — one entry per document type per state.

#### `home_modification_document_types`

Master list of document types (e.g., "OT Assessment Report", "Council Approval"). Managed via Nova.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `name` | `string(255)` | Display name |
| `description` | `text` nullable | Guidance text for uploaders |
| `is_active` | `boolean` | Soft-disable without deletion |
| `sort_order` | `smallint unsigned` | Display order in checklist |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

#### `home_modification_documents`

Uploaded documents linked to a project and document type.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `project_id` | `bigint unsigned` FK | |
| `document_type_id` | `bigint unsigned` FK | |
| `file_path` | `string(500)` | S3 path |
| `file_name` | `string(255)` | Original filename |
| `file_size` | `bigint unsigned` | Bytes |
| `mime_type` | `string(100)` | |
| `uploaded_by` | `bigint unsigned` FK | |
| `created_at` | `timestamp` | |

#### `home_modification_instalments`

Payment instalment tracking (FR-007).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `uuid` | `char(36)` UNIQUE | |
| `project_id` | `bigint unsigned` FK | |
| `milestone` | `string(30)` | `deposit`, `progress`, `completion` |
| `amount_cents` | `bigint` | |
| `status` | `string(20)` | `pending`, `approved`, `rejected` |
| `budget_draw_reference` | `string(100)` nullable | Reference to the budget consumption record |
| `notes` | `text` nullable | |
| `submitted_by` | `bigint unsigned` FK | |
| `approved_by` | `bigint unsigned` FK nullable | |
| `approved_at` | `timestamp` nullable | |
| `created_at` | `timestamp` | |
| `updated_at` | `timestamp` | |

#### `home_modification_photos`

Photo evidence linked to milestones (FR-010).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigint unsigned` PK | |
| `project_id` | `bigint unsigned` FK | |
| `milestone` | `string(30)` | `deposit`, `progress`, `completion` |
| `file_path` | `string(500)` | S3 path |
| `file_name` | `string(255)` | Original filename |
| `file_size` | `bigint unsigned` | Bytes |
| `mime_type` | `string(100)` | |
| `caption` | `string(255)` nullable | Optional description |
| `uploaded_by` | `bigint unsigned` FK | |
| `created_at` | `timestamp` | |

### Relationships

```
HomeModificationProject
├── belongsTo Client
├── belongsTo Supplier
├── belongsTo HomeModificationProject (parent, nullable)
├── hasMany HomeModificationProject (children)
├── hasMany HomeModificationQuote
├── belongsTo HomeModificationQuote (acceptedQuote, nullable)
├── hasMany HomeModificationStageTransition
├── hasMany HomeModificationDocument
├── hasMany HomeModificationInstalment
├── hasMany HomeModificationPhoto
├── belongsTo Inclusion (nullable)
└── belongsTo PackageBudgetItem (nullable)

HomeModificationQuote
├── belongsTo HomeModificationProject
├── belongsTo Supplier
├── hasMany HomeModificationQuoteItem
├── belongsTo User (submittedBy)
└── belongsTo User (acceptedBy, nullable)

DocumentationMatrixEntry
├── belongsTo HomeModificationDocumentType
```

### Enums

```php
// app/Enums/HomeModificationStage.php
enum HomeModificationStage: string
{
    case NEW = 'new';
    case QUOTED = 'quoted';
    case DOCUMENTS_RECEIVED = 'documents_received';
    case UNDER_REVIEW = 'under_review';
    case ESCALATED = 'escalated';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case COMPLETED = 'completed';
}

// app/Enums/HomeModificationMilestone.php
enum HomeModificationMilestone: string
{
    case DEPOSIT = 'deposit';
    case PROGRESS = 'progress';
    case COMPLETION = 'completion';
}

// app/Enums/HomeModificationQuoteStatus.php
enum HomeModificationQuoteStatus: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';
}

// app/Enums/HomeModificationInstalmentStatus.php
enum HomeModificationInstalmentStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
```

All enum cases use SCREAMING_SNAKE_CASE. Each enum gets a `toData(): array` method returning `{ label, colour }` for badge rendering in tables.

### Model Constants

```php
// HomeModificationProject
/** Maximum number of child projects per parent */
public const MAX_CHILDREN = 20;

/** Stage transition rules — maps from_stage to allowed to_stages */
public const STAGE_TRANSITIONS = [...]; // defined in TransitionProjectStage action

// HomeModificationDocumentType
/** Seeded document type IDs referenced in code */
public const ID_OT_ASSESSMENT_REPORT = 1;
public const ID_QUOTE_SCOPE_OF_WORKS = 2;
// ... etc — all referenced by constant, never magic number
```

---

## 3. API Endpoints

All endpoints are under `/api/v2/` with Sanctum token auth (SR0 foundation). Supplier-scoped endpoints use the active supplier context from the token (SR0 Story 4).

### Supplier-Side Endpoints (Supplier Portal)

| Method | Endpoint | Action | Auth |
|--------|----------|--------|------|
| `GET` | `/api/v2/home-modifications` | List projects for active supplier entity | Supplier Admin, Supplier, Team Member |
| `GET` | `/api/v2/home-modifications/{project:uuid}` | Project detail | Supplier (own projects only) |
| `POST` | `/api/v2/home-modifications/quotes` | Submit a new quote | Supplier Admin, Supplier |
| `GET` | `/api/v2/home-modifications/quotes` | List quotes for active supplier entity | Supplier Admin, Supplier, Team Member |
| `POST` | `/api/v2/home-modifications/{project:uuid}/documents` | Upload document | Supplier Admin, Supplier |
| `POST` | `/api/v2/home-modifications/{project:uuid}/photos` | Upload photos | Supplier Admin, Supplier |
| `GET` | `/api/v2/home-modifications/{project:uuid}/photos` | List photos | Supplier (own projects only) |
| `POST` | `/api/v2/uploads/presigned-url` | Get presigned S3 URL for direct upload | Supplier Admin, Supplier |

### TC-Side Endpoints (TC Portal / API)

| Method | Endpoint | Action | Auth |
|--------|----------|--------|------|
| `GET` | `/api/v2/clients/{client}/home-modifications` | List projects for a client | Care Partner, Coordinator |
| `GET` | `/api/v2/clients/{client}/home-modifications/{project:uuid}` | Full project detail | Care Partner, Coordinator |
| `POST` | `/api/v2/clients/{client}/home-modifications/{project:uuid}/accept-quote` | Accept a quote (New -> Quoted) | Care Partner, Coordinator |
| `POST` | `/api/v2/clients/{client}/home-modifications/{project:uuid}/transition` | Advance/reject/escalate stage | Care Partner, Coordinator |
| `POST` | `/api/v2/clients/{client}/home-modifications/{project:uuid}/instalments` | Create payment instalment | Care Partner, Coordinator |
| `PATCH` | `/api/v2/clients/{client}/home-modifications/{project:uuid}/instalments/{instalment:uuid}` | Approve/reject instalment | Care Partner, Coordinator |
| `POST` | `/api/v2/clients/{client}/home-modifications/{project:uuid}/children` | Create child sub-project | Coordinator |
| `GET` | `/api/v2/home-modifications/document-types` | List document types (for matrix display) | Any authenticated |
| `GET` | `/api/v2/home-modifications/documentation-matrix/{stateCode}` | Get required docs for a state | Any authenticated |

### Response Shapes

All responses follow the SR0 envelope format: `{ data, meta?, links? }`.

**Project detail response** (key shape — used by both portals):

```json
{
  "data": {
    "uuid": "abc-123",
    "title": "Bathroom Safety Rails",
    "description": "Install safety grab rails...",
    "stage": { "value": "approved", "label": "Approved", "colour": "green" },
    "client": { "id": 42, "name": "Robert Nguyen", "state": "NSW" },
    "supplier": { "id": 7, "name": "SafeHome Co" },
    "accepted_quote": {
      "uuid": "def-456",
      "total_cents": 420000,
      "items": [
        { "description": "Safety grab rails (x4)", "amount_cents": 80000, "sort_order": 1 }
      ]
    },
    "parent_project_uuid": null,
    "children_summary": { "total": 0, "completed": 0 },
    "document_checklist": {
      "state_code": "NSW",
      "required_count": 5,
      "uploaded_count": 4,
      "items": [
        { "document_type_id": 1, "name": "OT Assessment Report", "uploaded": true, "uploaded_at": "2026-03-10T..." }
      ]
    },
    "instalments": {
      "total_paid_cents": 252000,
      "remaining_cents": 168000,
      "items": [
        { "uuid": "ghi-789", "milestone": "deposit", "amount_cents": 126000, "status": "approved" }
      ]
    },
    "photo_counts": { "deposit": 2, "progress": 4, "completion": 0 },
    "stage_history": [
      { "from_stage": "under_review", "to_stage": "approved", "by": "J. Park", "at": "2026-03-15T...", "notes": "All docs verified" }
    ],
    "budget_linkage": {
      "inclusion_name": "Home Modifications",
      "budget_total_cents": 1500000,
      "budget_used_cents": 680000
    },
    "created_at": "2026-03-01T...",
    "updated_at": "2026-03-15T..."
  }
}
```

---

## 4. Backend Implementation

### Actions (Lorisleiva `AsAction`)

Each action has `authorize()` for auth checks (returning `Response::allow()` / `Response::deny()`), `rules()` for validation via Laravel Data, and `handle()` for business logic.

| Action | Responsibility | FR |
|--------|---------------|-----|
| `SubmitHomeModificationQuote` | Creates quote + project in "New" stage. Validates client linkage, at least one line item, total > 0. Records initial stage transition. | FR-001 |
| `AcceptHomeModificationQuote` | TC-side. Accepts a quote, sets project stage to "Quoted", freezes `quote_total_cents`, rejects other pending quotes on the project. | FR-021 |
| `TransitionProjectStage` | Validates transition is allowed from current stage. Enforces prerequisites per stage (docs complete for Documents Received, completion photos for Completed). Records audit trail. Sends notifications. | FR-002, FR-003, FR-004, FR-020 |
| `UploadProjectDocument` | Validates file integrity (mime type, size, not corrupt). Links to project + document type. Checks document type is in the matrix for the project's state. | FR-006, FR-010 |
| `CreatePaymentInstalment` | Validates amount does not exceed remaining quote balance (FR-008). Validates budget availability via SR4/SR6 budget service (FR-009). Records milestone type. | FR-007, FR-008, FR-009 |
| `ApprovePaymentInstalment` | Marks instalment approved. Draws down from linked budget line item (FR-014). | FR-014 |
| `UploadProjectPhotos` | Validates file integrity (image mime types, max size). Links to project + milestone. | FR-010 |
| `CreateChildProject` | Creates a child project linked to parent. Validates parent exists and is not itself a child. | FR-012 |
| `LinkProjectToBudget` | Auto-links project to client's home modification inclusion and budget line item on approval. Validates inclusion exists and budget has sufficient funds. | FR-013 |
| `GetDocumentationMatrix` | Returns required documents for a given state code. Used by both portals to render the checklist. | FR-005 |

### Stage Transition Rules

The `TransitionProjectStage` action enforces this state machine:

```
new           → quoted                 (requires: accepted_quote_id set)
quoted        → documents_received     (requires: all state-required docs uploaded)
documents_received → under_review      (no prerequisites)
under_review  → escalated              (requires: escalation_reason)
under_review  → approved               (no prerequisites beyond auth)
escalated     → approved               (no prerequisites beyond auth)
escalated     → rejected               (requires: rejection_reason)
under_review  → rejected               (requires: rejection_reason)
approved      → completed              (requires: completion photos uploaded, all instalments resolved)
```

Transition rules are defined as a constant map on `HomeModificationProject`, not hardcoded in the action. The action reads the map, validates prerequisites, and records the audit trail.

### Laravel Data Classes

All anemic — properties and type casting only. No business logic.

| Data Class | Purpose |
|------------|---------|
| `SubmitQuoteData` | Validates quote submission: `client_id`, `description`, `items[]` (each with `description`, `amount_cents`). Uses `#[MapName(SnakeCaseMapper::class)]`. |
| `AcceptQuoteData` | Validates: `quote_uuid`. |
| `TransitionStageData` | Validates: `to_stage` (enum), `notes` (required when target is `escalated` or `rejected`). |
| `CreateInstalmentData` | Validates: `milestone` (enum), `amount_cents`, `notes`. |
| `UploadDocumentData` | Validates: `document_type_id`, file metadata. |
| `UploadPhotosData` | Validates: `milestone` (enum), file metadata array. |
| `CreateChildProjectData` | Validates: `title`, `description`. |

### Policies

One policy per model with granular permissions. All return `Response::allow()` / `Response::deny('reason')`.

| Policy | Key Gates |
|--------|-----------|
| `HomeModificationProjectPolicy` | `view` — supplier sees own entity projects; CP/coordinator sees client projects. `transition` — TC staff only. `createChild` — coordinator only. |
| `HomeModificationQuotePolicy` | `create` — supplier admin/supplier only. `accept` — CP/coordinator only. |
| `HomeModificationInstalmentPolicy` | `create` — CP/coordinator only. `approve` — CP/coordinator only. |
| `HomeModificationDocumentPolicy` | `upload` — supplier (own projects) + CP/coordinator. |
| `HomeModificationPhotoPolicy` | `upload` — supplier (own projects). `view` — supplier + CP/coordinator. |

### Notifications (FR-020)

Using the existing portal notification system (in-app). Each notification class implements `ShouldQueue`.

| Notification | Trigger | Recipients |
|-------------|---------|------------|
| `QuoteSubmittedNotification` | Quote saved | Client's Care Partner + assigned coordinator |
| `DocumentsUploadedNotification` | Document uploaded | Client's Care Partner + assigned coordinator |
| `StageTransitionNotification` | Any stage change | Supplier (for TC-initiated transitions), TC staff (for supplier-initiated actions) |
| `CompletionPhotosUploadedNotification` | Completion photos uploaded | Client's Care Partner + assigned coordinator |

### Nova Resources (FR-016)

Two Nova resources for documentation matrix administration:

| Resource | Model | Fields |
|----------|-------|--------|
| `HomeModificationDocumentType` | `HomeModificationDocumentType` | `name`, `description`, `is_active`, `sort_order` |
| `DocumentationMatrixEntry` | `DocumentationMatrixEntry` | `document_type` (BelongsTo), `state_code` (Select — 8 AU states), `is_required` (Boolean) |

The `DocumentationMatrixEntry` Nova resource renders as a filterable table — filter by state to see all document requirements for that state. Inline editing for the `is_required` Boolean makes updates fast (SC-008: under 2 minutes).

### Feature Flag

```php
// app/Features/HomeModifications.php
class HomeModifications
{
    // Dual-gated: backend middleware + frontend HasFeatureFlag component
    // Pennant scope: organisation-level rollout
}
```

Backend: route middleware `check.feature.flag:HomeModifications` on all home modification routes.
Frontend: `HasFeatureFlag` component wraps the Home Modifications tab in both portals.

---

## 5. Frontend Implementation — Supplier Portal (Next.js)

### Directory Structure

```
src/
├── app/
│   └── (authenticated)/
│       └── home-modifications/
│           ├── page.tsx                    # Project list (Story 8)
│           └── [projectUuid]/
│               └── page.tsx               # Project detail (read-only + uploads)
├── components/
│   ├── home-modifications/
│   │   ├── ProjectList/
│   │   │   ├── ProjectList.tsx            # Parent: data fetching, orchestration
│   │   │   ├── ProjectRow.tsx             # Single project row
│   │   │   ├── ParentProjectRow.tsx       # Parent with child aggregation
│   │   │   └── EmptyState.tsx             # No projects message
│   │   ├── ProjectDetail/
│   │   │   ├── ProjectDetail.tsx          # Parent: layout + data
│   │   │   ├── LifecycleStepper.tsx       # 8-stage stepper with branch paths
│   │   │   ├── StageHistory.tsx           # Vertical timeline of transitions
│   │   │   ├── DocumentChecklist.tsx      # State-specific doc checklist
│   │   │   ├── InstalmentTracker.tsx      # Payment instalment table
│   │   │   └── PhotoGallery.tsx           # Milestone-grouped gallery + lightbox
│   │   ├── QuoteForm/
│   │   │   ├── QuoteForm.tsx              # Parent: form state
│   │   │   ├── ClientSearch.tsx           # Client search input
│   │   │   └── LineItemsTable.tsx         # Editable line items + auto-total
│   │   └── shared/
│   │       ├── StageBadge.tsx             # Stage badge with colour mapping
│   │       └── PaymentProgress.tsx        # Progress bar for payment %
│   └── ui/                                # shadcn/ui components (existing)
├── lib/
│   ├── api/
│   │   └── home-modifications.ts          # API client functions
│   └── types/
│       └── home-modifications.ts          # All shared TypeScript types
```

### TypeScript Types

All types live in `src/lib/types/home-modifications.ts`. No types exported from `.tsx` files.

```typescript
// src/lib/types/home-modifications.ts

type HomeModificationStage =
  | 'new'
  | 'quoted'
  | 'documents_received'
  | 'under_review'
  | 'escalated'
  | 'approved'
  | 'rejected'
  | 'completed'

type HomeModificationMilestone = 'deposit' | 'progress' | 'completion'

type QuoteStatus = 'pending' | 'accepted' | 'rejected'
type InstalmentStatus = 'pending' | 'approved' | 'rejected'

type StageBadgeData = {
  value: HomeModificationStage
  label: string
  colour: string
}

type HomeModificationProject = {
  uuid: string
  title: string
  description: string
  stage: StageBadgeData
  client: { id: number; name: string; state: string }
  supplier: { id: number; name: string }
  acceptedQuote: Quote | null
  parentProjectUuid: string | null
  childrenSummary: { total: number; completed: number }
  documentChecklist: DocumentChecklist
  instalments: InstalmentSummary
  photoCounts: Record<HomeModificationMilestone, number>
  stageHistory: StageTransition[]
  budgetLinkage: BudgetLinkage | null
  createdAt: string
  updatedAt: string
}

type Quote = {
  uuid: string
  totalCents: number
  description: string
  items: QuoteItem[]
  status: QuoteStatus
  submittedBy: string
  createdAt: string
}

type QuoteItem = {
  description: string
  amountCents: number
  sortOrder: number
}

type DocumentChecklist = {
  stateCode: string
  requiredCount: number
  uploadedCount: number
  items: DocumentChecklistItem[]
}

type DocumentChecklistItem = {
  documentTypeId: number
  name: string
  uploaded: boolean
  uploadedAt: string | null
}

type InstalmentSummary = {
  totalPaidCents: number
  remainingCents: number
  items: Instalment[]
}

type Instalment = {
  uuid: string
  milestone: HomeModificationMilestone
  amountCents: number
  status: InstalmentStatus
  notes: string | null
  createdAt: string
}

type StageTransition = {
  fromStage: HomeModificationStage | null
  toStage: HomeModificationStage
  by: string
  at: string
  notes: string | null
}

type BudgetLinkage = {
  inclusionName: string
  budgetTotalCents: number
  budgetUsedCents: number
}

type ProjectPhoto = {
  id: number
  milestone: HomeModificationMilestone
  filePath: string
  fileName: string
  caption: string | null
  uploadedBy: string
  createdAt: string
}
```

### Component Specifications

#### ProjectList.tsx
- Props: `defineProps<Props>()` equivalent — receives data from server component fetch
- Renders: `Table` (shadcn) with `ProjectRow` and `ParentProjectRow` sub-components
- Tabs: Active / Completed filter (local state)
- Common components reused: `Table`, `Badge`, `Tabs` (all shadcn/ui)
- Empty state: `EmptyState.tsx` with CTA to submit first quote

#### ProjectDetail.tsx
- Props: `project: HomeModificationProject`, `photos: ProjectPhoto[]`
- Parent component: owns data, passes sections to sub-components
- Sub-components: `LifecycleStepper`, `StageHistory`, `DocumentChecklist`, `InstalmentTracker`, `PhotoGallery`
- Each sub-component receives typed props, emits no events (supplier view is mostly read-only; uploads use direct API calls)

#### LifecycleStepper.tsx
- Props: `currentStage: HomeModificationStage`, `stageHistory: StageTransition[]`
- Renders: 8-stage horizontal stepper. Happy path is linear. Escalated/Rejected branch off from Under Review as a visual offshoot below the main path
- Common components: none needed — this is a bespoke domain-specific component. Not eligible for Common because the branching lifecycle is unique to home modifications
- No boolean prop branching — the stepper always renders all 8 stages; completed/current/upcoming is determined by position relative to `currentStage`

#### DocumentChecklist.tsx
- Props: `checklist: DocumentChecklist`, `projectUuid: string`
- Renders: checklist items with uploaded/missing indicators, progress bar, upload button
- Upload action: calls `POST /api/v2/home-modifications/{project}/documents` via presigned URL flow
- Common components: `Card`, `Progress`, `Button` (shadcn)
- File validation: checks mime type + file size client-side before uploading

#### InstalmentTracker.tsx
- Props: `instalments: InstalmentSummary`, `quoteTotalCents: number`
- Renders: instalment table + progress bars (quote payment progress, budget utilisation)
- Read-only in supplier portal (suppliers cannot create instalments)
- Common components: `Table`, `Progress`, `Badge` (shadcn)

#### PhotoGallery.tsx
- Props: `photos: ProjectPhoto[]`, `projectUuid: string`, `canUpload: boolean`
- Renders: milestone-grouped thumbnail grid. Click opens lightbox (using `yet-another-react-lightbox` library per design decision CLR-UIQ2)
- Upload: presigned URL flow for direct-to-S3
- File validation: image mime types only, max file size, integrity check
- Common components: `Card`, `Button`, `Dialog` (shadcn)
- Common eligibility: bespoke — milestone-grouped photo gallery is domain-specific

#### QuoteForm.tsx
- Props: none (new quote form)
- Form state: React Hook Form with Zod validation (Next.js pattern — no `useForm` from Inertia since this is React)
- Zod schema validates: client selected, description non-empty, at least one line item, all amounts > 0
- Sub-components: `ClientSearch` (async search input), `LineItemsTable` (editable rows with add/remove + auto-total)
- Common components: `Input`, `Textarea`, `Button`, `Card` (shadcn)

#### StageBadge.tsx
- Props: `stage: StageBadgeData`
- Renders: shadcn `Badge` with colour variant mapped from stage
- Common eligibility: kept bespoke — colour mapping is domain-specific to home modification stages

---

## 6. Frontend Implementation — TC Portal (Vue 3 + Inertia)

The TC Portal provides the management view. These are Inertia pages served by Laravel controllers.

### Directory Structure

```
resources/js/
├── Pages/
│   └── HomeModifications/
│       ├── Index.vue                        # Client Home Mods tab content
│       └── Show.vue                         # Project detail page (full management)
├── Components/
│   └── HomeModifications/
│       ├── ProjectList/
│       │   ├── ProjectListTable.vue         # Parent: table rendering
│       │   ├── ProjectRow.vue               # Row with stage badge, paid %
│       │   └── ParentProjectRow.vue         # Aggregated parent row
│       ├── ProjectDetail/
│       │   ├── ProjectDetail.vue            # Parent: layout + orchestration
│       │   ├── LifecycleStepper.vue         # 8-stage stepper with branch paths
│       │   ├── StageHistory.vue             # Vertical audit timeline
│       │   ├── StageTransitionDialog.vue    # Confirmation dialog for transitions
│       │   ├── DocumentChecklist.vue        # State-specific checklist + upload
│       │   ├── InstalmentTracker.vue        # Payment table + add instalment form
│       │   ├── InstalmentForm.vue           # Add instalment form (inline)
│       │   ├── PhotoGallery.vue             # Milestone-grouped gallery
│       │   └── QuoteComparison.vue          # Ranked list of quotes with accept CTA
│       └── Shared/
│           ├── StageBadge.vue               # Stage badge with colour mapping
│           └── PaymentProgress.vue          # Progress bar for payment %
├── types/
│   └── HomeModifications/
│       └── homeModifications.ts             # All shared types for this feature
```

### Vue Component Specifications

All components use `<script setup lang="ts">`. Props use `type Props = { ... }` with `defineProps<Props>()`. Emits use `type Emits = { ... }` with `defineEmits<Emits>()`. No `any` types. No `interface` for props/emits.

#### Show.vue (Project Detail Page)
- Props: `defineProps<Props>()`:
  - `project: HomeModificationProjectData` (from Inertia server-side)
  - `photos: ProjectPhotoData[]`
  - `availableTransitions: HomeModificationStage[]` (computed server-side based on current stage + prerequisites)
- Emits: none (page-level component)
- Sub-components: `ProjectDetail.vue` receives all data, delegates to section sub-components
- Common components reused: `CommonBreadcrumb` for navigation (Client > Parent Project > Child Project)

#### StageTransitionDialog.vue
- Props: `defineProps<Props>()`:
  - `targetStage: HomeModificationStage`
  - `requiresNotes: boolean` (true for Escalated, Rejected)
- Emits: `defineEmits<Emits>()`:
  - `(e: 'confirm', data: { toStage: HomeModificationStage; notes: string }): void`
  - `(e: 'cancel'): void`
- Form state: single `useForm` with `to_stage` and `notes` fields
- Zod validation: notes required when `requiresNotes` is true
- Common components: `CommonDialog`, `CommonTextarea`, `CommonButton`

#### InstalmentForm.vue
- Props: `defineProps<Props>()`:
  - `projectUuid: string`
  - `remainingCents: number`
  - `budgetAvailableCents: number`
- Emits: `defineEmits<Emits>()`:
  - `(e: 'created'): void`
- Form state: `useForm` with `milestone`, `amount_cents`, `notes`
- Zod validation per step: amount > 0, amount <= remainingCents, milestone selected
- Common components: `CommonSelectMenu` (with `value-key="value"` for enum values), `CommonInput`, `CommonButton`

#### QuoteComparison.vue
- Props: `defineProps<Props>()`:
  - `quotes: QuoteData[]`
  - `projectUuid: string`
- Renders: ranked vertical cards (per design decision CLR-UXQ2). Each card shows supplier, total, line items, "Accept this quote" button
- Common components: `Card` layout, `CommonButton`

### Shared Types (Vue)

```typescript
// resources/js/types/HomeModifications/homeModifications.ts

type HomeModificationStage =
  | 'new'
  | 'quoted'
  | 'documents_received'
  | 'under_review'
  | 'escalated'
  | 'approved'
  | 'rejected'
  | 'completed'

type HomeModificationMilestone = 'deposit' | 'progress' | 'completion'

// ... mirrors the React types for API response shapes
// Generated types from Laravel Data classes will be used where available
// via the typescript-transformer package (existing pattern)
```

### Inertia Controllers

| Controller | Route | Method |
|-----------|-------|--------|
| `HomeModificationController@index` | `clients.home-modifications.index` | Renders `Index.vue` with client's projects |
| `HomeModificationController@show` | `clients.home-modifications.show` | Renders `Show.vue` with full project detail |

Controllers use Model route binding (no `int $id`). Data passed to Inertia via Laravel Data resources.

### Data Tables

The project list uses the CommonTable + BaseTable stack (existing pattern).

#### HomeModificationProjectTable
- Location: `app/Tables/Staff/HomeModificationProjectTable.php`
- Resource query: `HomeModificationProject::query()->with(['supplier', 'acceptedQuote', 'children'])->where('client_id', $clientId)`
- Columns: `TextColumn` (title), `TextColumn` (supplier name), `BadgeColumn` (stage), `NumericColumn` (quote total), `NumericColumn` (paid percentage), `ActionColumn` (view)
- Filters: `BadgeFilter` (stage), `TextFilter` (supplier name)
- Actions: View project detail (named route `clients.home-modifications.show`)
- Transforms: `transformModel()` formats stage as badge data via `->toData()`, money via `Money::from()`, paid percentage calculated from instalment totals
- Frontend: `CommonTable` in `Index.vue`

---

## 7. Integration Points

### SR0 — API Foundation
- All endpoints use the v2 envelope format and Sanctum token auth
- Supplier context scoping from the active supplier token
- Role hierarchy (Org Admin > Supplier Admin > Supplier > Team Member) enforced in policies

### SR4 — Billing & Invoicing
- Budget validation at instalment submission: uses the same budget availability check from SR4's bill processing pipeline
- `CreatePaymentInstalment` action calls the budget service to validate available funds before recording
- `ApprovePaymentInstalment` action draws down from the budget line item using the same budget consumption mechanism as bill approval

### SR6 — Assessments & Products
- `LinkProjectToBudget` action uses SR6's assessment-budget-supplier linkage chain to auto-identify the correct inclusion and budget line item for a client's home modification entitlement
- The linkage happens on project approval (transition to `approved` stage)

### Existing TC Portal
- Client record gains a "Home Modifications" tab (conditional on feature flag + client having any home modification projects or supplier having home modification capabilities)
- Routes registered in the existing client route group
- Navigation sidebar updated with feature flag gating

### S3 / File Storage
- Photos and documents uploaded via presigned URLs (direct-to-S3)
- File integrity validation: server-side verification after upload completes (check file headers match declared mime type, verify file is not zero-bytes or corrupt)
- Storage path convention: `home-modifications/{project_uuid}/documents/{filename}` and `home-modifications/{project_uuid}/photos/{milestone}/{filename}`

---

## 8. Testing Approach

### Feature Tests (Pest)

| Test Suite | Coverage |
|-----------|----------|
| `SubmitQuoteTest` | Quote submission with valid data, missing client, missing line items, zero total. Project created in "New" stage. Multiple quotes per project. |
| `AcceptQuoteTest` | Quote acceptance by CP/coordinator. Project transitions to "Quoted". Other quotes rejected. Non-CP user cannot accept. |
| `StageTransitionTest` | Every valid transition. Invalid transitions rejected. Prerequisites enforced (docs for Documents Received, photos for Completed). Notes required for Escalated/Rejected. Audit trail recorded. |
| `DocumentationMatrixTest` | Matrix returns correct documents per state. Matrix updates apply to new projects. Grandfathering for existing projects past doc stage. |
| `InstalmentTest` | Create instalment within quote balance. Reject instalment exceeding balance (FR-008). Budget validation (FR-009). Milestone type recorded. |
| `PhotoUploadTest` | Upload photos linked to milestone. Corrupt file rejected. Completion photos required for Completed transition. |
| `ChildProjectTest` | Create child under parent. Independent lifecycle. Parent aggregation correct. Cannot create child of a child. |
| `BudgetLinkageTest` | Auto-linkage on approval. Missing inclusion handled. Insufficient budget blocks approval. Instalment draws down from budget. |
| `PolicyTest` | Supplier sees only own entity projects. CP/coordinator sees client projects. Org Admin cross-entity visibility. Role-based action restrictions. |
| `NotificationTest` | Correct notifications sent on each trigger transition. Recipients are correct. Notifications are queued. |

### Browser Tests (Dusk)

- Quote submission end-to-end (supplier portal flow)
- Stage transition with confirmation dialog
- Document upload and checklist update
- Photo upload and gallery rendering
- Instalment creation with validation errors

---

## 9. Migrations Plan

All migrations are schema-only. No data operations.

| Order | Migration | Purpose |
|-------|-----------|---------|
| 1 | `create_home_modification_document_types_table` | Document types master list |
| 2 | `create_documentation_matrix_entries_table` | Boolean matrix: doc types x states |
| 3 | `create_home_modification_projects_table` | Central project entity with all FKs |
| 4 | `create_home_modification_quotes_table` | Supplier quotes linked to projects |
| 5 | `create_home_modification_quote_items_table` | Quote line items |
| 6 | `create_home_modification_stage_transitions_table` | Audit trail |
| 7 | `create_home_modification_documents_table` | Uploaded docs linked to project + type |
| 8 | `create_home_modification_instalments_table` | Payment instalments |
| 9 | `create_home_modification_photos_table` | Photo evidence |

Seed data for the documentation matrix (Sophie's state requirements) will be provided via a seeder — not in the migration.

---

## 10. Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| **State documentation matrix not finalised** | Cannot seed initial data or test state-specific flows | Nova admin interface allows TC staff to populate the matrix post-deployment. Seed with known NSW requirements for dev/test. |
| **Budget validation complexity** | SR4/SR6 budget service may not expose the exact API needed for instalment validation | Design the `CreatePaymentInstalment` action with a clear interface to the budget service. Mock the budget check in tests. |
| **Parent-child aggregation performance** | Querying parent status from many children on every load | Eager-load children with `->limit()`. Cache aggregate counts on the parent model (update via observer on child stage transitions). |
| **File upload integrity** | Corrupt files accepted, blocking completion transition | Client-side pre-validation (mime type, size) + server-side post-upload verification (file header check). Reject with clear error message. |
| **Two-portal consistency** | Project detail rendered in both React and Vue — risk of divergent behaviour | API is the single source of truth. Both portals consume the same response shape. Business logic lives exclusively in Laravel actions. |
| **Stage transition race conditions** | Two users transition the same project simultaneously | Optimistic locking via `updated_at` check in `TransitionProjectStage` action. Return 409 Conflict if stale. |

---

## 11. Rollback Strategy

- Feature flag (`HomeModifications`) controls visibility in both portals. Disable flag to hide the feature entirely without code deployment.
- All new tables are additive — no modifications to existing tables. Rollback is: disable flag, drop tables via reverse migrations.
- No existing models, controllers, or services are modified. Only additive changes (new routes, new nav items behind flag, new Nova resources).

---

## 12. Architecture Gate Check

**Date**: 2026-03-19
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear
- [x] Existing patterns leveraged
- [x] All requirements buildable
- [x] Performance considered
- [x] Security considered

### Data & Integration
- [x] Data model understood
- [x] API contracts clear
- [x] Dependencies identified
- [x] Integration points mapped
- [x] DTO persistence explicit (no ->toArray() into ORM)

### Implementation Approach
- [x] File changes identified
- [x] Risk areas noted
- [x] Testing approach defined
- [x] Rollback possible

### Resource & Scope
- [x] Scope matches spec
- [x] Effort reasonable
- [x] Skills available

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue (backend-powered, dynamic)
- [x] Cross-platform reusability (Vue, React, API)
- [x] Laravel Data for validation (no Request in controllers)
- [x] Model route binding (no int $id parameters)
- [x] No magic numbers/IDs (using Model constants)
- [x] Common components pure (zero hardcoded logic)
- [x] Use Lorisleiva Actions (with AsAction trait, not custom classes)
- [x] Action authorization in `authorize()` method (not in `handle()` or `asController()`)
- [x] Data classes remain anemic (no business logic in DTOs)
- [x] Migrations schema-only (data ops use Operations/Seeders)
- [x] Models have single responsibility (not overloaded with unrelated concerns)
- [x] Granular model policies (one Policy per model, scoped permissions, relationship checks for non-staff)
- [x] Response objects in auth (`Response::allow()` / `Response::deny('reason')`, no bare bool)
- [x] Event sourcing: N/A — this module uses standard Eloquent (not event-sourced)
- [x] Semantic column documentation (lifecycle/domain flags have PHPDoc definitions on the model)
- [x] Feature flags dual-gated (backend middleware + frontend `HasFeatureFlag`, sidebar conditional)

### React TypeScript Standards (Supplier Portal — Section 6 Adapted)
- [x] All React components use TypeScript (.tsx files)
- [x] Props typed with `type Props = { ... }` pattern
- [x] No `any` types planned — all backend data shapes have TypeScript types
- [x] Shared types identified in `src/lib/types/home-modifications.ts`
- [x] No types exported from component files — all shared types in `lib/types/`
- [x] shadcn/ui components reused (Table, Badge, Card, Button, Progress, Dialog, Input, Textarea, Tabs)
- [x] New components assessed for common eligibility — LifecycleStepper and PhotoGallery are domain-specific (kept bespoke)
- [x] Form state via React Hook Form + Zod (Next.js pattern, not Inertia useForm)
- [x] Composition over configuration — sub-components receive typed props, no boolean prop branching

### Vue TypeScript Standards (TC Portal)
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` (`type Props = { ... }` with `defineProps<Props>()`)
- [x] Emits use named `type` (`type Emits = { ... }` with `defineEmits<Emits>()`)
- [x] No `any` types planned — backend data shapes have TypeScript types
- [x] Shared types identified (`resources/js/types/HomeModifications/homeModifications.ts`)
- [x] Common components audited (CommonDialog, CommonTextarea, CommonButton, CommonSelectMenu, CommonInput, CommonBreadcrumb, CommonTable reused)
- [x] New components assessed for common eligibility (LifecycleStepper, PhotoGallery, QuoteComparison are domain-specific)
- [x] Multi-step wizards: N/A (InstalmentForm is single-step, uses `useForm`)
- [x] Composition over configuration (slots and composables over prop-driven conditionals)
- [x] Composables: none needed — data flows from Inertia props through parent to sub-components
- [x] Primitives are single-responsibility and independently testable
- [x] Consumer controls layout (no boolean prop branching for different render paths)
- [x] Pinia stores: none needed — all state from Inertia `usePage().props`
- [x] Type declarations: N/A — no untyped `.js` dependencies consumed

**Ready to Implement**: YES
