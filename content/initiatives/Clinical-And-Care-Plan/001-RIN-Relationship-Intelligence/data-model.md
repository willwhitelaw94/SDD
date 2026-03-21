---
title: "Data Model: Relationship Intelligence"
---

# Data Model: Relationship Intelligence

**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md)

---

## Entity Relationship Overview

```
┌─────────────────────────────┐
│   User (Recipient)           │
│   (existing model)           │
│                              │
│  + best_call_time            │  ← New columns
│  + caution_flags (JSON)      │
│  + info_notes (JSON)         │
│                              │
│  hasMany → contextEntries    │
│  hasMany → touchpoints       │
│            (as recipient)    │
└──────┬──────┬────────────────┘
       │      │
       │      │ 1:N (user_id = recipient)
       │      ▼
       │  ┌──────────────────────────────┐
       │  │   PersonalContextEntry        │
       │  │   personal_context_entries    │
       │  │                               │
       │  │  user_id (FK → users)         │  ← Recipient
       │  │  category (enum)              │
       │  │  content (text)               │
       │  │  created_by (FK → users)      │  ← Coordinator
       │  │  updated_by (FK → users)      │
       │  │  created_at, updated_at       │
       │  │  deleted_at (soft delete)     │
       │  └──────────────────────────────┘
       │
       │ 1:N (user_id = recipient)
       ▼
  ┌──────────────────────────────────────┐
  │   Touchpoint                          │
  │   touchpoints                         │
  │                                       │
  │  user_id (FK → users)                 │  ← Recipient
  │  recorded_by (FK → users)             │  ← Coordinator
  │  date (date)                          │
  │  type (enum)                          │
  │  duration_minutes (int, nullable)     │
  │  activity (enum, nullable)            │
  │  sentiment (enum, nullable)           │
  │  notes (text, nullable)              │
  │  corrected_at (timestamp, nullable)   │
  │  corrected_by (FK → users, nullable) │
  │  retracted_at (timestamp, nullable)   │
  │  retracted_by (FK → users, nullable) │
  │  created_at, updated_at              │
  └──────────────────────────────────────┘
```

---

## Entities

### PersonalContextEntry

A piece of personal information about a client captured by a coordinator.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | auto | Primary key |
| `user_id` | `bigint unsigned` | No | — | FK to `users.id` — the **recipient** (client) this entry is about |
| `category` | `string(30)` | No | — | One of: `interests_hobbies`, `family_household`, `important_dates`, `general_notes` |
| `content` | `text` | No | — | Free-text content (e.g., "Loves gardening", "Grandkids visit every Sunday") |
| `created_by` | `bigint unsigned` | No | — | FK to `users.id` — the coordinator who created this entry |
| `updated_by` | `bigint unsigned` | Yes | null | FK to `users.id` — the coordinator who last updated this entry |
| `created_at` | `timestamp` | No | now | Creation timestamp |
| `updated_at` | `timestamp` | No | now | Last update timestamp |
| `deleted_at` | `timestamp` | Yes | null | Soft delete timestamp |

**Indexes:**
- `user_id` — FK index for recipient lookup
- `user_id, category` — compound index for category-grouped queries
- `created_by` — FK index

**Relationships:**
- `belongsTo User` (as `user` / recipient)
- `belongsTo User` (as `createdBy` / coordinator)
- `belongsTo User` (as `updatedBy` / coordinator)

**Scope:** Client-level (not package-level). Visible across all packages for the same client.

**Soft delete:** Entries are soft-deleted, never hard-deleted. Supports undo within the 24-hour edit window.

---

### Touchpoint

A recorded interaction between a coordinator and a client.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `bigint unsigned` | No | auto | Primary key |
| `user_id` | `bigint unsigned` | No | — | FK to `users.id` — the **recipient** (client) this touchpoint is about |
| `recorded_by` | `bigint unsigned` | No | — | FK to `users.id` — the coordinator who recorded this touchpoint |
| `date` | `date` | No | today | Date of the interaction (back-dating allowed) |
| `type` | `string(20)` | No | — | One of: `phone_call`, `in_person_visit`, `video_call`, `email` |
| `duration_minutes` | `smallint unsigned` | Yes | null | Call/visit duration in minutes (1-240) |
| `activity` | `string(40)` | Yes | null | Primary activity category — one of: `monitoring_review`, `care_planning`, `organising_adjusting_services`, `navigating_options`, `supporting_feedback_complaints` |
| `sentiment` | `string(15)` | Yes | null | Coordinator gut-check — one of: `happy`, `neutral`, `concerned`. Optional |
| `notes` | `text` | Yes | null | Free-text notes about the conversation |
| `corrected_at` | `timestamp` | Yes | null | When a correction was applied to this touchpoint |
| `corrected_by` | `bigint unsigned` | Yes | null | FK to `users.id` — who applied the correction |
| `retracted_at` | `timestamp` | Yes | null | When this touchpoint was retracted (soft-voided) |
| `retracted_by` | `bigint unsigned` | Yes | null | FK to `users.id` — who retracted the touchpoint |
| `created_at` | `timestamp` | No | now | Creation timestamp |
| `updated_at` | `timestamp` | No | now | Last update timestamp |

**Indexes:**
- `user_id` — FK index for recipient lookup
- `user_id, date` — compound index for "last touchpoint" and compliance queries
- `recorded_by` — FK index
- `user_id, created_at` — for monthly compliance: "has this client been contacted this month?"

**Relationships:**
- `belongsTo User` (as `user` / recipient)
- `belongsTo User` (as `recordedBy` / coordinator)
- `belongsTo User` (as `correctedBy` / nullable)
- `belongsTo User` (as `retractedBy` / nullable)

**Scope:** Client-level (not package-level).

**Corrections:** Touchpoints are append-only in spirit. Instead of editing a touchpoint, a correction is applied:
- `CorrectTouchpoint` action updates fields and sets `corrected_at` + `corrected_by`
- `RetractTouchpoint` action sets `retracted_at` + `retracted_by` — the touchpoint is voided
- Projections/queries filter out retracted touchpoints by default
- Full audit trail preserved: original values can be recovered from model history (if using Spatie Activity Log or similar)

**24-hour edit window:** Coordinators can correct their own touchpoints within 24 hours of `created_at`. After 24 hours, only Team Leaders (users with `manage-touchpoints` permission) can issue corrections.

---

### User (existing — extended)

Three new columns on the existing `users` table:

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `best_call_time` | `string(50)` | Yes | null | Preferred time to call (e.g., "Mornings before 10am", "After lunch") |
| `caution_flags` | `json` | Yes | null | Array of caution/warning strings (e.g., `["Hard of hearing — speak clearly"]`). Displayed with amber warning icon |
| `info_notes` | `json` | Yes | null | Array of informational note strings (e.g., `["Prefers phone calls"]`). Displayed with blue info icon |

**Already exists on User:**
- `preferred_name` — displayed as "Call them 'Maggie'"
- `timezone` — used for live clock display
- `language` — if not on User, check related models

---

## Enums

### PersonalContextCategory

```php
enum PersonalContextCategory: string
{
    case INTERESTS_HOBBIES = 'interests_hobbies';
    case FAMILY_HOUSEHOLD = 'family_household';
    case IMPORTANT_DATES = 'important_dates';
    case GENERAL_NOTES = 'general_notes';
}
```

### TouchpointType

```php
enum TouchpointType: string
{
    case PHONE_CALL = 'phone_call';
    case IN_PERSON_VISIT = 'in_person_visit';
    case VIDEO_CALL = 'video_call';
    case EMAIL = 'email';
}
```

### TouchpointActivity

Aligned to Support at Home care management billing categories.

```php
enum TouchpointActivity: string
{
    case MONITORING_REVIEW = 'monitoring_review';
    case CARE_PLANNING = 'care_planning';
    case ORGANISING_ADJUSTING_SERVICES = 'organising_adjusting_services';
    case NAVIGATING_OPTIONS = 'navigating_options';
    case SUPPORTING_FEEDBACK_COMPLAINTS = 'supporting_feedback_complaints';
}
```

### TouchpointSentiment

```php
enum TouchpointSentiment: string
{
    case HAPPY = 'happy';
    case NEUTRAL = 'neutral';
    case CONCERNED = 'concerned';
}
```

### NoteCategory

Categories for Quick Notes panel. Aligns with existing note category patterns.

```php
enum NoteCategory: string
{
    case DIRECT_CARE_CHECK_IN = 'direct_care_check_in';
    case SERVICE_COORDINATION = 'service_coordination';
    case SERVICE_CHANGES = 'service_changes';
    case BUDGET_MANAGEMENT = 'budget_management';
    case FINANCIAL_ENQUIRY = 'financial_enquiry';
    case ASSESSMENT_CARE_PLANNING = 'assessment_care_planning';
    case CLINICAL_ACTIVITY = 'clinical_activity';
    case PROVIDER_COORDINATION = 'provider_coordination';
    case CRISIS_CONTACT = 'crisis_contact';
    case INCIDENT_MANAGEMENT = 'incident_management';
}
```

---

## Computed Data (Not Stored)

### Personal Touch Prompts

Generated at view time by `GeneratePersonalTouchPrompts` action. No database table.

**Sources (in priority order, max 3 prompts):**

1. **Last touchpoint notes** — Extract topics mentioned in the most recent touchpoint's notes field. Simple approach: surface the full note content as a prompt prefix ("Last time we chatted you mentioned..."). Phase 2: keyword extraction
2. **Important Dates** — Personal context entries in `important_dates` category where the date is within 7 days of today
3. **Interests/Family entries** — Fallback: random selection from `interests_hobbies` and `family_household` entries

**Output shape:**

```php
class PersonalTouchPromptData extends Data
{
    public function __construct(
        public string $text,
        public string $source, // 'last_conversation' | 'important_date' | 'personal_context'
        public ?string $sourceDetail, // e.g., "18 Feb touchpoint" or "Birthday: 15 Mar"
    ) {}
}
```

### Operational Context

Aggregated at view time from existing models. No new tables.

```php
class OperationalContextData extends Data
{
    public function __construct(
        public int $billsOnHoldCount,
        public int $activeComplaintsCount,
        public ?int $managementPlanDueDays, // null if no plan due
        public ?int $checkInOverdueDays,     // null if not overdue
    ) {}
}
```

### Last Conversation

Most recent non-retracted touchpoint for the client.

```php
class LastConversationData extends Data
{
    public function __construct(
        public string $coordinatorName,
        public string $date,
        public ?int $durationMinutes,
        public ?TouchpointSentiment $sentiment,
        public TouchpointType $type,
        public ?TouchpointActivity $activity,
        public ?string $notes,
    ) {}
}
```

---

## Migration Plan

### Migration 1: Create personal_context_entries table

```php
Schema::create('personal_context_entries', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->comment('Recipient this entry is about');
    $table->string('category', 30)->comment('interests_hobbies, family_household, important_dates, general_notes');
    $table->text('content');
    $table->foreignId('created_by')->constrained('users')->comment('Coordinator who created');
    $table->foreignId('updated_by')->nullable()->constrained('users')->comment('Coordinator who last updated');
    $table->timestamps();
    $table->softDeletes();

    $table->index(['user_id', 'category']);
});
```

### Migration 2: Create touchpoints table

```php
Schema::create('touchpoints', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->comment('Recipient this touchpoint is about');
    $table->foreignId('recorded_by')->constrained('users')->comment('Coordinator who recorded');
    $table->date('date')->comment('Date of interaction, back-dating allowed');
    $table->string('type', 20)->comment('phone_call, in_person_visit, video_call, email');
    $table->smallInteger('duration_minutes')->unsigned()->nullable()->comment('Duration in minutes, 1-240');
    $table->string('activity', 40)->nullable()->comment('Support at Home activity category');
    $table->string('sentiment', 15)->nullable()->comment('happy, neutral, concerned — optional');
    $table->text('notes')->nullable();
    $table->timestamp('corrected_at')->nullable();
    $table->foreignId('corrected_by')->nullable()->constrained('users');
    $table->timestamp('retracted_at')->nullable();
    $table->foreignId('retracted_by')->nullable()->constrained('users');
    $table->timestamps();

    $table->index(['user_id', 'date']);
    $table->index(['user_id', 'created_at']);
});
```

### Migration 3: Add essentials columns to users table

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('best_call_time', 50)->nullable()->after('timezone')->comment('Preferred call time, e.g. "Mornings before 10am"');
    $table->json('caution_flags')->nullable()->after('best_call_time')->comment('Array of caution/warning strings');
    $table->json('info_notes')->nullable()->after('caution_flags')->comment('Array of informational note strings');
});
```

---

## Queries

### Monthly Compliance Check

```php
// Has this client been contacted this calendar month?
Touchpoint::query()
    ->where('user_id', $recipientId)
    ->whereNull('retracted_at')
    ->whereMonth('date', now()->month)
    ->whereYear('date', now()->year)
    ->exists();
```

### Days Since Last Contact

```php
Touchpoint::query()
    ->where('user_id', $recipientId)
    ->whereNull('retracted_at')
    ->latest('date')
    ->value('date');
// Then: Carbon::parse($lastDate)->diffInDays(now())
```

### Last Conversation

```php
Touchpoint::query()
    ->where('user_id', $recipientId)
    ->whereNull('retracted_at')
    ->with('recordedBy:id,first_name,last_name')
    ->latest('date')
    ->first();
```
