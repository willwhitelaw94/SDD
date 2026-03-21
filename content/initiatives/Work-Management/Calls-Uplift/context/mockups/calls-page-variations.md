---
title: "Calls Page - Layout Variations"
---

# Calls Page (`/staff/calls`) - 6 Layout Variations

## Option A: Standard Table with Filters

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔔 2 new calls ready for review                           [Review Now →]  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  Calls                                                      [+ New Filter] │
├─────────────────────────────────────────────────────────────────────────────┤
│  Date Range: [Last 7 days ▼]   Status: [Pending ▼]   Package: [All ▼]     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ☐ │ Date/Time          │ Duration │ Caller        │ Package     │ Status │
├────┼────────────────────┼──────────┼───────────────┼─────────────┼────────┤
│  ☐ │ Today 2:45 PM      │ 5:23     │ John Smith    │ QL-001234   │ 🟡 Pen │
│  ☐ │ Today 1:30 PM      │ 3:12     │ 0412 345 678  │ —           │ 🟡 Pen │
│  ☐ │ Today 11:15 AM     │ 8:45     │ Mary Jones    │ QL-005678   │ ✓ Rev  │
│  ☐ │ Yesterday 4:00 PM  │ 2:01     │ Unknown       │ —           │ 🟡 Pen │
└────┴────────────────────┴──────────┴───────────────┴─────────────┴────────┘
│                                               [◀ Prev] Page 1 of 5 [Next ▶]│
└─────────────────────────────────────────────────────────────────────────────┘
                              [Review Selected (2)]   [Mark Non-Package]
```

**Pros:** Familiar pattern, bulk actions visible, filter flexibility
**Cons:** Dense, may overwhelm new users

---

## Option B: Card-Based Inbox

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Calls Inbox                                    [All] [Pending] [Reviewed] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ 🟡 PENDING                                              Today 2:45 PM │  │
│  │ ──────────────────────────────────────────────────────────────────── │  │
│  │ 📞 John Smith  •  5:23 min  •  Inbound                               │  │
│  │ 📦 QL-001234 - Margaret Thompson (auto-matched)                      │  │
│  │ "Discussed upcoming service schedule changes..."                     │  │
│  │                                            [Review →]   [Skip]       │  │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ 🟡 PENDING                                              Today 1:30 PM │  │
│  │ ──────────────────────────────────────────────────────────────────── │  │
│  │ 📞 0412 345 678  •  3:12 min  •  Outbound                            │  │
│  │ ⚠️ No package match - requires linking                               │  │
│  │ "Called to follow up on medication query..."                         │  │
│  │                                            [Link & Review →]         │  │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** More context visible at a glance, AI summary preview
**Cons:** Less efficient for batch processing, more scrolling

---

## Option C: Split Panel (Master-Detail)

```
┌────────────────────────────────────┬────────────────────────────────────────┐
│  Pending Calls (4)                 │  Call Details                          │
├────────────────────────────────────┼────────────────────────────────────────┤
│                                    │                                        │
│  ▶ John Smith      5:23   2:45 PM  │  📞 John Smith                         │
│    QL-001234       🟡              │  ──────────────────────────────────    │
│  ─────────────────────────────     │  📅 Today 2:45 PM  •  Duration: 5:23   │
│    0412 345 678    3:12   1:30 PM  │  📱 +61 412 345 678  •  Inbound        │
│    No match        ⚠️              │                                        │
│  ─────────────────────────────     │  📦 Package                            │
│    Mary Jones      8:45   11:15    │  ┌──────────────────────────────────┐  │
│    QL-005678       ✓               │  │ QL-001234 - Margaret Thompson    │  │
│  ─────────────────────────────     │  │ Level 4 HCP  •  Beth P (coord)   │  │
│    Unknown         2:01   4:00 PM  │  └──────────────────────────────────┘  │
│    No match        ⚠️              │                                        │
│                                    │  📝 AI Summary                         │
│                                    │  ┌──────────────────────────────────┐  │
│                                    │  │ Discussed upcoming service       │  │
│                                    │  │ schedule changes. John confirmed │  │
│                                    │  │ new cleaning time works.         │  │
│                                    │  │              [View Full Text ▼]  │  │
│                                    │  └──────────────────────────────────┘  │
│                                    │                                        │
│                                    │  [Mark Non-Package] [Complete Review →]│
│                                    │                                        │
└────────────────────────────────────┴────────────────────────────────────────┘
```

**Pros:** See list and detail simultaneously, efficient workflow
**Cons:** Requires wider screen, more complex to build

---

## Option D: Kanban/Board View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Calls Board                                              [List View ≡]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │ 📥 NEEDS REVIEW   │  │ ⚠️ NEEDS LINKING  │  │ ✓ COMPLETED       │       │
│  │ (2)               │  │ (2)               │  │ (12 today)        │       │
│  ├───────────────────┤  ├───────────────────┤  ├───────────────────┤       │
│  │ ┌───────────────┐ │  │ ┌───────────────┐ │  │ ┌───────────────┐ │       │
│  │ │ John Smith    │ │  │ │ 0412 345 678  │ │  │ │ Mary Jones    │ │       │
│  │ │ 5:23 • 2:45pm │ │  │ │ 3:12 • 1:30pm │ │  │ │ 8:45 • 11:15a │ │       │
│  │ │ QL-001234     │ │  │ │ No package    │ │  │ │ QL-005678     │ │       │
│  │ └───────────────┘ │  │ └───────────────┘ │  │ └───────────────┘ │       │
│  │ ┌───────────────┐ │  │ ┌───────────────┐ │  │ ┌───────────────┐ │       │
│  │ │ Sarah Lee     │ │  │ │ Unknown       │ │  │ │ Tom Brown     │ │       │
│  │ │ 4:17 • 3:20pm │ │  │ │ 2:01 • 4:00pm │ │  │ │ 6:33 • 10:00a │ │       │
│  │ │ QL-009999     │ │  │ │ No package    │ │  │ │ QL-003456     │ │       │
│  │ └───────────────┘ │  │ └───────────────┘ │  │ └───────────────┘ │       │
│  │                   │  │                   │  │                   │       │
│  │                   │  │                   │  │      ⋮            │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Visual status at a glance, drag-and-drop potential
**Cons:** Unusual for call management, less information density

---

## Option E: Timeline/Feed View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Calls Timeline                                [Today ▼]  [Filter ▼]       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TODAY                                                                      │
│  │                                                                          │
│  ●─── 2:45 PM ────────────────────────────────────────────────────────      │
│  │   📞 Inbound from John Smith (5:23)                       🟡 Pending    │
│  │   📦 QL-001234 - Margaret Thompson                                      │
│  │   "Discussed upcoming service schedule..."                               │
│  │                                              [Review →]                  │
│  │                                                                          │
│  ●─── 1:30 PM ────────────────────────────────────────────────────────      │
│  │   📞 Outbound to 0412 345 678 (3:12)                     ⚠️ No Match    │
│  │   "Called to follow up on medication query..."                           │
│  │                                              [Link & Review →]           │
│  │                                                                          │
│  ●─── 11:15 AM ───────────────────────────────────────────────────────      │
│  │   📞 Inbound from Mary Jones (8:45)                      ✓ Reviewed     │
│  │   📦 QL-005678 - Robert Wilson                                          │
│  │   Activity logged: 8:45 care management                                  │
│  │                                                                          │
│  YESTERDAY                                                                  │
│  │                                                                          │
│  ●─── 4:00 PM ────────────────────────────────────────────────────────      │
│  │   📞 Inbound from Unknown (2:01)                         🟡 Pending     │
│  │                                              [Link & Review →]           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Chronological context, familiar social feed pattern
**Cons:** No bulk actions, less efficient for high volume

---

## Option F: Compact Table with Inline Expansion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Calls (4 pending)                          [Date ▼] [Status ▼] [🔍 Search]│
├─────────────────────────────────────────────────────────────────────────────┤
│  │ Caller          │ Duration │ Package      │ Status    │ Actions        │
├──┼─────────────────┼──────────┼──────────────┼───────────┼────────────────┤
│ ▼│ John Smith      │ 5:23     │ QL-001234    │ 🟡 Pending│ [Review]       │
├──┴─────────────────┴──────────┴──────────────┴───────────┴────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  📅 Today 2:45 PM  •  📱 +61 412 345 678  •  ↓ Inbound              │  │
│  │                                                                      │  │
│  │  📝 AI Summary:                                                      │  │
│  │  Discussed upcoming service schedule changes. John confirmed new     │  │
│  │  cleaning time works for Margaret.                                   │  │
│  │                                                    [View Full ▼]     │  │
│  │                                                                      │  │
│  │  📦 Package: QL-001234 - Margaret Thompson (auto-matched)            │  │
│  │                                                                      │  │
│  │              [Mark Non-Package]  [Add Note]  [Complete Review →]     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
├──┬─────────────────┬──────────┬──────────────┬───────────┬────────────────┤
│ ▶│ 0412 345 678    │ 3:12     │ ⚠️ No match  │ 🟡 Pending│ [Link]         │
├──┼─────────────────┼──────────┼──────────────┼───────────┼────────────────┤
│ ▶│ Mary Jones      │ 8:45     │ QL-005678    │ ✓ Reviewed│ [View]         │
├──┼─────────────────┼──────────┼──────────────┼───────────┼────────────────┤
│ ▶│ Unknown         │ 2:01     │ ⚠️ No match  │ 🟡 Pending│ [Link]         │
└──┴─────────────────┴──────────┴──────────────┴───────────┴────────────────┘
```

**Pros:** Compact list + detail in same view, best of both worlds
**Cons:** More complex interaction pattern

---

## Recommendation

**Option F (Compact Table with Inline Expansion)** is recommended because:

1. **Efficiency**: Quick scanning of pending calls in table
2. **Context**: Inline expansion shows AI summary without losing place
3. **Familiarity**: Similar to email/task management patterns
4. **Scalability**: Works for both few and many calls
5. **Batch potential**: Can still add bulk selection checkboxes

**Alternative**: Option C (Split Panel) if coordinators typically work through calls sequentially and screen width is available.
