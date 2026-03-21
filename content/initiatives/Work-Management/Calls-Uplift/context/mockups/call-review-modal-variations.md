---
title: "Call Review Modal - Layout Variations"
---

# Call Review Modal/Panel - 5 Variations

## Option A: Standard Modal (Centered)

```
                    ┌─────────────────────────────────────────────────────────┐
                    │  ╳                                     Call Review       │
                    ├─────────────────────────────────────────────────────────┤
                    │                                                         │
                    │  📞 John Smith                         Today 2:45 PM    │
                    │  ────────────────────────────────────────────────────   │
                    │  📱 +61 412 345 678  •  ↓ Inbound  •  Duration: 5:23    │
                    │                                                         │
                    │  ┌───────────────────────────────────────────────────┐  │
                    │  │ 📦 LINKED PACKAGE                                 │  │
                    │  │                                                   │  │
                    │  │ QL-001234 - Margaret Thompson                     │  │
                    │  │ Level 4 HCP  •  Coordinator: Beth P               │  │
                    │  │                                    [Change ✏️]    │  │
                    │  └───────────────────────────────────────────────────┘  │
                    │                                                         │
                    │  📝 AI Summary                                          │
                    │  ┌───────────────────────────────────────────────────┐  │
                    │  │ Discussed upcoming service schedule changes.      │  │
                    │  │ John (son) confirmed the new cleaning time works  │  │
                    │  │ for Margaret. Requested callback next week.       │  │
                    │  │                                                   │  │
                    │  │                            [View Full Transcript ▼]│  │
                    │  └───────────────────────────────────────────────────┘  │
                    │                                                         │
                    │  📋 Case Note (optional)                               │
                    │  ┌───────────────────────────────────────────────────┐  │
                    │  │ [Use AI Summary]                                  │  │
                    │  │                                                   │  │
                    │  │ [Add your notes here...]                          │  │
                    │  │                                                   │  │
                    │  └───────────────────────────────────────────────────┘  │
                    │                                                         │
                    │  ┌─────────────────┐  ┌────────────────────────────┐    │
                    │  │ Mark Non-Package│  │    Complete Review →       │    │
                    │  └─────────────────┘  └────────────────────────────┘    │
                    │                                                         │
                    └─────────────────────────────────────────────────────────┘
```

**Pros:** Focused attention, familiar pattern
**Cons:** Loses page context, can't see other calls

---

## Option B: Side Panel (Slide-in)

```
┌─────────────────────────────────────┬───────────────────────────────────────┐
│  Calls (4 pending)                  │  Call Review                     ╳   │
├─────────────────────────────────────┼───────────────────────────────────────┤
│                                     │                                       │
│  │ Caller          │ Status    │   │  📞 John Smith                        │
├──┼─────────────────┼───────────┼   │  Today 2:45 PM  •  5:23  •  Inbound   │
│▶ │ John Smith      │ 🟡 Pending│   │  ────────────────────────────────     │
├──┼─────────────────┼───────────┼   │                                       │
│  │ 0412 345 678    │ 🟡 Pending│   │  📦 Package                           │
├──┼─────────────────┼───────────┼   │  ┌─────────────────────────────────┐  │
│  │ Mary Jones      │ ✓ Reviewed│   │  │ QL-001234 - Margaret Thompson   │  │
├──┼─────────────────┼───────────┼   │  │ Level 4 HCP                     │  │
│  │ Unknown         │ 🟡 Pending│   │  │                     [Change ✏️] │  │
│                                     │  └─────────────────────────────────┘  │
│                                     │                                       │
│                                     │  📝 AI Summary                        │
│                                     │  ┌─────────────────────────────────┐  │
│                                     │  │ Discussed service schedule      │  │
│                                     │  │ changes. Son confirmed new      │  │
│                                     │  │ cleaning time works.            │  │
│                                     │  │              [Full Transcript ▼]│  │
│                                     │  └─────────────────────────────────┘  │
│                                     │                                       │
│                                     │  📋 Case Note                         │
│                                     │  ┌─────────────────────────────────┐  │
│                                     │  │ [Use AI Summary]                │  │
│                                     │  │ [Add notes...]                  │  │
│                                     │  └─────────────────────────────────┘  │
│                                     │                                       │
│                                     │  [Non-Package]  [Complete Review →]   │
│                                     │                                       │
└─────────────────────────────────────┴───────────────────────────────────────┘
```

**Pros:** See list and detail, quick navigation between calls
**Cons:** Less space for detail, requires wider screen

---

## Option C: Wizard Steps (Multi-step)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Review Call: John Smith                                               ╳    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│     ●────────────────●────────────────○────────────────○                   │
│   1. Review        2. Package       3. Notes        4. Confirm              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 2: Confirm Package Link                                               │
│  ─────────────────────────────────────────────────────────────────          │
│                                                                             │
│  This call has been auto-matched to:                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  📦 QL-001234 - Margaret Thompson                                     │  │
│  │  ──────────────────────────────────────────────────────────────────   │  │
│  │  Level 4 HCP  •  Coordinator: Beth P                                  │  │
│  │  Last contact: 3 days ago                                             │  │
│  │                                                                       │  │
│  │  ○ Use this package                                                   │  │
│  │  ○ Search for different package                                       │  │
│  │  ○ Mark as non-package call                                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                                                                             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                             [← Back]      [Next: Notes →]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Clear progression, good for training new users
**Cons:** Too many clicks for experienced users, slower workflow

---

## Option D: Compact Card (Minimal)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────────┐  │
│    │  📞 John Smith  •  5:23  •  Inbound  •  Today 2:45 PM          ╳   │  │
│    ├─────────────────────────────────────────────────────────────────────┤  │
│    │                                                                     │  │
│    │  📦 QL-001234 - Margaret Thompson                   [Change ✏️]    │  │
│    │                                                                     │  │
│    │  📝 "Discussed service schedule changes. Son confirmed..."         │  │
│    │                                              [Expand ▼]            │  │
│    │                                                                     │  │
│    │  Case Note: [Use AI Summary ▼] ________________________________    │  │
│    │                                                                     │  │
│    │  ┌──────────────┐   ┌────────────────────────────────────────────┐ │  │
│    │  │ Non-Package  │   │          Complete Review →                 │ │  │
│    │  └──────────────┘   └────────────────────────────────────────────┘ │  │
│    │                                                                     │  │
│    └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Fast, minimal clicks, efficient for high volume
**Cons:** Less context visible, may need expansion for complex calls

---

## Option E: Full-Page Review (Dedicated Page)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Calls                                          [Skip] [Next →]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                     │    │
│  │    📞  CALL REVIEW                                                  │    │
│  │    ═══════════════════════════════════════════════════════════      │    │
│  │                                                                     │    │
│  │    John Smith  •  +61 412 345 678                                   │    │
│  │    Today 2:45 PM  •  5 minutes 23 seconds  •  Inbound               │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │  📦 LINKED PACKAGE             │  │  📝 AI SUMMARY                     │ │
│  │  ───────────────────────────   │  │  ────────────────────────────────  │ │
│  │                                │  │                                    │ │
│  │  QL-001234                     │  │  Discussed upcoming service        │ │
│  │  Margaret Thompson             │  │  schedule changes. John (son)      │ │
│  │  Level 4 HCP                   │  │  confirmed the new cleaning time   │ │
│  │  ─────────────────────────     │  │  works for Margaret. Requested     │ │
│  │  Coordinator: Beth P           │  │  callback next week to confirm     │ │
│  │  Last contact: 3 days ago      │  │  provider availability.            │ │
│  │                                │  │                                    │ │
│  │  [Change Package ✏️]           │  │  [View Full Transcript ▼]          │ │
│  │                                │  │                                    │ │
│  └────────────────────────────────┘  └────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  📋 CASE NOTE                                                       │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │                                                                     │    │
│  │  [Use AI Summary]  [Dictate 🎤]                                     │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │                                                             │   │    │
│  │  │  [Add your case note here...]                               │   │    │
│  │  │                                                             │   │    │
│  │  │                                                             │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────┐          ┌────────────────────────────────┐   │
│  │    Mark Non-Package      │          │      Complete Review →         │   │
│  └──────────────────────────┘          └────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Pros:** Maximum space for content, clear layout, room for dictation
**Cons:** Full page navigation, loses list context

---

## Recommendation

**Option B (Side Panel)** is recommended for Phase 1 because:

1. **Workflow**: Coordinators can quickly move between calls
2. **Context**: Always see the pending queue
3. **Efficiency**: No full page loads between reviews
4. **Consistency**: Similar to existing package detail panels

**Alternative**: Option D (Compact Card) for coordinators who want maximum speed and already know the workflow well. Could be a user preference setting.

---

## State Variations

### Loading State
```
┌───────────────────────────────────────┐
│  Call Review                     ╳   │
├───────────────────────────────────────┤
│                                       │
│  ┌─────────────────────────────────┐  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Loading transcription...             │
│                                       │
└───────────────────────────────────────┘
```

### No Package Match State
```
┌───────────────────────────────────────┐
│  Call Review                     ╳   │
├───────────────────────────────────────┤
│                                       │
│  ⚠️ No Package Match                  │
│  ────────────────────────────────     │
│                                       │
│  We couldn't match this phone number  │
│  to a package. Please search or mark  │
│  as non-package call.                 │
│                                       │
│  [🔍 Search for Package]              │
│                                       │
│  [Mark as Non-Package Call]           │
│                                       │
└───────────────────────────────────────┘
```

### Multiple Package Match State
```
┌───────────────────────────────────────┐
│  Call Review                     ╳   │
├───────────────────────────────────────┤
│                                       │
│  ⚠️ Multiple Packages Found           │
│  ────────────────────────────────     │
│                                       │
│  This phone number is linked to       │
│  multiple packages. Please select:    │
│                                       │
│  ○ QL-001234 - Margaret Thompson      │
│    Level 4 HCP  •  Beth P             │
│                                       │
│  ○ QL-005678 - Robert Thompson        │
│    Level 2 HCP  •  Sarah M            │
│                                       │
│  ○ QL-009999 - Jane Thompson          │
│    Level 3 HCP  •  Beth P             │
│                                       │
│                    [Continue →]       │
│                                       │
└───────────────────────────────────────┘
```
