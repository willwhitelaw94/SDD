---
title: "Implementation Plan: Care Partner Check-Ins"
---

# Implementation Plan: Care Partner Check-Ins

**Branch**: `chk-care-partner-check-ins` | **Date**: 2026-03-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `.tc-docs/content/initiatives/Work-Management/001-CHK-Care-Partner-Check-Ins/spec.md`

## Summary

Replace Excel-based quarterly check-in tracking with a system-managed process. Care partners and coordinators get dashboard-driven visibility of overdue/today/upcoming check-ins, a structured completion form with clinical risk-based questions, failed attempt tracking, and compliance reporting. A daily cron job auto-generates check-ins, marks missed ones after 30 days, and schedules replacements. Feature-flagged via `care-partner-check-ins` for parallel running with the legacy package-date system.

## Technical Context

**Language/Version**: PHP 8.3 (Laravel 12), TypeScript (Vue 3)
**Primary Dependencies**: Inertia.js v2, Laravel Pennant (feature flags), Lorisleiva Actions, Laravel Data, maatwebsite/excel (exports)
**Storage**: MySQL
**Testing**: Pest v3 (unit + feature), Dusk v8 (browser)
**Target Platform**: Web (desktop-first)
**Performance Goals**: Dashboard loads <1s for 150 care partners, completion report handles 15,000 clients, daily cron processes ~5,000 check-ins/quarter
**Constraints**: Must coexist with legacy `int_check_in_date`/`ext_check_in_date` on packages during transition
**Scale/Scope**: ~15,000 active clients, ~150 care partners, ~5,000 check-ins per quarter

## Project Structure

### Documentation (this feature)

```text
.tc-docs/content/initiatives/Work-Management/001-CHK-Care-Partner-Check-Ins/
├── spec.md              # Feature specification
├── design.md            # Design brief (Gate 2 passed)
├── plan.md              # This file (Gate 3)
├── data-model.md        # Entity definitions and relationships
├── mockups/             # HTML/Tailwind mockup screens
└── tasks.md             # Implementation tasks (from /speckit-tasks)
```

### Source Code (repository root)

```text
# Backend
domain/CheckIn/
├── Models/
│   ├── CheckIn.php
│   ├── CheckInAttempt.php
│   ├── CheckInResponse.php
│   └── ClientCadenceSetting.php
├── Actions/
│   ├── CompleteCheckInAction.php
│   ├── LogCheckInAttemptAction.php
│   ├── CreateAdHocCheckInAction.php
│   ├── CancelCheckInAction.php
│   └── GenerateCheckInsAction.php
├── Data/
│   ├── CheckInData.php
│   ├── CheckInIndexData.php
│   ├── CompleteCheckInData.php
│   ├── LogAttemptData.php
│   ├── CreateAdHocCheckInData.php
│   ├── CancelCheckInData.php
│   ├── CheckInResponseData.php
│   └── CompletionReportFilterData.php
├── Enums/
│   ├── CheckInStatusEnum.php       # #[Label] #[Colour] attributes, cast on CheckIn
│   ├── CheckInTypeEnum.php         # #[Label] attributes, cast on CheckIn
│   ├── AttemptReasonEnum.php       # #[Label] attributes, cast on CheckInAttempt
│   └── AnswerTypeEnum.php          # #[Label] attributes, cast on RiskCheckInQuestion
└── Policies/
    └── CheckInPolicy.php

domain/Risk/Models/
└── RiskCheckInQuestion.php      # New model on existing Risk domain

app/Http/Controllers/Staff/CheckIn/
├── CheckInController.php        # Dashboard data + show/complete
├── CheckInAttemptController.php # Failed attempt logging
├── CheckInReportController.php  # Completion report + export
└── AdHocCheckInController.php   # Ad-hoc creation

app/Http/Controllers/Staff/CheckIn/
└── RiskCheckInQuestionController.php  # Clinical question CRUD (controller in CheckIn domain, model in Risk domain)

app/Jobs/
├── ProcessCheckInsJob.php       # Daily cron: generate + mark missed
└── CheckInNotificationJob.php   # Replaced notification job

app/Exports/
└── CheckInCompletionExport.php  # maatwebsite/excel export

# Frontend
resources/js/Pages/Staff/CheckIns/
├── Show.vue                     # Completion page (two-column)
└── Report.vue                   # Completion report (KPIs + table)

resources/js/Pages/Packages/tabs/
└── PackageCheckInQuestions.vue      # New tab on PackageViewLayout (alongside PackageRisks, etc.)

resources/js/types/
└── check-in.d.ts                # Shared TypeScript types

# Database
database/migrations/
├── xxxx_create_check_ins_table.php
├── xxxx_create_check_in_attempts_table.php
├── xxxx_create_risk_check_in_questions_table.php
├── xxxx_create_check_in_responses_table.php
└── xxxx_create_client_cadence_settings_table.php

# Tests
tests/Unit/CheckIn/
├── Models/CheckInTest.php
├── Models/CheckInAttemptTest.php
├── Actions/CompleteCheckInActionTest.php
├── Actions/GenerateCheckInsActionTest.php
└── Actions/LogCheckInAttemptActionTest.php

tests/Feature/CheckIn/
├── Http/Controllers/CheckInControllerTest.php
├── Http/Controllers/CheckInReportControllerTest.php
├── Http/Controllers/AdHocCheckInControllerTest.php
└── Http/Controllers/RiskCheckInQuestionControllerTest.php

tests/Feature/CheckIn/
└── Jobs/ProcessCheckInsJobTest.php
```

---

## Data Model

### CheckIn

The core entity representing a scheduled or ad-hoc client engagement.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigIncrements` | Primary key |
| `client_id` | `foreignId` | `->constrained('packages_clients')->nullOnDelete()` |
| `package_id` | `foreignId` | `->constrained('packages')->nullOnDelete()` — primary package |
| `assigned_user_id` | `foreignId->nullable()` | `->constrained('users')->nullOnDelete()` — care partner or coordinator |
| `type` | `string(20)` | `internal`, `external`, `ad_hoc` — comment documents valid values |
| `status` | `string(20)` | `pending`, `in_progress`, `completed`, `missed`, `cancelled` |
| `due_date` | `date` | When the check-in is due |
| `completed_at` | `datetime->nullable()` | When submitted. NULL until completed |
| `completed_by_id` | `foreignId->nullable()` | `->constrained('users')->nullOnDelete()` |
| `wellbeing_rating` | `unsignedTinyInteger->nullable()` | 1-5 scale. NULL until completed |
| `summary_notes` | `text->nullable()` | Free-text call summary |
| `follow_up_actions` | `text->nullable()` | Free-text follow-up notes |
| `previous_summary` | `text->nullable()` | Snapshot of previous check-in summary at generation time |
| `cancellation_reason` | `string(255)->nullable()` | Mandatory when status = cancelled |
| `cancelled_at` | `datetime->nullable()` | When cancelled |
| `cancelled_by_id` | `foreignId->nullable()` | `->constrained('users')->nullOnDelete()` |
| `is_flagged` | `boolean->default(false)` | True when 3+ failed attempts |
| `created_at` / `updated_at` | `timestamps` | Standard timestamps |

**Relationships:**
- `client()` → BelongsTo PackagesClient
- `package()` → BelongsTo Package
- `assignedUser()` → BelongsTo User
- `completedBy()` → BelongsTo User
- `cancelledBy()` → BelongsTo User
- `attempts()` → HasMany CheckInAttempt
- `responses()` → HasMany CheckInResponse

**Lifecycle states:**
```
[*] → Pending → InProgress → Completed → [*]
                               ↓
Pending → Missed → [*] (auto, 30 days overdue)
Pending → Cancelled → [*] (user action, with reason)
InProgress → Pending (navigate away, draft saved)
```

**Scopes:**
- `scopeOverdue($query)` — pending, due_date < today
- `scopeToday($query)` — pending, due_date = today
- `scopeUpcoming($query)` — pending, due_date > today AND due_date <= today + 30 days
- `scopeForUser($query, User $user)` — where assigned_user_id = user
- `scopeFlagged($query)` — where is_flagged = true
- `scopeOfType($query, string $type)` — filter by type

**Enums** (cast via `casts()` method on model):
```php
// CheckInStatusEnum — #[Label] and #[Colour] attributes on each case
case PENDING = 'pending';        // Generated but not yet actioned
case IN_PROGRESS = 'in_progress'; // Care partner opened form (draft state)
case COMPLETED = 'completed';     // Care partner submitted completion form
case MISSED = 'missed';           // Auto-transitioned after 30 days overdue
case CANCELLED = 'cancelled';     // User cancelled with mandatory reason

// CheckInTypeEnum
case INTERNAL = 'internal';  // Assigned to care partner
case EXTERNAL = 'external';  // Assigned to care coordinator
case AD_HOC = 'ad_hoc';      // Manually created outside scheduled cadence
```

**Constants** (domain thresholds only — not status/type values):
```php
/** Default cadence in months between scheduled check-ins */
public const DEFAULT_CADENCE_MONTHS = 3;

/** Number of days after due date before auto-marking as missed */
public const MISSED_THRESHOLD_DAYS = 30;

/** Number of failed attempts before flagging for team lead attention */
public const FLAG_THRESHOLD_ATTEMPTS = 3;
```

### CheckInAttempt

Records each failed contact attempt on a check-in.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigIncrements` | Primary key |
| `check_in_id` | `foreignId` | `->constrained()->cascadeOnDelete()` |
| `user_id` | `foreignId` | `->constrained('users')->nullOnDelete()` — who logged the attempt |
| `reason` | `string(50)` | `no_answer`, `client_unavailable`, `wrong_number`, `client_declined`, `other` |
| `notes` | `text->nullable()` | Optional notes about the attempt |
| `attempted_at` | `datetime` | When the attempt was made |
| `created_at` / `updated_at` | `timestamps` | |

**Relationships:**
- `checkIn()` → BelongsTo CheckIn
- `user()` → BelongsTo User

**Enum** (`AttemptReasonEnum` — cast via `casts()` method):
```php
case NO_ANSWER = 'no_answer';               // Phone rang but no one answered
case CLIENT_UNAVAILABLE = 'client_unavailable'; // Client answered but unable to participate
case WRONG_NUMBER = 'wrong_number';           // Phone number on file is incorrect
case CLIENT_DECLINED = 'client_declined';     // Client explicitly declined
case OTHER = 'other';                         // Other reason — details in notes field
```

### RiskCheckInQuestion

A question defined by the clinical team on a risk record, inherited by check-ins.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigIncrements` | Primary key |
| `risk_id` | `foreignId` | `->constrained()->cascadeOnDelete()` |
| `question_text` | `text` | The question to ask during check-in |
| `answer_type` | `string(30)` | `free_text`, `yes_no`, `multiple_choice`, `rating_1_5` |
| `answer_options` | `json->nullable()` | For `multiple_choice` — array of option strings |
| `created_by_id` | `foreignId` | `->constrained('users')->nullOnDelete()` |
| `sort_order` | `unsignedSmallInteger->default(0)` | Display ordering within a risk |
| `created_at` / `updated_at` | `timestamps` | |

**Relationships:**
- `risk()` → BelongsTo Risk
- `createdBy()` → BelongsTo User
- `responses()` → HasMany CheckInResponse

**Enum** (`AnswerTypeEnum` — cast via `casts()` method):
```php
case FREE_TEXT = 'free_text';           // Free-form text response
case YES_NO = 'yes_no';                 // Yes or No binary response
case MULTIPLE_CHOICE = 'multiple_choice'; // Select from predefined options
case RATING_1_5 = 'rating_1_5';         // Rating scale 1-5
```

### CheckInResponse

An answer to a risk-based question provided during check-in completion.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigIncrements` | Primary key |
| `check_in_id` | `foreignId` | `->constrained()->cascadeOnDelete()` |
| `risk_check_in_question_id` | `foreignId` | `->constrained()->cascadeOnDelete()` |
| `risk_id` | `foreignId` | `->constrained()->nullOnDelete()` — denormalized for query efficiency |
| `response_value` | `text` | The answer (free text, "yes"/"no", selected option, or rating number) |
| `responded_by_id` | `foreignId` | `->constrained('users')->nullOnDelete()` |
| `responded_at` | `datetime` | When the response was given |
| `created_at` / `updated_at` | `timestamps` | |

**Relationships:**
- `checkIn()` → BelongsTo CheckIn
- `question()` → BelongsTo RiskCheckInQuestion
- `risk()` → BelongsTo Risk
- `respondedBy()` → BelongsTo User

### ClientCadenceSetting

Per-client override of the default check-in frequency (P3 — schema created now, UI deferred).

| Column | Type | Notes |
|--------|------|-------|
| `id` | `bigIncrements` | Primary key |
| `client_id` | `foreignId` | `->constrained('packages_clients')->unique()` — one per client |
| `cadence_months` | `unsignedTinyInteger` | Override value (1, 2, 3, 6, 12) |
| `set_by_id` | `foreignId` | `->constrained('users')->nullOnDelete()` |
| `effective_date` | `date` | When this cadence takes effect |
| `created_at` / `updated_at` | `timestamps` | |

**Relationships:**
- `client()` → BelongsTo PackagesClient
- `setBy()` → BelongsTo User

---

## API Contracts

### Dashboard Integration

Dashboard check-in data is served via the existing `DashboardRepository` pattern. The `getCheckInActivitiesForCarePartner()` method is replaced (behind feature flag) with a query against the new `check_ins` table.

```
No new route needed — existing dashboard controller already calls DashboardRepository.
Feature flag `care-partner-check-ins` switches between old (package-date) and new (record-based) logic.
```

### Check-In Routes

All routes under `staff/check-ins` prefix, protected by `web.authenticated` middleware + feature flag.

| Method | URI | Controller@Method | Purpose |
|--------|-----|-------------------|---------|
| `GET` | `staff/check-ins/{checkIn}` | `CheckInController@show` | Completion page |
| `PUT` | `staff/check-ins/{checkIn}/complete` | `CheckInController@complete` | Submit completion |
| `PUT` | `staff/check-ins/{checkIn}/draft` | `CheckInController@saveDraft` | Save draft state |
| `PUT` | `staff/check-ins/{checkIn}/cancel` | `CheckInController@cancel` | Cancel with reason |
| `POST` | `staff/check-ins/{checkIn}/attempts` | `CheckInAttemptController@store` | Log failed attempt |
| `GET` | `staff/check-ins/report` | `CheckInReportController@index` | Completion report page |
| `GET` | `staff/check-ins/report/export` | `CheckInReportController@export` | CSV export |
| `POST` | `staff/clients/{client}/check-ins` | `AdHocCheckInController@store` | Create ad-hoc check-in |

### Risk Check-In Question Routes

Nested under risk routes but controller lives in CheckIn domain. Tab is rendered on the Package view.

| Method | URI | Controller@Method | Purpose |
|--------|-----|-------------------|---------|
| `GET` | `staff/risks/{risk}/check-in-questions` | `RiskCheckInQuestionController@index` | List questions for risk |
| `POST` | `staff/risks/{risk}/check-in-questions` | `RiskCheckInQuestionController@store` | Add question to risk |
| `PUT` | `staff/risks/{risk}/check-in-questions/{question}` | `RiskCheckInQuestionController@update` | Edit question |
| `DELETE` | `staff/risks/{risk}/check-in-questions/{question}` | `RiskCheckInQuestionController@destroy` | Remove question |

Note: The Package tab loads questions for all active risks on the package via the `PackageController@show` method (deferred prop), not via these routes. These routes serve the CRUD operations from the tab's forms.

### Data Classes

**CompleteCheckInData** — Validates completion form submission:
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class CompleteCheckInData extends Data
{
    public function __construct(
        #[Rule('required', 'string', 'max:10000')]
        public string $summaryNotes,

        #[Rule('required', 'integer', 'min:1', 'max:5')]
        public int $wellbeingRating,

        #[Rule('nullable', 'string', 'max:5000')]
        public ?string $followUpActions,

        /** @var array<int, CheckInResponseData> */
        #[Rule('array')]
        public array $responses,
    ) {}
}
```

**LogAttemptData** — Validates failed attempt logging:
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class LogAttemptData extends Data
{
    public function __construct(
        #[Rule('required', 'string', 'in:no_answer,client_unavailable,wrong_number,client_declined,other')]
        public string $reason,

        #[Rule('nullable', 'string', 'max:2000')]
        public ?string $notes,
    ) {}
}
```

**CancelCheckInData** — Validates cancellation:
```php
#[TypeScript]
#[MapName(SnakeCaseMapper::class)]
class CancelCheckInData extends Data
{
    public function __construct(
        #[Rule('required', 'string', 'max:255')]
        public string $cancellationReason,
    ) {}
}
```

---

## UI Components

### Shared TypeScript Types (`resources/js/types/check-in.d.ts`)

```typescript
type CheckInStatus = 'pending' | 'in_progress' | 'completed' | 'missed' | 'cancelled';
type CheckInType = 'internal' | 'external' | 'ad_hoc';
type AttemptReason = 'no_answer' | 'client_unavailable' | 'wrong_number' | 'client_declined' | 'other';
type AnswerType = 'free_text' | 'yes_no' | 'multiple_choice' | 'rating_1_5';

type CheckIn = {
    id: number;
    client: CheckInClient;
    package: CheckInPackage;
    assigned_user: CheckInUser | null;
    type: CheckInType;
    status: CheckInStatus;
    due_date: string;
    completed_at: string | null;
    completed_by: CheckInUser | null;
    wellbeing_rating: number | null;
    summary_notes: string | null;
    follow_up_actions: string | null;
    previous_summary: string | null;
    cancellation_reason: string | null;
    is_flagged: boolean;
    attempts: CheckInAttempt[];
    responses: CheckInResponse[];
    risk_questions: RiskCheckInQuestion[];
};

type CheckInClient = {
    id: number;
    full_name: string;
    preferred_name: string | null;
    date_of_birth: string;
    phone: string | null;
};

type CheckInPackage = {
    id: number;
    name: string;
    level: string;
};

type CheckInUser = {
    id: number;
    full_name: string;
};

type CheckInAttempt = {
    id: number;
    reason: AttemptReason;
    notes: string | null;
    attempted_at: string;
    user: CheckInUser;
};

type RiskCheckInQuestion = {
    id: number;
    risk_id: number;
    risk_name: string;
    question_text: string;
    answer_type: AnswerType;
    answer_options: string[] | null;
    sort_order: number;
};

type CheckInResponse = {
    id: number;
    risk_check_in_question_id: number;
    risk_id: number;
    response_value: string;
};

type CompletionReportRow = {
    care_partner: CheckInUser;
    team: string;
    due: number;
    completed: number;
    overdue: number;
    missed: number;
    completion_rate: number;
    flagged: number;
};
```

### Page Components

#### Show.vue (Check-In Completion Page)

- **Layout**: Two-column (1/3 context sidebar + 2/3 completion form)
- **Props**: `defineProps<Props>()` with named type:
  - `checkIn: CheckIn`
  - `attemptReasons: { value: AttemptReason; label: string }[]`
- **Emits**: None (form submission via `useForm`)
- **Form state**: Single `useForm` at page level with all completion fields:
  - `summary_notes: string`
  - `wellbeing_rating: number | null`
  - `follow_up_actions: string | null`
  - `responses: Record<number, string>` (keyed by question ID)
- **Common components reused**:
  - `CommonCard` — context sidebar panels
  - `CommonBadge` — INT/EXT type indicator, status badges
  - `CommonFormField` — wrapping each form input
  - `CommonTextarea` — summary notes, follow-up actions
  - `CommonRadioGroup` — yes/no questions, attempt reason (with `value-key="value"`)
  - `CommonSelectMenu` — multiple choice questions (with `value-key="value"`)
  - `CommonInput` — rating 1-5 (custom number buttons)
  - `CommonButton` — Save Draft, Complete Check-In, Log Attempt, Cancel
  - `CommonAlert` — attempt warning banner (amber, 3+ attempts)
- **New bespoke components** (feature-specific, not Common):
  - `WellbeingRating.vue` — 1-5 number button group with selected state. Feature-specific visual (not a general-purpose rating widget). Props: `modelValue: number | null`. Emits: `(e: 'update:modelValue', value: number): void`
  - `AttemptTimeline.vue` — numbered circles with connecting line showing attempt history. Feature-specific layout. Props: `attempts: CheckInAttempt[]`
  - `RiskQuestionGroup.vue` — collapsible section per risk with question fields. Props: `riskName: string`, `questions: RiskCheckInQuestion[]`, `responses: Record<number, string>`. Emits: `(e: 'update:responses', value: Record<number, string>): void`

#### Report.vue (Completion Report)

- **Props**: `defineProps<Props>()` with named type:
  - `rows: CompletionReportRow[]`
  - `filters: { period: string; team: string | null; type: CheckInType | null }`
  - `kpis: { completion_rate: number; completed: number; overdue: number; flagged: number }`
  - `teams: { value: string; label: string }[]`
- **Emits**: None (filter changes via `router.visit` with `preserveScroll`)
- **Common components reused**:
  - `CommonKpiCard` — 4 KPI cards (rate, completed, overdue, flagged)
  - `CommonCard` — wrapping the table
  - `CommonSelectMenu` — period, team, type filters
  - `CommonBadge` — completion rate color coding
  - `CommonButton` — CSV export
- **No Pinia store needed** — filter state lives in URL params via Inertia router, KPIs and rows come from server props

#### PackageCheckInQuestions.vue (New Tab on Package View)

Lives in `resources/js/Pages/Packages/tabs/PackageCheckInQuestions.vue` alongside `PackageRisks.vue`, etc. Added as a new tab to `PackageViewLayout` behind the `care-partner-check-ins` feature flag.

Shows all check-in questions across the package's active risks, grouped by risk. Includes question CRUD and recent responses.

- **Props**: `defineProps<Props>()` with named type:
  - `package: { id: number; name: string }`
  - `risks: { id: number; name: string; questions: RiskCheckInQuestion[] }[]`
  - `recentResponses: { check_in_id: number; client_name: string; completed_at: string; responses: CheckInResponse[] }[]`
- **Emits**: `defineEmits<Emits>()` with named type:
  - `(e: 'questionAdded'): void`
  - `(e: 'questionRemoved', id: number): void`
- **Form state**: `useForm` for the "Add New Question" form:
  - `risk_id: number | null` (select which risk to attach to)
  - `question_text: string`
  - `answer_type: string`
  - `answer_options: string[]`
- **Common components reused**:
  - `CommonFormField` + `CommonTextarea` — question text
  - `CommonSelectMenu` — answer type dropdown, risk selector
  - `CommonButton` — add, edit, delete actions
  - `CommonBadge` — answer type indicators, risk name badges
  - `CommonAlert` — info banner explaining question inheritance
- **No new Common components needed** — all patterns covered by existing components

### Dashboard Integration (Existing Component Modification)

The existing My Activities panel on the Care Partner Dashboard renders check-in cards. Behind the `care-partner-check-ins` feature flag, the data source switches from `DashboardRepository` package-date computation to the new `check_ins` table query.

- **Modifications to existing dashboard card component** (not a new component):
  - Add question count badge (`CommonBadge`)
  - Add attempt count indicator
  - Add INT/EXT type badge
  - Add "Flagged" amber badge when `is_flagged = true`
  - Add "First" purple badge when `previous_summary` is null
- **Feature flag**: `<HasFeatureFlag feature="care-partner-check-ins">` wraps the new card variant

---

## Implementation Phases

### Phase 1: Foundation (Backend Core)

**Goal**: Database schema, models, relationships, enums, and the daily cron job.

1. **Migrations** — Create all 5 tables (`check_ins`, `check_in_attempts`, `risk_check_in_questions`, `check_in_responses`, `client_cadence_settings`)
2. **Models** — `CheckIn`, `CheckInAttempt`, `RiskCheckInQuestion`, `CheckInResponse`, `ClientCadenceSetting` with relationships, casts, scopes, and constants
3. **Enums** — `CheckInStatusEnum`, `CheckInTypeEnum`, `AttemptReasonEnum`, `AnswerTypeEnum` all in `domain/CheckIn/Enums/` with `#[Label]`/`#[Colour]` attributes. Cast on models via `casts()` method. Remove string constants — enums are the single source of truth. Existing `app/Enums/CheckIn/` enums are deprecated in favour of the domain versions.
4. **Data classes** — `CheckInData`, `CompleteCheckInData`, `LogAttemptData`, `CancelCheckInData`, `CreateAdHocCheckInData`, `CheckInResponseData`, `CompletionReportFilterData`
5. **Feature flag** — Register `care-partner-check-ins` in Pennant with backend middleware + frontend component gating
6. **Daily cron job** — `ProcessCheckInsJob`: generate new check-ins for ACTIVE packages only (no ON_BOARDING, no TERMINATED), mark 30+ day overdue as Missed, generate replacement check-ins after Missed transitions
7. **Factories & seeders** — `CheckInFactory`, `CheckInAttemptFactory`, `RiskCheckInQuestionFactory` for testing
8. **Policy** — `CheckInPolicy` with `view`, `complete`, `cancel`, `logAttempt` methods returning `Response::allow()` / `Response::deny()`

### Phase 2: Actions & Controllers (Backend Features)

**Goal**: All business logic actions, controller endpoints, and API contracts.

1. **Actions** (all with `AsAction` trait):
   - `CompleteCheckInAction` — validates data, updates status, saves responses, schedules next check-in, snapshots summary for next
   - `LogCheckInAttemptAction` — creates attempt record, flags check-in if 3+ attempts
   - `CreateAdHocCheckInAction` — creates ad-hoc check-in with today's due date
   - `CancelCheckInAction` — cancels with mandatory reason, preserves audit trail
   - `GenerateCheckInsAction` — extracted logic from cron job for testability
2. **Controllers**:
   - `CheckInController` — `show()` with eager-loaded relationships + Inertia render, `complete()` with Data validation, `saveDraft()`, `cancel()`
   - `CheckInAttemptController` — `store()` for logging attempts
   - `CheckInReportController` — `index()` with aggregate queries + KPIs, `export()` with maatwebsite/excel
   - `AdHocCheckInController` — `store()` on client
   - `RiskCheckInQuestionController` — CRUD for clinical questions on risks
3. **Routes** — Register all routes with `feature-flag:care-partner-check-ins` middleware
4. **Dashboard integration** — Update `DashboardRepository::getCheckInActivitiesForCarePartner()` to query `check_ins` table when feature flag is active
5. **Export** — `CheckInCompletionExport` implementing `FromQuery`, `WithHeadings`, `WithMapping`
6. **Notification job** — New `CheckInNotificationJob` replacing the existing `CheckInNotificationsJob`, querying records instead of package dates. Scheduled weekly on Mon/Wed (matching existing cadence), gated by Nova setting flag. Sends digest of upcoming + overdue check-ins per care partner/coordinator.

### Phase 3: Frontend (Vue Pages)

**Goal**: All Vue pages and components with TypeScript types.

1. **Shared types** — `resources/js/types/check-in.d.ts`
2. **Show.vue** — Two-column completion page with all form fields, risk question groups, wellbeing rating, attempt timeline
3. **Report.vue** — KPI cards + filterable table with CSV export button
4. **PackageCheckInQuestions.vue** — New tab on PackageViewLayout with question CRUD grouped by risk and recent responses
5. **Dashboard card updates** — Enhance existing card with badges (question count, attempt count, type, flagged, first)
6. **Bespoke components** — `WellbeingRating.vue`, `AttemptTimeline.vue`, `RiskQuestionGroup.vue`

### Phase 4: Polish & Edge Cases

**Goal**: Draft persistence, edge case handling, and production readiness.

1. **Draft auto-save** — Server-side draft via `PUT /check-ins/{id}/draft` endpoint. Debounced auto-save (every 30s or on field blur). Status stays `in_progress` while draft. `beforeunload` warning when form is dirty and unsaved. Survives browser crash — no localStorage needed.
2. **Care partner reassignment** — Extend the existing `UpdateCaseManagerNotification` listener (currently a stub with empty `handle()`) to reassign pending check-ins when `PackageCaseManagerUpdated` event fires. No new listener or observer needed.
3. **Unassigned check-ins** — Handle clients with no care partner (flagged for coordination)
4. **Package stage filtering** — Cron job only processes ACTIVE packages (no SUSPENDED stage exists — ON_BOARDING and TERMINATED are naturally excluded). No new enum values needed.
5. **Edge case testing** — First check-in, no risks, concurrent INT/EXT, risk closed after question added, ad-hoc + scheduled overlap
6. **Performance** — Indexes on `check_ins` (`assigned_user_id`, `status`, `due_date`), report query optimization

---

## Testing Strategy

### Phase 1: Foundation Tests

**Unit Tests:**
- Model relationships and validation (CheckIn → attempts, responses, client, package)
- Scope methods (overdue, today, upcoming, forUser, flagged)
- Enum label/colour attributes
- Data class validation rules

**Feature Tests:**
- `ProcessCheckInsJob` — generates check-ins for due clients, skips duplicates, marks missed, generates replacements
- Factory-created check-ins with correct state transitions

### Phase 2: Action & Controller Tests

**Unit Tests:**
- `CompleteCheckInAction` — status transition, response saving, next check-in scheduling
- `LogCheckInAttemptAction` — attempt creation, flag threshold
- `GenerateCheckInsAction` — cadence calculation, assignment logic
- `CancelCheckInAction` — reason validation, audit preservation

**Feature Tests:**
- `CheckInController@show` — correct Inertia props, eager loading, authorization
- `CheckInController@complete` — form validation, status change, redirect
- `CheckInAttemptController@store` — attempt logged, flag set at 3
- `CheckInReportController@index` — KPI calculation, filter params
- `CheckInReportController@export` — CSV download headers/content
- `RiskCheckInQuestionController` — CRUD operations, authorization
- Feature flag gating — 403 when flag disabled

### Phase 3: Integration Tests

**Browser Tests (Dusk):**
- Complete a check-in end-to-end (dashboard → show → fill form → submit → back to dashboard)
- Log a failed attempt and verify attempt count
- Risk question CRUD on risk detail page
- Completion report filtering and export

### Test Execution Checklist

- [ ] Phase 1: Unit tests for models, scopes, enums
- [ ] Phase 1: Feature tests for cron job
- [ ] Phase 2: Unit tests for all actions
- [ ] Phase 2: Feature tests for all controllers
- [ ] Phase 2: Feature flag gating tests
- [ ] Phase 3: Browser tests for key user journeys
- [ ] Phase 4: Edge case tests (reassignment, suspension, concurrent types)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Dashboard performance with 15,000 clients | Medium | High | Composite index on (`assigned_user_id`, `status`, `due_date`), paginate upcoming. Per-care-partner queries scope to ~100 clients max. |
| Cron job timeout processing all clients | Low | High | Chunk processing, queue individual client batches, monitor job duration |
| Feature flag race condition during transition | Low | Medium | Feature flag is read-only toggle, no data migration needed for flag switch |
| Risk question inheritance complexity | Medium | Medium | Denormalize `risk_id` on responses, eager load with limit, test multi-risk scenarios |
| Care partner reassignment mid-check-in | Low | Low | Observer on Package `case_manager_id` change updates pending check-ins |
| Concurrent INT/EXT check-ins for same client | Low | Low | Type column distinguishes them, each assigned to different user role |

---

## Architecture Gate Check

**Date**: 2026-03-03
**Status**: PASS

### Technical Feasibility
- [x] Architecture approach clear — Domain model in `domain/CheckIn/`, controllers in existing staff namespace, daily cron job pattern established
- [x] Existing patterns leveraged — Follows `domain/` structure, `DashboardRepository` pattern, `AsAction` trait, Laravel Data validation
- [x] All requirements buildable — 12 stories mapped to models, actions, controllers, and Vue pages
- [x] Performance considered — Composite indexes, chunked cron processing, paginated reports
- [x] Security considered — `CheckInPolicy` with `Response::allow()/deny()`, role-based access, feature flag middleware

### Data & Integration
- [x] Data model understood — 5 tables with relationships, lifecycle states, constants documented
- [x] API contracts clear — 10 endpoints with methods, URIs, controllers, and Data class payloads
- [x] Dependencies identified — Risk model extension, DashboardRepository modification, notification job replacement, maatwebsite/excel
- [x] Integration points mapped — Dashboard (feature-flagged switch), Risk detail page (new tab), Client profile (ad-hoc creation)
- [x] DTO persistence explicit — Data classes validate input; actions explicitly map fields to model `create()`/`update()` calls

### Implementation Approach
- [x] File changes identified — Full project structure with paths for all new and modified files
- [x] Risk areas noted — Dashboard performance, cron timeout, risk question inheritance, care partner reassignment
- [x] Testing approach defined — Unit (models, actions), Feature (controllers, jobs), Browser (Dusk end-to-end)
- [x] Rollback possible — Feature flag disables all new UI, old package-date logic preserved, migrations are additive

### Resource & Scope
- [x] Scope matches spec — 10 MVP stories (P1+P2) covered, P3 deferred (cadence UI, system transition)
- [x] Effort reasonable — 4 phases, standard Laravel patterns, no novel architecture
- [x] Skills available — Standard Laravel/Vue/Inertia stack, team has existing domain expertise

### Laravel & Cross-Platform Best Practices
- [x] No hardcoded business logic in Vue — Status labels, attempt reasons, cadence values all from backend props
- [x] Cross-platform reusability — Actions return Data objects, controllers serve API-compatible responses
- [x] Laravel Data for validation — All request validation via Data classes (CompleteCheckInData, LogAttemptData, etc.)
- [x] Model route binding — Controllers accept `CheckIn $checkIn`, `Risk $risk` model instances
- [x] No magic numbers/IDs — All constants defined on models with PHPDoc (STATUS_PENDING, FLAG_THRESHOLD_ATTEMPTS, etc.)
- [x] Common components pure — CommonBadge, CommonCard, etc. receive props only, no business logic
- [x] Use Lorisleiva Actions — All actions use `AsAction` trait (CompleteCheckInAction, LogCheckInAttemptAction, etc.)
- [x] Action authorization in `authorize()` — Auth checks in action `authorize()` method, not in `handle()` or `asController()`
- [x] Data classes remain anemic — Data classes hold properties + validation rules only, business logic in Actions
- [x] Migrations schema-only — Migrations create tables/indexes, no data seeding
- [x] Models have single responsibility — CheckIn owns engagement lifecycle, RiskCheckInQuestion owns question definition, CheckInResponse owns answers
- [x] Granular model policies — `CheckInPolicy` with scoped permissions (view own vs view all, complete own only)
- [x] Response objects in auth — Policy methods return `Response::allow()` / `Response::deny('reason')`
- [x] Event sourcing: N/A — CheckIn domain uses standard Eloquent (not event-sourced). No aggregate needed for this domain.
- [x] Semantic column documentation — All non-trivial columns have PHPDoc on model constants and migration comments
- [x] Feature flags dual-gated — Backend: `feature-flag:care-partner-check-ins` middleware. Frontend: `<HasFeatureFlag>` component wrapping new UI

### Vue TypeScript Standards
- [x] All new/modified Vue components planned with `<script setup lang="ts">`
- [x] Props use named `type` — `type Props = { checkIn: CheckIn; attemptReasons: ... }` with `defineProps<Props>()`
- [x] Emits use named `type` — `type Emits = { (e: 'questionAdded'): void }` with `defineEmits<Emits>()`
- [x] No `any` types planned — All backend data shapes typed in `check-in.d.ts`
- [x] Shared types identified — `resources/js/types/check-in.d.ts` for cross-component types
- [x] Common components audited — Reusing CommonCard, CommonBadge, CommonButton, CommonFormField, CommonTextarea, CommonRadioGroup, CommonSelectMenu, CommonAlert, CommonKpiCard
- [x] New components assessed for common eligibility — WellbeingRating (bespoke: domain-specific 1-5 check-in scale), AttemptTimeline (bespoke: check-in-specific timeline), RiskQuestionGroup (bespoke: risk-scoped question rendering). None are general-purpose UI patterns.
- [x] Multi-step wizards: N/A — Completion page is a single-step form, not a wizard. Single `useForm` at page level.
- [x] Pinia stores: Not needed — Filter state in URL params (Inertia router), form state in `useForm`, page data from server props
- [x] Stores named after domain concerns: N/A — No stores proposed
- [x] Type declarations for untyped deps: N/A — No untyped `.js` imports planned

**Ready to Implement**: YES

---

## Development Clarifications

### Session 2026-03-03

- Q: Where should clinical check-in questions live? (Risk modal vs Package tab vs standalone page) → A: New tab on Package view — `PackageCheckInQuestions.vue` alongside existing tabs (PackageRisks, etc.). Questions grouped by risk within the tab. Feature-flagged.
- Q: How to handle package suspension when no SUSPENDED stage exists? → A: Filter on ACTIVE packages only (matches existing CheckInNotificationsJob pattern). ON_BOARDING and TERMINATED excluded. No suspension concept needed for V1.
- Q: Should we use the existing `PackageCaseManagerUpdated` event for check-in reassignment? → A: Extend existing `UpdateCaseManagerNotification` listener (currently stub with empty `handle()`) to reassign pending check-ins. No new listener or observer.
- Q: How should draft auto-save work? → A: Server-side draft via `PUT /check-ins/{id}/draft`. Debounced auto-save (30s or blur). Status stays `in_progress`. `beforeunload` warning. No localStorage needed.
- Q: What schedule for the new notification job? → A: Keep Mon/Wed weekly schedule (matching existing cadence). Gated by Nova setting flag.
- Q: Should RiskCheckInQuestionController live in Risk or CheckIn domain? → A: CheckIn domain controller (`app/Http/Controllers/Staff/CheckIn/`). Model stays in Risk domain. Easier to feature-flag as a group.
- Q: Use model constants, enums, or both for status/type values? → A: Enums only (`CheckInStatusEnum`, `CheckInTypeEnum`, `AttemptReasonEnum`, `AnswerTypeEnum`) with `#[Label]`/`#[Colour]` attributes. Cast on models. Domain threshold constants remain (DEFAULT_CADENCE_MONTHS, MISSED_THRESHOLD_DAYS, FLAG_THRESHOLD_ATTEMPTS).
- Q: Pre-compute or live-query the completion report? → A: Live query with composite indexes. ~5K records/quarter is small enough for live aggregation. GROUP BY assigned_user_id for per-care-partner rows.
