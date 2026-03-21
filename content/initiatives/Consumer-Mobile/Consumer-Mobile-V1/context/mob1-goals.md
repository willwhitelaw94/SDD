---
title: "MOB1 - Goals"
description:
---

**Endpoints**: 1
**Build Effort**: Low - simple read

---

## Overview

Care goals represent the recipient's objectives for their care and support. In Phase 1, goals are read-only. Creating and editing goals will be added in Phase 2.

---

## Endpoints

| Endpoint                                     | Method | Status | Notes                              |
|----------------------------------------------|--------|--------|------------------------------------|
| `/api/v1/recipient/packages/{package}/goals` | GET    | ✅      | View goals (text field on Package) |

*Create/edit goals = Phase 2+*

---

## GET /api/v1/recipient/packages/{package}/goals

**Purpose**: View all care goals for the package.

**Authorization**: User must have access to the package

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Maintain independence at home",
      "description": "Continue living independently in my own home with support for daily activities",
      "category": "INDEPENDENCE",
      "priority": "HIGH",
      "status": "ACTIVE",
      "target_date": "2024-12-31",
      "created_by": "Sarah Johnson (Care Manager)",
      "created_at": "2024-01-15T10:00:00Z",
      "progress": {
        "percentage": 75,
        "notes": "Good progress with daily living skills"
      }
    },
    {
      "id": 2,
      "title": "Improve mobility and reduce falls risk",
      "description": "Work with physiotherapist to strengthen muscles and improve balance",
      "category": "HEALTH",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "target_date": "2024-06-30",
      "created_by": "Sarah Johnson (Care Manager)",
      "created_at": "2024-01-15T10:00:00Z",
      "progress": {
        "percentage": 40,
        "notes": "Attending weekly physio sessions"
      }
    },
    {
      "id": 3,
      "title": "Stay socially connected",
      "description": "Participate in community activities and maintain friendships",
      "category": "SOCIAL",
      "priority": "MEDIUM",
      "status": "ACTIVE",
      "target_date": null,
      "created_by": "Sarah Johnson (Care Manager)",
      "created_at": "2024-01-15T10:00:00Z",
      "progress": {
        "percentage": 60,
        "notes": "Attending lawn bowls weekly"
      }
    }
  ]
}
```

---

## Goal Categories

| Category        | Description                          | Examples                                |
|-----------------|--------------------------------------|-----------------------------------------|
| `INDEPENDENCE`  | Maintaining independent living       | Self-care, decision making              |
| `HEALTH`        | Physical and mental health           | Mobility, chronic disease management    |
| `SOCIAL`        | Social connections and participation | Community activities, friendships       |
| `SAFETY`        | Safety and wellbeing                 | Falls prevention, medication management |
| `LIFESTYLE`     | Quality of life and interests        | Hobbies, travel, personal interests     |

---

## Goal Status

| Status        | Description                   |
|---------------|-------------------------------|
| `ACTIVE`      | Current goal being worked on  |
| `IN_PROGRESS` | Progress being made           |
| `ACHIEVED`    | Goal successfully completed   |
| `ON_HOLD`     | Temporarily paused            |
| `ARCHIVED`    | No longer relevant            |

---

## Priority Levels

| Priority | Description                      |
|----------|----------------------------------|
| `HIGH`   | Critical to care plan            |
| `MEDIUM` | Important but not urgent         |
| `LOW`    | Nice to have, when possible      |

---

## Implementation Notes

### Current Implementation

Goals are currently stored as a simple text field on the Package model. The API endpoint structures this into a more useful format for the mobile app.

### Phase 1 Limitations

- **Read-only**: Recipients can view goals but cannot create/edit
- **Simple structure**: Goals lack detailed tracking and milestones
- **Manual updates**: Care managers update goals via portal

### Related Models

- `Domain\Package\Models\Package` (goals stored as text field)

### Policy Checks

```php
public function viewGoals(User $user, Package $package): Response
```

Recipients and accepted representatives can view goals.

---

## Future Enhancements (MOB2)

Phase 2 will add full goal management:

| Feature              | Description                        | Endpoints |
|----------------------|------------------------------------|-----------|
| Create goals         | Recipients can add their own goals | POST      |
| Edit goals           | Update existing goals              | PUT       |
| Mark goals achieved  | Mark goals as completed            | PATCH     |
| Goal milestones      | Break down into smaller steps      | Multiple  |
| Progress tracking    | Regular updates and notes          | Multiple  |

**Additional Endpoints (MOB2)**:
```
POST   /api/v1/recipient/packages/{package}/goals
PUT    /api/v1/recipient/packages/{package}/goals/{id}
DELETE /api/v1/recipient/packages/{package}/goals/{id}
PATCH  /api/v1/recipient/packages/{package}/goals/{id}/progress
```

---

## Related Documents

- [API Endpoints Overview](./API-ENDPOINTS)
- [MOB1 Packages APIs](./mob1-packages)
- [MOB1 Implementation Plan](../DESIGN)
